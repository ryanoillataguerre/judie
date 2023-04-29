from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import (
    ClassVar as _ClassVar,
    Iterable as _Iterable,
    Mapping as _Mapping,
    Optional as _Optional,
    Union as _Union,
)

DESCRIPTOR: _descriptor.FileDescriptor

class ConvTurn(_message.Message):
    __slots__ = ["message", "sender"]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    SENDER_FIELD_NUMBER: _ClassVar[int]
    message: str
    sender: str
    def __init__(
        self, sender: _Optional[str] = ..., message: _Optional[str] = ...
    ) -> None: ...

class Conversation(_message.Message):
    __slots__ = ["turns"]
    TURNS_FIELD_NUMBER: _ClassVar[int]
    turns: _containers.RepeatedCompositeFieldContainer[ConvTurn]
    def __init__(
        self, turns: _Optional[_Iterable[_Union[ConvTurn, _Mapping]]] = ...
    ) -> None: ...

class TutorResponse(_message.Message):
    __slots__ = ["responsePart"]
    RESPONSEPART_FIELD_NUMBER: _ClassVar[int]
    responsePart: str
    def __init__(self, responsePart: _Optional[str] = ...) -> None: ...
