from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ConvTurn(_message.Message):
    __slots__ = ["student_query", "tutor_response"]
    STUDENT_QUERY_FIELD_NUMBER: _ClassVar[int]
    TUTOR_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    student_query: str
    tutor_response: str
    def __init__(self, student_query: _Optional[str] = ..., tutor_response: _Optional[str] = ...) -> None: ...

class Conversation(_message.Message):
    __slots__ = ["query", "turn"]
    QUERY_FIELD_NUMBER: _ClassVar[int]
    TURN_FIELD_NUMBER: _ClassVar[int]
    query: str
    turn: _containers.RepeatedCompositeFieldContainer[ConvTurn]
    def __init__(self, query: _Optional[str] = ..., turn: _Optional[_Iterable[_Union[ConvTurn, _Mapping]]] = ...) -> None: ...

class TutorResponse(_message.Message):
    __slots__ = ["response"]
    RESPONSE_FIELD_NUMBER: _ClassVar[int]
    response: str
    def __init__(self, response: _Optional[str] = ...) -> None: ...
