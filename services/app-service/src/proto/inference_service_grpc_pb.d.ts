// package: inferenceServiceServer
// file: inference_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as inference_service_pb from "./inference_service_pb";

interface IInferenceServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getChatResponse: IInferenceServiceService_IGetChatResponse;
    serverConnectionCheck: IInferenceServiceService_IServerConnectionCheck;
}

interface IInferenceServiceService_IGetChatResponse extends grpc.MethodDefinition<inference_service_pb.ChatDetails, inference_service_pb.TutorResponse> {
    path: "/inferenceServiceServer.InferenceService/GetChatResponse";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<inference_service_pb.ChatDetails>;
    requestDeserialize: grpc.deserialize<inference_service_pb.ChatDetails>;
    responseSerialize: grpc.serialize<inference_service_pb.TutorResponse>;
    responseDeserialize: grpc.deserialize<inference_service_pb.TutorResponse>;
}
interface IInferenceServiceService_IServerConnectionCheck extends grpc.MethodDefinition<inference_service_pb.ReturnConnectedCheck, inference_service_pb.ConnectedCheckResponse> {
    path: "/inferenceServiceServer.InferenceService/ServerConnectionCheck";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<inference_service_pb.ReturnConnectedCheck>;
    requestDeserialize: grpc.deserialize<inference_service_pb.ReturnConnectedCheck>;
    responseSerialize: grpc.serialize<inference_service_pb.ConnectedCheckResponse>;
    responseDeserialize: grpc.deserialize<inference_service_pb.ConnectedCheckResponse>;
}

export const InferenceServiceService: IInferenceServiceService;

export interface IInferenceServiceServer {
    getChatResponse: grpc.handleServerStreamingCall<inference_service_pb.ChatDetails, inference_service_pb.TutorResponse>;
    serverConnectionCheck: grpc.handleUnaryCall<inference_service_pb.ReturnConnectedCheck, inference_service_pb.ConnectedCheckResponse>;
}

export interface IInferenceServiceClient {
    getChatResponse(request: inference_service_pb.ChatDetails, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<inference_service_pb.TutorResponse>;
    getChatResponse(request: inference_service_pb.ChatDetails, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<inference_service_pb.TutorResponse>;
    serverConnectionCheck(request: inference_service_pb.ReturnConnectedCheck, callback: (error: grpc.ServiceError | null, response: inference_service_pb.ConnectedCheckResponse) => void): grpc.ClientUnaryCall;
    serverConnectionCheck(request: inference_service_pb.ReturnConnectedCheck, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: inference_service_pb.ConnectedCheckResponse) => void): grpc.ClientUnaryCall;
    serverConnectionCheck(request: inference_service_pb.ReturnConnectedCheck, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: inference_service_pb.ConnectedCheckResponse) => void): grpc.ClientUnaryCall;
}

export class InferenceServiceClient extends grpc.Client implements IInferenceServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getChatResponse(request: inference_service_pb.ChatDetails, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<inference_service_pb.TutorResponse>;
    public getChatResponse(request: inference_service_pb.ChatDetails, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<inference_service_pb.TutorResponse>;
    public serverConnectionCheck(request: inference_service_pb.ReturnConnectedCheck, callback: (error: grpc.ServiceError | null, response: inference_service_pb.ConnectedCheckResponse) => void): grpc.ClientUnaryCall;
    public serverConnectionCheck(request: inference_service_pb.ReturnConnectedCheck, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: inference_service_pb.ConnectedCheckResponse) => void): grpc.ClientUnaryCall;
    public serverConnectionCheck(request: inference_service_pb.ReturnConnectedCheck, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: inference_service_pb.ConnectedCheckResponse) => void): grpc.ClientUnaryCall;
}
