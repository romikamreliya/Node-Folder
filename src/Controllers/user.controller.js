const UserModel = require("../Models/user.model");

const HelperUtils = require("../Utils/helper.utils");
const ResponseUtils = require("../Utils/response.utils");
const LoggerUtils = require("../Utils/logger.utils");
const AjvUtils = require("../Utils/ajv.utils");
const TokenUtils = require("../Utils/token.utils");
const ImageMulter = require("../Services/multer/image.multer");

class UserController {
  constructor() {
    this.helper = HelperUtils;
    this.response = ResponseUtils;
    this.logger = LoggerUtils;
    this.ajv = AjvUtils;
    this.token = TokenUtils;
    this.upload = new ImageMulter();
  }

  async test(req, res) {
    try {
      console.log('this.helper.getVersion(req.baseUrl)', this.helper.getVersion({url:req.baseUrl}));
      return this.response.success({req,res,key:"SUCCESS",data:"aass"});
    } catch (error) {
      this.logger.createLog({msg:error, name:"test"});
      return this.response.error({req,res,key:"ERROR"});
    }
  }

  async ajvFun(req, res) {
    try {

      const data = {
        type: req.body?.type,
        name: req.body?.name,
        email: req.body?.email,
        email_two: req.body?.email_two,
        phone: req.body?.phone,
        website: req.body?.website,
        demoTemp: req.body?.demoTemp,
        array: req.body?.array,
        object: req.body?.object,
      };

      // json validation
      const validate = this.ajv.ajvChack({
        type: this.ajv.prop("string",{title:"User Type",minLength:2}),
        name: this.ajv.prop("string",{title:"Name",minLength:2}),
        email: this.ajv.prop("string", {title:"user email", format: "customEmail" }),
        email_two: this.ajv.prop("string", {title:"Email Two", format: "customEmail" }),
        phone: this.ajv.prop("string", {title:"Phone", format: "customPhone" }),
        website: this.ajv.prop("string", {title:"Website", format: "customWebsite" }),
        demoTemp: this.ajv.prop("string",{title:"Name"}),
        array: this.ajv.prop("array", {title:"User List", items: this.ajv.prop("object",{
          title:"User List Array",
          properties: {
            name: this.ajv.prop("string",{title:"User List Name",minLength:2}),
            email: this.ajv.prop(["string","null"],{title:"User List Email", format: "customEmail" }),
          }, 
          minProperties:2,
          required:["name","email"]
        }), minItems:2, uniqueItems: true}),
        object: this.ajv.prop("object", {
          title:"User Object", 
          properties: {
            name: this.ajv.prop("string"),
            email: this.ajv.prop(["string","null"],{ format: "customEmail" }),
            newTemp: this.ajv.prop(["string","null"]),
          }, 
          minProperties:2,
          required:["name"]
        }),
      },
      {
        required:["type","name","email","array","object","email_two"],
        allOf:[
          {
            if: {
              properties: { type: { const: "admin" } }
            },
            then: {
              required: ["demoTemp"],
              properties: {
                demoTemp: this.ajv.prop("string",{minLength:2})
              } 
            }
          }
        ]
      });
      if (!validate(data)) {
        return this.response.error({ req,res,key:this.ajv.errorMsg({error:validate.errors[0]}) });
      }

      return this.response.success({req,res,key:"SUCCESS",data:"valid"});
    } catch (error) {
      this.logger.createLog({msg:error, name:"ajv"});
      return this.response.error({req,res,key:"ERROR"});
    }
  };

  async filter(req, res) {
    try {

      const data = {
        name: req.body?.name,
        id: req.body?.id,
        range: req.body?.range,
      };

      // json validation
      const validate = this.ajv.ajvChack({
        name: this.ajv.prop("string",{}),
        id: this.ajv.prop("number"),
        range: this.ajv.prop("array", { items: this.ajv.prop("number"), minItems:2, maxItems:2 }),
      },
      {
        required:[]
      });
      if (!validate(data)) {
        return this.response.error({ req,res,key:this.ajv.errorMsg({error:validate.errors[0]}) });
      }

      const filterUser = await UserModel.paginate({filters:{
        // name:{like:data.name}, // like
        id:{not:data.id} // gt, gte, lt, lte, not
        // id:{notIn:data.range} // between, in, notIn
      }});
      return this.response.success({req,res,key:"SUCCESS",data:filterUser});
    } catch (error) {
      this.logger.createLog({msg:error, name:"filter"});
      return this.response.error({req,res,key:"ERROR"});
    }
  }

