const Helper = require("../Utils/helper");
const APIResources = require("../Resources/api.resources");
const Token = require("../Utils/token");
const Logs = require("../Utils/logs");

class permissionMiddleware extends Helper {
  constructor() {
    super();
  }

  checkPermission = ({moduleName, actionName}) => {
    if (!moduleName || !actionName) {
        throw new Error("checkPermission: moduleName and actionName are required");
    }
    return async (req, res, next) => {
        try {
            
            // check module and user role permission

            next();
        } catch (error) {
            Logs.createLog(error);
            return APIResources.error({res,msg:'error'});
        }
    }
  };
  
}

module.exports = new permissionMiddleware();
