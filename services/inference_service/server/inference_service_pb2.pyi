from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class ChatDetails(_message.Message):
    __slots__ = ["chat_id", "subject"]
    CHAT_ID_FIELD_NUMBER: _ClassVar[int]
    SUBJECT_FIELD_NUMBER: _ClassVar[int]
    chat_id: str
    subject: str
    def __init__(
        self, chat_id: _Optional[str] = ..., subject: _Optional[str] = ...
    ) -> None: ...

class ConnectedCheckResponse(_message.Message):
    __slots__ = ["connected"]
    CONNECTED_FIELD_NUMBER: _ClassVar[int]
    connected: bool
    def __init__(self, connected: bool = ...) -> None: ...

class ReturnConnectedCheck(_message.Message):
    __slots__ = ["returnCheck"]
    RETURNCHECK_FIELD_NUMBER: _ClassVar[int]
    returnCheck: bool
    def __init__(self, returnCheck: bool = ...) -> None: ...

class TutorResponse(_message.Message):
    __slots__ = ["responsePart"]
    RESPONSEPART_FIELD_NUMBER: _ClassVar[int]
    responsePart: str
    def __init__(self, responsePart: _Optional[str] = ...) -> None: ...
