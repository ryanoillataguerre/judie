/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "inferenceServiceServer";

export interface ChatDetails {
  chatId: string;
}

export interface TutorResponse {
  responsePart: string;
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

  create(base?: DeepPartial<ChatDetails>): ChatDetails {
    return ChatDetails.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ChatDetails>): ChatDetails {
    const message = createBaseChatDetails();
    message.chatId = object.chatId ?? "";
    return message;
  },
};

function createBaseTutorResponse(): TutorResponse {
  return { responsePart: "" };
}

export const TutorResponse = {
  encode(
    message: TutorResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.responsePart !== "") {
      writer.uint32(10).string(message.responsePart);
    }
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
    };
  },

  toJSON(message: TutorResponse): unknown {
    const obj: any = {};
    if (message.responsePart !== "") {
      obj.responsePart = message.responsePart;
    }
    return obj;
  },

  create(base?: DeepPartial<TutorResponse>): TutorResponse {
    return TutorResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<TutorResponse>): TutorResponse {
    const message = createBaseTutorResponse();
    message.responsePart = object.responsePart ?? "";
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

  create(base?: DeepPartial<ReturnConnectedCheck>): ReturnConnectedCheck {
    return ReturnConnectedCheck.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ReturnConnectedCheck>): ReturnConnectedCheck {
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

  create(base?: DeepPartial<ConnectedCheckResponse>): ConnectedCheckResponse {
    return ConnectedCheckResponse.fromPartial(base ?? {});
  },
  fromPartial(
    object: DeepPartial<ConnectedCheckResponse>
  ): ConnectedCheckResponse {
    const message = createBaseConnectedCheckResponse();
    message.connected = object.connected ?? false;
    return message;
  },
};

export type InferenceServiceDefinition = typeof InferenceServiceDefinition;
export const InferenceServiceDefinition = {
  name: "InferenceService",
  fullName: "inferenceServiceServer.InferenceService",
  methods: {
    getChatResponse: {
      name: "GetChatResponse",
      requestType: ChatDetails,
      requestStream: false,
      responseType: TutorResponse,
      responseStream: true,
      options: {},
    },
    serverConnectionCheck: {
      name: "ServerConnectionCheck",
      requestType: ReturnConnectedCheck,
      requestStream: false,
      responseType: ConnectedCheckResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface InferenceServiceImplementation<CallContextExt = {}> {
  getChatResponse(
    request: ChatDetails,
    context: CallContext & CallContextExt
  ): ServerStreamingMethodResult<DeepPartial<TutorResponse>>;
  serverConnectionCheck(
    request: ReturnConnectedCheck,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<ConnectedCheckResponse>>;
}

export interface InferenceServiceClient<CallOptionsExt = {}> {
  getChatResponse(
    request: DeepPartial<ChatDetails>,
    options?: CallOptions & CallOptionsExt
  ): AsyncIterable<TutorResponse>;
  serverConnectionCheck(
    request: DeepPartial<ReturnConnectedCheck>,
    options?: CallOptions & CallOptionsExt
  ): Promise<ConnectedCheckResponse>;
}

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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export type ServerStreamingMethodResult<Response> = {
  [Symbol.asyncIterator](): AsyncIterator<Response, void>;
};
