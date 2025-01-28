const Helper = require("../Utils/helper");
const APIResources = require("../Resources/api.resources");
const Token = require("../Utils/token");
const Logs = require("../Utils/logs");

class LoginMiddleware {
  constructor() {}

  userLogin = (req, res, next) => {
    try {
      
      const token = req.headers['authorization']?.replace('Bearer ','')
      let tokenCheck = Token.tokendecode(token,['user','admin'])
      
      // if (!tokenCheck.res) {
      //   return APIResources.apiError(res,'You have no access');
      // }

      // auth token with role wise token
      // let datas = {id:"01",name:"sdd"};
      // let newtokens = Token.generatetoken(datas,'user')
      // console.log(newtokens);
      
      next();
    } catch (error) {
      Logs.CreateLog(error);
      return APIResources.apierror(res,'error');
    }
  };
}

module.exports = new LoginMiddleware();
