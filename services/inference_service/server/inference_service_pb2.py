# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: inference_service.proto
"""Generated protocol buffer code."""
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database

# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(
    b'\n\x17inference_service.proto\x12\x16inferenceServiceServer"?\n\x0c\x43onversation\x12/\n\x05turns\x18\x01 \x03(\x0b\x32 .inferenceServiceServer.ConvTurn"+\n\x08\x43onvTurn\x12\x0e\n\x06sender\x18\x01 \x01(\t\x12\x0f\n\x07message\x18\x02 \x01(\t"%\n\rTutorResponse\x12\x14\n\x0cresponsePart\x18\x01 \x01(\t2v\n\x10InferenceService\x12\x62\n\x0fGetChatResponse\x12$.inferenceServiceServer.Conversation\x1a%.inferenceServiceServer.TutorResponse"\x00\x30\x01\x62\x06proto3'
)

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, "inference_service_pb2", globals())
if _descriptor._USE_C_DESCRIPTORS == False:
    DESCRIPTOR._options = None
    _CONVERSATION._serialized_start = 51
    _CONVERSATION._serialized_end = 114
    _CONVTURN._serialized_start = 116
    _CONVTURN._serialized_end = 159
    _TUTORRESPONSE._serialized_start = 161
    _TUTORRESPONSE._serialized_end = 198
    _INFERENCESERVICE._serialized_start = 200
    _INFERENCESERVICE._serialized_end = 318
# @@protoc_insertion_point(module_scope)
