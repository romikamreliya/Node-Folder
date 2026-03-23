class AppError extends Error {
  constructor({message = "ERROR", type}) {
    super(message);
    this.name = "AppError";
    this.type = type;
  }
}

module.exports = AppError;