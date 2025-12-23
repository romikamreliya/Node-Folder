const HelperUtils = require("../Utils/helper.utils");
const ResponseUtils = require("../Utils/response.utils");
const LoggerUtils = require("../Utils/logger.utils");
const TokenUtils = require("../Utils/token.utils");

class ApiMiddleware {

  static helper = HelperUtils;
  static response = ResponseUtils;
  static logger = LoggerUtils;
  static token = TokenUtils;

  /**
   * Middleware to check user login and verify token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static userLogin(req, res, next) {
    try {
      const token = req.headers['authorization']?.replace('Bearer ', '');

      if (!token) {
        return this.response.error({ req, res, key: "UNAUTHORIZED" });
      }

      // check Token
      const tokenCheck = this.token.verifyCustomToken(token);
      if (!tokenCheck.ok) {
        return this.response.error({ req, res, key: tokenCheck.error });
      }

      req.tokenData = tokenCheck.data;
      next();
    } catch (error) {
      this.logger.createLog({ msg: error, name: "ApiMiddleware-userLogin" });
      return this.response.error({ req, res, key: 'ERROR' });
    }
  }

  /**
   * Middleware to check user permissions
   * @param {Object} options - Options object
   * @param {string} options.moduleName - Module name for permission check
   * @param {string} options.actionName - Action name for permission check
   * @returns {Function} Express middleware function
   */
  static checkPermission({ moduleName, actionName }) {
    // Validate required parameters
    if (!moduleName || !actionName) {
      throw new Error("checkPermission: Both moduleName and actionName are required");
    }

    return async (req, res, next) => {
      try {
        // Check if user is authenticated via token
        if (!req.tokenData) {
          return this.response.error({ req, res, key: "UNAUTHORIZED" });
        }

        next();
      } catch (error) {
        this.logger.createLog({ msg: error.message, name: "PermissionMiddleware-checkPermission" });
        return this.response.error({ req, res, key: "INTERNAL_ERROR" });
      }
    };
  }
}

module.exports = ApiMiddleware;
