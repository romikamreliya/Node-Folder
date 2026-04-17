const constants = require("../utils/constants");
const helperUtil = require("../utils/helper.util");
const responseUtil = require("../utils/response.util");
const loggerUtil = require("../utils/logger.util");
const ajvUtil = require("../utils/ajv.util");
const tokenUtil = require("../utils/token.util");
const dateUtil = require("../utils/date.util");
const i18nUtil = require("../utils/i18n.util");
const AppError = require("../errors/app-error");
const PasswordUtil = require("../utils/password.util");

class BaseService {
  constructor() {
    this.constants = constants;
    this.helper = helperUtil;
    this.logger = loggerUtil;
    this.ajv = ajvUtil;
    this.token = tokenUtil;
    this.date = dateUtil;
    this.i18n = i18nUtil;
    this.appError = AppError;
    this.response = responseUtil;
    this.password = PasswordUtil;
  }
}

module.exports = BaseService;
