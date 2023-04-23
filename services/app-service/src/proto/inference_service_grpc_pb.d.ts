// package: inferenceServiceServer
// file: inference_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as inference_service_pb from "./inference_service_pb";

interface IInferenceServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getChatResponse: IInferenceServiceService_IGetChatResponse;
}

interface IInferenceServiceService_IGetChatResponse extends grpc.MethodDefinition<inference_service_pb.Conversation, inference_service_pb.TutorResponse> {
    path: "/inferenceServiceServer.InferenceService/GetChatResponse";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<inference_service_pb.Conversation>;
    requestDeserialize: grpc.deserialize<inference_service_pb.Conversation>;
    responseSerialize: grpc.serialize<inference_service_pb.TutorResponse>;
    responseDeserialize: grpc.deserialize<inference_service_pb.TutorResponse>;
}

export const InferenceServiceService: IInferenceServiceService;

export interface IInferenceServiceServer {
    getChatResponse: grpc.handleUnaryCall<inference_service_pb.Conversation, inference_service_pb.TutorResponse>;
}

export interface IInferenceServiceClient {
    getChatResponse(request: inference_service_pb.Conversation, callback: (error: grpc.ServiceError | null, response: inference_service_pb.TutorResponse) => void): grpc.ClientUnaryCall;
    getChatResponse(request: inference_service_pb.Conversation, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: inference_service_pb.TutorResponse) => void): grpc.ClientUnaryCall;
    getChatResponse(request: inference_service_pb.Conversation, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: inference_service_pb.TutorResponse) => void): grpc.ClientUnaryCall;
}

export class InferenceServiceClient extends grpc.Client implements IInferenceServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getChatResponse(request: inference_service_pb.Conversation, callback: (error: grpc.ServiceError | null, response: inference_service_pb.TutorResponse) => void): grpc.ClientUnaryCall;
    public getChatResponse(request: inference_service_pb.Conversation, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: inference_service_pb.TutorResponse) => void): grpc.ClientUnaryCall;
    public getChatResponse(request: inference_service_pb.Conversation, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: inference_service_pb.TutorResponse) => void): grpc.ClientUnaryCall;
}
