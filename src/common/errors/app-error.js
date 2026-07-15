class AppError extends Error {
  constructor({ message = "", type = "INTERNAL_SERVER_ERROR", statusCode = 500, code = null, context = null }) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
  }
}

module.exports = AppError;
