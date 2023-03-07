import inference_service_pb2

class InferenceService(inference_service_pb2.):
    """
    Class to define the behavior of the Inference Service
    """

    def GetChatResponse(self) -> None:
        raise NotImplementedError