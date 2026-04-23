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

class BaseMqtt {
  constructor() {
    this.ajv = ajvUtil;
    this.constants = constants;
    this.date = dateUtil;
    this.helper = helperUtil;
    this.i18n = i18nUtil;
    this.logger = loggerUtil;
    this.response = responseUtil;
    this.token = tokenUtil;
    this.storageUtil = storageUtil;
    this.appError = AppError;
  }
}

module.exports = BaseMqtt;
