from dataclasses import dataclass
from enum import Enum
from typing import List, Dict, Optional
from collections import deque


class Role(Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


@dataclass
class ChatTurn:
    role: Role
    content: str


class History:
    _chat_turns_list: List[ChatTurn]

    def __init__(self):
        self._chat_turns_list = []

    def add_turn(self, turn: ChatTurn) -> None:
        """
        Mechanism for constructing a History.  Take a new turn and push it onto the end of the
        existing history.
        :param turn: New turn to append to history
        :return:
        """
        self._chat_turns_list.append(turn)

    def get_last_user_message(self) -> Optional[str]:
        i = 1
        while i <= len(self._chat_turns_list):
            if self._chat_turns_list[-1 * i].role == Role.USER:
                return self._chat_turns_list[-1 * i].content
            i += 1
        return None

    def get_openai_format(self, length_limit: Optional[int] = None) -> List[Dict]:
        openai_fmt_queue = deque()
        running_length = 0

        for turn in reversed(self._chat_turns_list):
            if length_limit is not None:
                running_length += len(turn.content)
                if running_length > length_limit:
                    break

            openai_fmt_queue.appendleft(
                {"role": turn.role.value, "content": turn.content}
            )

        return list(openai_fmt_queue)

    def last_msg_is_user(self) -> bool:
        if len(self._chat_turns_list) == 0:
            return False
        if self._chat_turns_list[-1].role == Role.USER:
            return True
        return False

    def get_last_n_single_string(self, last_n: int = 5) -> str:
        i = 1
        history_block = ""

        while i <= last_n and i <= len(self._chat_turns_list):
            chat = self._chat_turns_list[-1 * i]
            if chat.role == Role.USER:
                history_block = "Student: " + chat.content + "\n" + history_block
            elif chat.role == Role.ASSISTANT:
                history_block = "Tutor: " + chat.content + "\n" + history_block
            i += 1

        return history_block


@dataclass
class SessionConfig:
    history: History
    chat_id: Optional[str]
    subject: Optional[str] = None
    special_context: Optional[List[str]] = None
    user_type: Optional[str] = None
