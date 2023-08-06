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
    chat_list: List[ChatTurn]

    def __init__(self):
        self.chat_list = []

    def add_turn(self, turn: ChatTurn) -> None:
        """
        Mechanism for constructing a History.  Take a new turn and push it onto the end of the
        existing history.
        :param turn: New turn to append to history
        :return:
        """
        self.chat_list.append(turn)

    def get_last_user_message(self) -> Optional[str]:
        i = 1
        while i <= len(self.chat_list):
            if self.chat_list[-1 * i].role == Role.USER:
                return self.chat_list[-1 * i].content
            i += 1
        return None

    def get_openai_format(self) -> List[Dict]:
        raise NotImplementedError


@dataclass
class SessionConfig:
    history: History
    subject: Optional[str] = None
