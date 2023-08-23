from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Mapping as _Mapping, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class ChatDetails(_message.Message):
    __slots__ = ["chat_id"]
    CHAT_ID_FIELD_NUMBER: _ClassVar[int]
    chat_id: str
    def __init__(self, chat_id: _Optional[str] = ...) -> None: ...

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
    __slots__ = ["chatMetaData", "responsePart"]

    class ChatMetaDataEntry(_message.Message):
        __slots__ = ["key", "value"]
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(
            self, key: _Optional[str] = ..., value: _Optional[str] = ...
        ) -> None: ...
    CHATMETADATA_FIELD_NUMBER: _ClassVar[int]
    RESPONSEPART_FIELD_NUMBER: _ClassVar[int]
    chatMetaData: _containers.ScalarMap[str, str]
    responsePart: str
    def __init__(
        self,
        responsePart: _Optional[str] = ...,
        chatMetaData: _Optional[_Mapping[str, str]] = ...,
    ) -> None: ...
