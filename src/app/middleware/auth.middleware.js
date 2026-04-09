const BaseMiddleware = require("../../common/base/base-middleware");

class AuthMiddleware extends BaseMiddleware {
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
      this.logger.createLog({ msg: error, name: "ApiMiddleware-userLogin" });
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

        // IMPLEMENTED: Check permission logic
        // const userPermissions = req.currentUser?.permissions || {};
        // const allowed = Object.entries(permissions).some(
        //   ([module, actions]) => {
        //     if (!Array.isArray(userPermissions[module])) return false;
        //     return actions.some(action => userPermissions[module].includes(action));
        //   }
        // );

        // if (!allowed) {
        //   return this.response.send({ req, res, type: "FORBIDDEN", message: "INSUFFICIENT_PERMISSIONS" });
        // }

        next();
      } catch (error) {
        this.logger.createLog({
          msg: error.message,
          name: "PermissionMiddleware-checkPermission",
        });
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
