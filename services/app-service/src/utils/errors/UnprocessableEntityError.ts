import CustomError from "./CustomError";

class UnprocessableEntityError extends CustomError {
  constructor(message: string, code: number = 422, details?: Object) {
    super(message, code, details);
    this.name = "UnprocessableEntityError";
  }
}

export default UnprocessableEntityError;
