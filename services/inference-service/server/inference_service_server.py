import inference_service_pb2

class InferenceService(inference_service_pb2.InferenceServiceServicer):
    """
    Class to define the behavior of the Inference Service
    """

    def GetChatResponse(self, request, context) -> None:
        raise NotImplementedError