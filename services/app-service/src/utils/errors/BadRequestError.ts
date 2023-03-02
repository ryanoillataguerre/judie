import CustomError from "./CustomError";

class BadRequestError extends CustomError {
  constructor(message: string, code: number = 400, details?: Object) {
    super(message, code, details);
    this.name = "BadRequestError";
  }
}

export default BadRequestError;
