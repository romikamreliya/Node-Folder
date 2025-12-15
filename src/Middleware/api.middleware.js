const HelperUtils = require("../Utils/helper.utils");
const ResponseUtils = require("../Utils/response.utils");
const LoggerUtils = require("../Utils/logger.utils");
const TokenUtils = require("../Utils/token.utils");

class ApiMiddleware {

  static helper = HelperUtils;
  static response = ResponseUtils;
  static logger = LoggerUtils;
  static token = TokenUtils;

  static userLogin(req, res, next) {
    try {
      
      const token = req.headers['authorization']?.replace('Bearer ','')
      if (!token) {
        return this.response.error({req, res, key:"UNAUTHORIZED"});
      }

      // check Token 
      const tokenCheck = this.token.verifyCustomToken(token)
      if (!tokenCheck.ok) {
        return this.response.error({req, res, key:tokenCheck.error});
      }

      req.tokenData = tokenCheck.data;
      
      next();
    } catch (error) {
      this.logger.createLog({msg:error,name:"ApiMiddleware-userLogin"});
      return this.response.error({res, msg:'ERROR'});
    }
  };
  
}

module.exports = ApiMiddleware;
