const HelperUtils = require("../utils/helper.utils");
const ResponseUtils = require("../utils/response.utils");
const LoggerUtils = require("../utils/logger.utils");
const TokenUtils = require("../utils/token.utils");

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
  static authenticateToken(req, res, next) {
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

      req.currentUser = tokenCheck.data;
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
  static authorize(permissions = {}) {
    // Validate required parameters
    if (!permissions || Object.keys(permissions).length === 0) {
      throw new Error("authorize: Permissions object is required");
    }

    return async (req, res, next) => {
      try {
        // Check if user is authenticated via token
        if (!req.currentUser) {
          return this.response.error({ req, res, key: "UNAUTHORIZED" });
        }

        // check Permission logic
        const userPermissions = req.currentUser?.permissions || {};
        const allowed = Object.entries(permissions).some(
          ([module, actions]) => {
            if (!userPermissions[module]) return false;
            return actions.some(action => userPermissions[module].includes(action));
          }
        );
        if (!allowed) {
          return this.response.error({ req, res, key: "FORBIDDEN" });
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
