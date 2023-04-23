// package: inferenceServiceServer
// file: inference_service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Conversation extends jspb.Message { 
    clearTurnList(): void;
    getTurnList(): Array<ConvTurn>;
    setTurnList(value: Array<ConvTurn>): Conversation;
    addTurn(value?: ConvTurn, index?: number): ConvTurn;

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
        turnList: Array<ConvTurn.AsObject>,
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
    getResponse(): string;
    setResponse(value: string): TutorResponse;

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
        response: string,
    }
}
