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

const REGISTRY = {
  constants,
  helper: helperUtil,
  logger: loggerUtil,
  ajv: ajvUtil,
  token: tokenUtil,
  date: dateUtil,
  i18n: i18nUtil,
  appError: AppError,
  response: responseUtil,
  password: PasswordUtil,
};

class BaseService {
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

module.exports = BaseService;
