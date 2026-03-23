const BaseController = require("../common/baseController");

class apiMiddleware extends BaseController {

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
        return this.response.send({req, res, type:"UNAUTHORIZED", message:"UNAUTHORIZED" });
      }

      // check Token
      const tokenCheck = this.token.verifyCustomToken(token);
      if (!tokenCheck.ok) {
        return this.response.send({ req, res, type: "TOKEN_INVALID", message: "TOKEN_INVALID" });
      }

      req.currentUser = tokenCheck.data;
      next();
    } catch (error) {
      this.logger.createLog({ msg: error, name: "ApiMiddleware-userLogin" });
      return this.response.send({ req, res, type: "INTERNAL_ERROR", message: "INTERNAL_ERROR" });
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
          return this.response.send({ req, res, type: "UNAUTHORIZED", message: "UNAUTHORIZED" });
        }

        // check Permission logic
        // const userPermissions = req.currentUser?.permissions || {};
        // const allowed = Object.entries(permissions).some(
        //   ([module, actions]) => {
        //     if (!userPermissions[module]) return false;
        //     return actions.some(action => userPermissions[module].includes(action));
        //   }
        // );
        // if (!allowed) {
        //   return this.response.send({ req, res, type: "FORBIDDEN", message: "FORBIDDEN" });
        // }

        next();
      } catch (error) {
        this.logger.createLog({ msg: error.message, name: "PermissionMiddleware-checkPermission" });
        return this.response.send({ req, res, type: "INTERNAL_ERROR", message: "INTERNAL_ERROR" });
      }
    };
  }
}

module.exports = apiMiddleware;
