/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientReadableStream,
  ClientUnaryCall,
  handleServerStreamingCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal.js";

export const protobufPackage = "inferenceServiceServer";

export interface ChatDetails {
  chatId: string;
}

export interface TutorResponse {
  responsePart: string;
  chatMetaData: { [key: string]: string };
}

export interface TutorResponse_ChatMetaDataEntry {
  key: string;
  value: string;
}

export interface ReturnConnectedCheck {
  returnCheck: boolean;
}

export interface ConnectedCheckResponse {
  connected: boolean;
}

function createBaseChatDetails(): ChatDetails {
  return { chatId: "" };
}

export const ChatDetails = {
  encode(
    message: ChatDetails,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chatId !== "") {
      writer.uint32(10).string(message.chatId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatDetails {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.chatId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatDetails {
    return { chatId: isSet(object.chatId) ? String(object.chatId) : "" };
  },

  toJSON(message: ChatDetails): unknown {
    const obj: any = {};
    if (message.chatId !== "") {
      obj.chatId = message.chatId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChatDetails>, I>>(base?: I): ChatDetails {
    return ChatDetails.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChatDetails>, I>>(
    object: I
  ): ChatDetails {
    const message = createBaseChatDetails();
    message.chatId = object.chatId ?? "";
    return message;
  },
};

function createBaseTutorResponse(): TutorResponse {
  return { responsePart: "", chatMetaData: {} };
}

export const TutorResponse = {
  encode(
    message: TutorResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.responsePart !== "") {
      writer.uint32(10).string(message.responsePart);
    }
    Object.entries(message.chatMetaData).forEach(([key, value]) => {
      TutorResponse_ChatMetaDataEntry.encode(
        { key: key as any, value },
        writer.uint32(18).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TutorResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTutorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.responsePart = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          const entry2 = TutorResponse_ChatMetaDataEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry2.value !== undefined) {
            message.chatMetaData[entry2.key] = entry2.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TutorResponse {
    return {
      responsePart: isSet(object.responsePart)
        ? String(object.responsePart)
        : "",
      chatMetaData: isObject(object.chatMetaData)
        ? Object.entries(object.chatMetaData).reduce<{ [key: string]: string }>(
            (acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            },
            {}
          )
        : {},
    };
  },

  toJSON(message: TutorResponse): unknown {
    const obj: any = {};
    if (message.responsePart !== "") {
      obj.responsePart = message.responsePart;
    }
    if (message.chatMetaData) {
      const entries = Object.entries(message.chatMetaData);
      if (entries.length > 0) {
        obj.chatMetaData = {};
        entries.forEach(([k, v]) => {
          obj.chatMetaData[k] = v;
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TutorResponse>, I>>(
    base?: I
  ): TutorResponse {
    return TutorResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TutorResponse>, I>>(
    object: I
  ): TutorResponse {
    const message = createBaseTutorResponse();
    message.responsePart = object.responsePart ?? "";
    message.chatMetaData = Object.entries(object.chatMetaData ?? {}).reduce<{
      [key: string]: string;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseTutorResponse_ChatMetaDataEntry(): TutorResponse_ChatMetaDataEntry {
  return { key: "", value: "" };
}

export const TutorResponse_ChatMetaDataEntry = {
  encode(
    message: TutorResponse_ChatMetaDataEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): TutorResponse_ChatMetaDataEntry {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTutorResponse_ChatMetaDataEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TutorResponse_ChatMetaDataEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: TutorResponse_ChatMetaDataEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TutorResponse_ChatMetaDataEntry>, I>>(
    base?: I
  ): TutorResponse_ChatMetaDataEntry {
    return TutorResponse_ChatMetaDataEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TutorResponse_ChatMetaDataEntry>, I>>(
    object: I
  ): TutorResponse_ChatMetaDataEntry {
    const message = createBaseTutorResponse_ChatMetaDataEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseReturnConnectedCheck(): ReturnConnectedCheck {
  return { returnCheck: false };
}

export const ReturnConnectedCheck = {
  encode(
    message: ReturnConnectedCheck,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.returnCheck === true) {
      writer.uint32(8).bool(message.returnCheck);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ReturnConnectedCheck {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReturnConnectedCheck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.returnCheck = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReturnConnectedCheck {
    return {
      returnCheck: isSet(object.returnCheck)
        ? Boolean(object.returnCheck)
        : false,
    };
  },

  toJSON(message: ReturnConnectedCheck): unknown {
    const obj: any = {};
    if (message.returnCheck === true) {
      obj.returnCheck = message.returnCheck;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ReturnConnectedCheck>, I>>(
    base?: I
  ): ReturnConnectedCheck {
    return ReturnConnectedCheck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ReturnConnectedCheck>, I>>(
    object: I
  ): ReturnConnectedCheck {
    const message = createBaseReturnConnectedCheck();
    message.returnCheck = object.returnCheck ?? false;
    return message;
  },
};

function createBaseConnectedCheckResponse(): ConnectedCheckResponse {
  return { connected: false };
}

export const ConnectedCheckResponse = {
  encode(
    message: ConnectedCheckResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.connected === true) {
      writer.uint32(8).bool(message.connected);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ConnectedCheckResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectedCheckResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.connected = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ConnectedCheckResponse {
    return {
      connected: isSet(object.connected) ? Boolean(object.connected) : false,
    };
  },

  toJSON(message: ConnectedCheckResponse): unknown {
    const obj: any = {};
    if (message.connected === true) {
      obj.connected = message.connected;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConnectedCheckResponse>, I>>(
    base?: I
  ): ConnectedCheckResponse {
    return ConnectedCheckResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConnectedCheckResponse>, I>>(
    object: I
  ): ConnectedCheckResponse {
    const message = createBaseConnectedCheckResponse();
    message.connected = object.connected ?? false;
    return message;
  },
};

export type InferenceServiceService = typeof InferenceServiceService;
export const InferenceServiceService = {
  getChatResponse: {
    path: "/inferenceServiceServer.InferenceService/GetChatResponse",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: ChatDetails) =>
      Buffer.from(ChatDetails.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ChatDetails.decode(value),
    responseSerialize: (value: TutorResponse) =>
      Buffer.from(TutorResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TutorResponse.decode(value),
  },
  serverConnectionCheck: {
    path: "/inferenceServiceServer.InferenceService/ServerConnectionCheck",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReturnConnectedCheck) =>
      Buffer.from(ReturnConnectedCheck.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ReturnConnectedCheck.decode(value),
    responseSerialize: (value: ConnectedCheckResponse) =>
      Buffer.from(ConnectedCheckResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ConnectedCheckResponse.decode(value),
  },
} as const;

export interface InferenceServiceServer extends UntypedServiceImplementation {
  getChatResponse: handleServerStreamingCall<ChatDetails, TutorResponse>;
  serverConnectionCheck: handleUnaryCall<
    ReturnConnectedCheck,
    ConnectedCheckResponse
  >;
}

export interface InferenceServiceClient extends Client {
  getChatResponse(
    request: ChatDetails,
    options?: Partial<CallOptions>
  ): ClientReadableStream<TutorResponse>;
  getChatResponse(
    request: ChatDetails,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<TutorResponse>;
  serverConnectionCheck(
    request: ReturnConnectedCheck,
    callback: (
      error: ServiceError | null,
      response: ConnectedCheckResponse
    ) => void
  ): ClientUnaryCall;
  serverConnectionCheck(
    request: ReturnConnectedCheck,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ConnectedCheckResponse
    ) => void
  ): ClientUnaryCall;
  serverConnectionCheck(
    request: ReturnConnectedCheck,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ConnectedCheckResponse
    ) => void
  ): ClientUnaryCall;
}

export const InferenceServiceClient = makeGenericClientConstructor(
  InferenceServiceService,
  "inferenceServiceServer.InferenceService"
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>
  ): InferenceServiceClient;
  service: typeof InferenceServiceService;
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
