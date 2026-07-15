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

  /**
   * Extract common pagination fields from request body.
   * @param {Object} body - req.body
   * @returns {{ page: number, limit: number, search: string, pagination: boolean, sortBy: string, sortOrder: string }}
   */
  static extractPagination(body = {}) {
    return {
      page: Number(body.page) || 1,
      limit: Number(body.limit) || this.constants.defaultPageLimit,
      search: body.search || "",
      pagination: this.helper.parseBoolean(body.pagination) ?? true,
      sortBy: body.sortBy || "",
      sortOrder: body.sortOrder || "",
    };
  }

}

module.exports = BaseDTO;
