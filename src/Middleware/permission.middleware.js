const ResponseUtils = require("../Utils/response.utils");
const TokenUtils = require("../Utils/token.utils");
const LoggerUtils = require("../Utils/logger.utils");

class PermissionMiddleware {
  
  static response = ResponseUtils;
  static token = TokenUtils;
  static logger = LoggerUtils;

  /**
   * Check user permissions for specific module and action
   * @param {Object} options - {moduleName, actionName, roles}
   * @param {string} options.moduleName - Name of the module
   * @param {string} options.actionName - Name of the action
   * @param {Array} [options.roles] - Optional array of roles to check against
   * @returns {Function} Express middleware function
   */
  static checkPermission = ({moduleName, actionName, roles = []}) => {
    // Validate required parameters
    if (!moduleName || !actionName) {
      throw new Error("checkPermission: Both moduleName and actionName are required");
    }

    return async (req, res, next) => {
      try {
        // Check if user is authenticated via token
        if (!req.tokenData) {
          return this.response.error({req,res,key: "UNAUTHORIZED"});
        }

        // TODO: Implement role-based permission check
        // Example: Check if user role has permission for module.action
        // const userRole = req.tokenData.role;
        // const hasPermission = await PermissionService.checkPermission(userRole, moduleName, actionName);
        // if (!hasPermission) {
        //   return this.response.error({req, res, key: "FORBIDDEN", status: 403});
        // }

        next();
      } catch (error) {
        this.logger.createLog({msg: error.message,name: "PermissionMiddleware-checkPermission"});
        return this.response.error({req,res,key: "INTERNAL_ERROR"});
      }
    };
  };
  
}

module.exports = PermissionMiddleware;
