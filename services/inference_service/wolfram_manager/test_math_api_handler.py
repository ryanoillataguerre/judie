from inference_service.test_client.testing_utils import env_setup
from inference_service.wolfram_manager import math_api_handler


def test_pull_show_steps(env_setup):
    response = math_api_handler.pull_show_steps("Integral of ln(cos(x))")
    print(response)
