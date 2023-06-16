// package: inferenceServiceServer
// file: inference_service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class ChatDetails extends jspb.Message { 
    getChatId(): string;
    setChatId(value: string): ChatDetails;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChatDetails.AsObject;
    static toObject(includeInstance: boolean, msg: ChatDetails): ChatDetails.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ChatDetails, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChatDetails;
    static deserializeBinaryFromReader(message: ChatDetails, reader: jspb.BinaryReader): ChatDetails;
}

export namespace ChatDetails {
    export type AsObject = {
        chatId: string,
    }
}

export class TutorResponse extends jspb.Message { 
    getResponsepart(): string;
    setResponsepart(value: string): TutorResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TutorResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TutorResponse): TutorResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TutorResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TutorResponse;
    static deserializeBinaryFromReader(message: TutorResponse, reader: jspb.BinaryReader): TutorResponse;
}

export namespace TutorResponse {
    export type AsObject = {
        responsepart: string,
    }
}

export class ReturnConnectedCheck extends jspb.Message { 
    getReturncheck(): boolean;
    setReturncheck(value: boolean): ReturnConnectedCheck;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReturnConnectedCheck.AsObject;
    static toObject(includeInstance: boolean, msg: ReturnConnectedCheck): ReturnConnectedCheck.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReturnConnectedCheck, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReturnConnectedCheck;
    static deserializeBinaryFromReader(message: ReturnConnectedCheck, reader: jspb.BinaryReader): ReturnConnectedCheck;
}

export namespace ReturnConnectedCheck {
    export type AsObject = {
        returncheck: boolean,
    }
}

export class ConnectedCheckResponse extends jspb.Message { 
    getConnected(): boolean;
    setConnected(value: boolean): ConnectedCheckResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConnectedCheckResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConnectedCheckResponse): ConnectedCheckResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConnectedCheckResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConnectedCheckResponse;
    static deserializeBinaryFromReader(message: ConnectedCheckResponse, reader: jspb.BinaryReader): ConnectedCheckResponse;
}

export namespace ConnectedCheckResponse {
    export type AsObject = {
        connected: boolean,
    }
}
