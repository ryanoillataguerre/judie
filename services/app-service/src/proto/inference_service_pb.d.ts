// package: inferenceServiceServer
// file: inference_service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Conversation extends jspb.Message { 
    clearTurnsList(): void;
    getTurnsList(): Array<ConvTurn>;
    setTurnsList(value: Array<ConvTurn>): Conversation;
    addTurns(value?: ConvTurn, index?: number): ConvTurn;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Conversation.AsObject;
    static toObject(includeInstance: boolean, msg: Conversation): Conversation.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Conversation, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Conversation;
    static deserializeBinaryFromReader(message: Conversation, reader: jspb.BinaryReader): Conversation;
}

export namespace Conversation {
    export type AsObject = {
        turnsList: Array<ConvTurn.AsObject>,
    }
}

export class ConvTurn extends jspb.Message { 
    getSender(): string;
    setSender(value: string): ConvTurn;
    getMessage(): string;
    setMessage(value: string): ConvTurn;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConvTurn.AsObject;
    static toObject(includeInstance: boolean, msg: ConvTurn): ConvTurn.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConvTurn, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConvTurn;
    static deserializeBinaryFromReader(message: ConvTurn, reader: jspb.BinaryReader): ConvTurn;
}

export namespace ConvTurn {
    export type AsObject = {
        sender: string,
        message: string,
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
