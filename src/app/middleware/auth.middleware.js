const BaseMiddleware = require("../../common/base/base-middleware");
const userPermissionsQuery = require("../../common/queries/userPermissions.query");

class AuthMiddleware extends BaseMiddleware {

  static validateAuthHeader(authHeader) {
    if (!authHeader) {
      throw new this.appError({type: "TOKEN_MISSING"});
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new this.appError({type: "INVALID_TOKEN_FORMAT"});
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new this.appError({type: "TOKEN_MISSING"});
    }

    return token;
  }

  static authenticateToken(req, res, next) {
    try {
      const token = this.validateAuthHeader(req.headers.authorization);
      // check Token
      const tokenCheck = this.token.verifyCustomToken(token);
      if (!tokenCheck.ok) {
        return this.response.send({
          req,
          res,
          type: tokenCheck.error,
          message: tokenCheck.error,
        });
      }

      req.currentUser = tokenCheck.data;
      next();
    } catch (error) {
      next(error);
    }
  }

  static hasRequiredPermission(userPermissions = {}, requiredPermissions = {}) {
    return Object.entries(requiredPermissions).some(([actions, module]) => {

      // Validate required permissions format
      if (!Array.isArray(module) || module.length === 0) {
        return false;
      }

      // Validate user permissions format
      const grantedActions = userPermissions[actions];
      if (!Array.isArray(grantedActions)) {
        return false;
      }

      // Check if any of the required modules are included in the granted actions for the specified permission type
      return module.some((mod) => grantedActions.includes(mod));
    });
  }

  static authorize(permissions = {}) {
    // Validate required parameters
    if (!permissions || Object.keys(permissions).length === 0) {
      throw new Error("authorize: Permissions object is required");
    }

    return async (req, res, next) => {
      try {
        // Check if user is authenticated via token
        if (!req.currentUser) {
          throw new this.appError({type: "UNAUTHORIZED"});
        }

        const userPermissions = req.currentUser?.permissions || {};
        const allowed = this.hasRequiredPermission(
          userPermissions,
          permissions,
        );

        if (!allowed) {
          throw new this.appError({type: "FORBIDDEN"});
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

module.exports = AuthMiddleware;
