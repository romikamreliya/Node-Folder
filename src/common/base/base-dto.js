const constants = require("../utils/constants");
const helperUtil = require("../utils/helper.util");
const loggerUtil = require("../utils/logger.util");
const ajvUtil = require("../utils/ajv.util");
const dateUtil = require("../utils/date.util");
const AppError = require("../errors/app-error");

class BaseDTO {
  static constants = constants;
  static helper = helperUtil;
  static logger = loggerUtil;
  static ajv = ajvUtil;
  static date = dateUtil;
  static appError = AppError;
}

module.exports = BaseDTO;
