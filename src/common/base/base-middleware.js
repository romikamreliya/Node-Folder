const constants = require("../utils/constants");
const helperUtil = require("../utils/helper.util");
const responseUtil = require("../utils/response.util");
const loggerUtil = require("../utils/logger.util");
const ajvUtil = require("../utils/ajv.util");
const tokenUtil = require("../utils/token.util");
const storageUtil = require("../utils/storage.util");
const dateUtil = require("../utils/date.util");
const i18nUtil = require("../utils/i18n.util");
const AppError = require("../errors/app-error");

class BaseMiddleware {
  static ajv = ajvUtil;
  static constants = constants;
  static date = dateUtil;
  static helper = helperUtil;
  static i18n = i18nUtil;
  static logger = loggerUtil;
  static response = responseUtil;
  static token = tokenUtil;
  static storage = storageUtil;
  static appError = AppError;
}

module.exports = BaseMiddleware;
