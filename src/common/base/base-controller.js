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

const REGISTRY = {
  ajv: ajvUtil,
  constants,
  date: dateUtil,
  helper: helperUtil,
  i18n: i18nUtil,
  logger: loggerUtil,
  response: responseUtil,
  token: tokenUtil,
  appError: AppError,
  storageUtil: storageUtil,
};

class BaseController {
  /**
   * @param {Object} [options={}]
   * @param {Array<keyof typeof REGISTRY>} [options.inject]
   */
  constructor({ inject } = {}) {
    const keys = inject || Object.keys(REGISTRY);
    for (const key of keys) {
      if (REGISTRY[key]) {
        this[key] = REGISTRY[key];
      }
    }
  }
}

module.exports = BaseController;