  async tokenGen(req,res) {
    try {

      let userData = {email:"user@gmail.com",pass:"pass"};
      let customAccessToken = this.token.createCustomToken(userData);
      let JwtAccessToken = this.token.createJwtAccessToken(userData);
      let customRefreshToken = this.token.createRefreshToken();

      return this.response.success({req,res, key:"SUCCESS", data:{
        customAccessToken: customAccessToken,
        JwtAccessToken: JwtAccessToken,
        customRefreshToken: customRefreshToken
      }})
    } catch (error) {
      this.logger.createLog({msg:error, name:"tokenGen"});
      return this.response.error({req,res,key:"ERROR"})
    }
  }

  async tokenCheck(req,res) {
    try {

      const data = {
        customAccessToken: req.body.customAccessToken,
        JwtAccessToken: req.body.JwtAccessToken,
        customRefreshToken: req.body.customRefreshToken,
      };
      // json validation
      const validate = this.ajv.ajvChack({
        customAccessToken: this.ajv.prop("string",{title:"Custom Access Token",minLength:10}),
        JwtAccessToken: this.ajv.prop("string",{title:"JWT Access Token",minLength:10}),
        customRefreshToken: this.ajv.prop("string",{title:"Custom Refresh Token",minLength:10}),
      });
      if (!validate(data)) {
        return this.response.error({ req,res,key:this.ajv.errorMsg({error:validate.errors[0]}) });
      }

      // check JWT Access Token
      const JwtAccessToken = this.token.verifyJwtAccessToken(data.JwtAccessToken);
      if (!JwtAccessToken.ok) {
        return this.response.error({req,res, key:"UNAUTHORIZED"})
      }

      // check Custom Access Token
      const customAccessToken = this.token.verifyCustomToken(data.customAccessToken);
      if (!customAccessToken.ok) {
        return this.response.error({req,res, key:"UNAUTHORIZED"})
      }

      // check Custom Refresh Token
      const customRefreshToken = this.token.verifyRefreshToken(data.customRefreshToken);
      if (!customRefreshToken.ok) {
        return this.response.error({req,res, key:"UNAUTHORIZED"})
      }

      return this.response.success({req,res, key:"SUCCESS", data:{customAccessToken,JwtAccessToken,customRefreshToken}})
    } catch (error) {
      this.logger.createLog({msg:error, name:"tokenCheck"});
      return this.response.error({req,res,key:"ERROR"});
    }
  }

  async apiVersion(req,res) {
    try {
      const apiVersion = this.helper.getVersion({url:req.baseUrl});

      if (apiVersion == "v1") {
        // code for v1
      } else if (apiVersion == "v2") {
        // code for v1
      } else {
        return this.response.error({req,res, key:"INVALID_API_VERSION"})
      }

      return this.response.success({req,res, key:"SUCCESS", data:{apiVersion}})
    } catch (error) {
      this.logger.createLog({msg:error, name:"apiVersion"});
      return this.response.error({req,res,key:"ERROR"});
    }
  }

  async getAllUser(req, res) {
    try {

      // Event Call
      // const eventEmitter = req.app.get('eventEmitter');
      // eventEmitter.emit('test',"demo user");

      // get data with pagination
      const userdata = await UserModel.paginate({page:1,limit:10});

      return this.response.success({req,res, key:"SUCCESS", data:userdata})
    } catch (error) {
      this.logger.createLog({msg:error, name:"getAllUser"});
      return this.response.error({req,res,key:"ERROR"});
    }
  };

  async addUser(req, res) {
    try {

      // upload images
      await new Promise((resolve, reject) => {
        this.upload.getUploadMiddleware().single("reviewProfile")(req, res, (err) => {
          if (err) return this.response.error({req,res,key:err.message});
          return resolve();
        });
      });

      const data = {
        name: req.body?.name,
        email: req.body?.email,
      };

      // json validation
      const validate = this.ajv.ajvChack({
        name: this.ajv.prop("string"),
        email: this.ajv.prop("string", { format: "customEmail" }),
      });
      if (!validate(data)) {
        return this.response.error({ req,res,key:this.ajv.errorMsg({error:validate.errors[0]}) });
      }

      return this.response.success({req,res,key:"SUCCESS",data:data});
    } catch (error) {
      this.logger.createLog({msg:error, name:"addUser"});
      return this.response.error({req,res,key:"ERROR"});
    }
  };
}
module.exports = new UserController();
