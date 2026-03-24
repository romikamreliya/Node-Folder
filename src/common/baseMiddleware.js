const constants = require("../utils/constants");
const helperUtils = require("../utils/helper.utils");
const responseUtils = require("../utils/response.utils");
const loggerUtils = require("../utils/logger.utils");
const ajvUtils = require("../utils/ajv.utils");
const tokenUtils = require("../utils/token.utils");
const uploadUtility = require("../utils/upload.utils");
const dateUtility = require("../utils/date.utils");
const i18nUtility = require("../utils/i18n.utils");
const appErrorUtility = require("../utils/appError.utils");

class baseMiddleware {

  static ajv = ajvUtils;
  static constants = constants;
  static date = dateUtility;
  static helper = helperUtils;
  static i18n = i18nUtility;
  static logger = loggerUtils;
  static response = responseUtils;
  static token = tokenUtils;
  static upload = uploadUtility;
  static appError = appErrorUtility;
}

module.exports = baseMiddleware;
