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

class baseController {
  constructor({uploadPath} = {}) {
    // Instance properties for use in controllers
    this.ajv = ajvUtils;
    this.constants = constants;
    this.date = dateUtility;
    this.helper = helperUtils;
    this.i18n = i18nUtility;
    this.logger = loggerUtils;
    this.response = responseUtils;
    this.token = tokenUtils;
    this.upload = new uploadUtility(uploadPath);
    this.appError = appErrorUtility;
  }
}

module.exports = baseController;
