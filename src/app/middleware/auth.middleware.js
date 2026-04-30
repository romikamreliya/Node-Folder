const BaseMiddleware = require("../../common/base/base-middleware");

class AuthMiddleware extends BaseMiddleware {
  static hasRequiredPermission(userPermissions = {}, requiredPermissions = {}) {
    return Object.entries(requiredPermissions).some(([module, actions]) => {
      if (!Array.isArray(actions) || actions.length === 0) {
        return false;
      }

      const grantedActions = userPermissions[module];
      if (!Array.isArray(grantedActions)) {
        return false;
      }

      return actions.some((action) => grantedActions.includes(action));
    });
  }

  static authenticateToken(req, res, next) {
    try {
      const token = req.headers["authorization"]?.replace("Bearer ", "");

      if (!token) {
        return this.response.send({
          req,
          res,
          type: "UNAUTHORIZED",
          message: "UNAUTHORIZED",
        });
      }

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
      this.logger.createLog(error,"ApiMiddleware-userLogin");
      return this.response.send({
        req,
        res,
        type: "INTERNAL_SERVER_ERROR",
        message: "INTERNAL_SERVER_ERROR",
      });
    }
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
          return this.response.send({
            req,
            res,
            type: "UNAUTHORIZED",
            message: "UNAUTHORIZED",
          });
        }

        const userPermissions = req.currentUser?.permissions || {};
        const allowed = this.hasRequiredPermission(
          userPermissions,
          permissions,
        );

        if (!allowed) {
          return this.response.send({
            req,
            res,
            type: "FORBIDDEN",
            message: "INSUFFICIENT_PERMISSIONS",
          });
        }

        next();
      } catch (error) {
        this.logger.createLog(error,"PermissionMiddleware-checkPermission");
        return this.response.send({
          req,
          res,
          type: "INTERNAL_SERVER_ERROR",
          message: "INTERNAL_SERVER_ERROR",
        });
      }
    };
  }
}

module.exports = AuthMiddleware;
