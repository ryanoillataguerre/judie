from dataclasses import dataclass
from enum import Enum
from typing import List, Dict, Optional


class Role(Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


@dataclass
class ChatTurn:
    role: Role
    content: str


class History:
    chat_turns_list: List[ChatTurn]

    def __init__(self):
        self.chat_turns_list = []

    def add_turn(self, turn: ChatTurn) -> None:
        """
        Mechanism for constructing a History.  Take a new turn and push it onto the end of the
        existing history.
        :param turn: New turn to append to history
        :return:
        """
        self.chat_turns_list.append(turn)

    def get_last_user_message(self) -> Optional[str]:
        i = 1
        while i <= len(self.chat_turns_list):
            if self.chat_turns_list[-1 * i].role == Role.USER:
                return self.chat_turns_list[-1 * i].content
            i += 1
        return None

    def get_openai_format(self) -> List[Dict]:
        openai_fmt_list = []
        for turn in self.chat_turns_list:
            openai_fmt_list.append({"role": turn.role.value, "content": turn.content})
        return openai_fmt_list


@dataclass
class SessionConfig:
    history: History
    subject: Optional[str] = None
