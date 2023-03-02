class CustomError extends Error {
  code: number;
  details?: Object;

  constructor(message: string, code: number, details?: Object) {
    super(message);
    this.code = code;
    this.name = "CustomError";

    if (details) {
      this.details = details;
    }
  }
}

export default CustomError;
