const constants = require("../utils/constants");
const helperUtils = require("../utils/helper.utils");
const responseUtils = require("../utils/response.utils");
const loggerUtils = require("../utils/logger.utils");
const ajvUtils = require("../utils/ajv.utils");
const tokenUtils = require("../utils/token.utils");
const dateUtility = require("../utils/date.utils");
const i18nUtility = require("../utils/i18n.utils");
const appErrorUtility = require("../utils/appError.utils");

class baseServices {
  constructor() {
    this.constants = constants;
    this.helper = helperUtils;
    this.logger = loggerUtils;
    this.ajv = ajvUtils;
    this.token = tokenUtils;
    this.date = dateUtility;
    this.i18n = i18nUtility;
    this.appError = appErrorUtility;
  }
}

module.exports = baseServices;
