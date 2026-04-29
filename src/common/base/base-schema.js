const constants = require("../utils/constants");
const helperUtil = require("../utils/helper.util");
const loggerUtil = require("../utils/logger.util");
const ajvUtil = require("../utils/ajv.util");
const dateUtil = require("../utils/date.util");
const AppError = require("../errors/app-error");

class BaseSchema {
  static constants = constants;
  static helper = helperUtil;
  static logger = loggerUtil;
  static ajv = ajvUtil;
  static date = dateUtil;
  static appError = AppError;

  static commonFields = {
    page: this.ajv.prop("integer", { minimum: 1 }),
    limit: this.ajv.prop("integer", { minimum: 1, maximum: 100 }),
    search: this.ajv.prop("string", { minLength: 1, maxLength: 255 }),
    pagination: this.ajv.prop("boolean"),
    sortOrder: this.ajv.prop("string", { enum: Object.values(this.constants.orderByOptions) }),
  }

}

module.exports = BaseSchema;
