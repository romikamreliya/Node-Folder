const Helper = require("../Utils/helper");
const APIResources = require("../Resources/api.resources");
const Token = require("../Utils/token");
const Logs = require("../Utils/logs");

class apiMiddleware extends Helper {
  constructor() {}

  userLogin = (req, res, next) => {
    try {
      
      const token = req.headers['authorization']?.replace('Bearer ','')
      if (!token) {
        return APIResources.apiError(res,"Token required");
      }

      // check Token 
      const tokenCheck = Token.tokenDecode(token,[this.tokenType.api])
      if (!tokenCheck.res) {
        return APIResources.apiError(res,'You have no access');
      }

      req.tokenData = tokenCheck.data;
      
      next();
    } catch (error) {
      Logs.createLog(error);
      return APIResources.apiError(res,'error');
    }
  };
  
}

module.exports = new apiMiddleware();
