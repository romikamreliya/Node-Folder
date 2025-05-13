const UserModel = require("../Models/user.model");

const APIResources = require("../Resources/api.resources");
const UserResources = require("../Resources/user.resources");

const Validation = require("../Utils/validation");
const ImageMulter = require("../Utils/image.multer");
const Logs = require("../Utils/logs");
const token = require("../Utils/token");

class UserController {
  constructor() {
  }

  ajv = async(req, res) => {
    try {

      const data = {
        type: req.body.type,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        website: req.body.website,
        demoTemp: req.body.demoTemp,
        array: req.body.array,
        object: req.body.object,
      };

      // json validation
      const validate = Validation.ajvChack({
        type: Validation.prop("string",{minLength:2}),
        name: Validation.prop("string",{minLength:2}),
        email: Validation.prop("string", { format: "customEmail" }),
        phone: Validation.prop("string", { format: "customPhone" }),
        website: Validation.prop("string", { format: "customWebsite" }),
        demoTemp: Validation.prop("string"),
        array: Validation.prop("array", { items: Validation.prop("object",{
          properties: {
            name: Validation.prop("string"),
            email: Validation.prop(["string","null"]),
          }, 
          minProperties:2
        }), minItems:2 }),
        object: Validation.prop("object", { 
          properties: {
            name: Validation.prop("string"),
            email: Validation.prop(["string","null"]),
            newTemp: Validation.prop(["string","null"]),
          }, 
          minProperties:2 
        }),
      },
      {
        required:["type","name","email","array","object"],
        allOf:[
          {
            if: {
              properties: { type: { const: "admin" } }
            },
            then: {
              required: ["demoTemp"],
              properties: {
                demoTemp: Validation.prop("string",{minLength:2})
              } 
            }
          }
        ]
      });
      if (!validate(data)) {
        return APIResources.apiError(res,validate.errors[0].message);
      }

      return APIResources.apiSuccess(res, 'success', "valid");
    } catch (error) {
      Logs.createLog(error, 'GetAllUser');
      return APIResources.apiError(res,'error');
    }
  };

  filter = async(req, res) => {
    try {

      const data = {
        name: req.body.name,
        id: req.body.id,
        range: req.body.range,
      };

      // json validation
      const validate = Validation.ajvChack({
        name: Validation.prop("string",),
        id: Validation.prop("number"),
        range: Validation.prop("array", { items: Validation.prop("number"), minItems:2, maxItems:2 }),
      },
      {
        required:[]
      });
      if (!validate(data)) {
        return APIResources.apiError(res,validate.errors[0].message);
      }

      const filterUser = await UserModel.pagination({filters:{
        // name:{like:data.name}, // like
        id:{not:data.id} // gt, gte, lt, lte, not
        // id:{notIn:data.range} // between, in, notIn
      }});
      return APIResources.apiSuccess(res, 'success', filterUser);
    } catch (error) {
      Logs.createLog(error, 'GetAllUser');
      return APIResources.apiError(res,'error');
    }
  }

  token = async(req,res) => {
    try {

      let userData = {email:"user@gmail.com",pass:"pass"};
      let userToken = token.generateToken(userData,'user')
      if (!userToken.res) {
        return APIResources.apiError(res,'error');
      }

      return APIResources.apiSuccess(res, 'success', {token:userToken.token});
    } catch (error) {
      Logs.createLog(error, 'token');
      return APIResources.apiError(res,'error');
    }
  }

  tokenCheck = async(req,res) => {
    try {

      const data = {
        token: req.body.token,
      };
      // json validation
      const validate = Validation.ajvChack({
        token: Validation.prop("string",{minLength:10}),
      });
      if (!validate(data)) {
        return APIResources.apiError(res,validate.errors[0].message);
      }

      const tokenValue = token.tokenDecode(data.token,"user");
      if (!tokenValue.res) {
        return APIResources.apiError(res,tokenValue.msg);
      }

      return APIResources.apiSuccess(res, 'success', {token:tokenValue.data});
    } catch (error) {
      Logs.createLog(error, 'token');
      return APIResources.apiError(res,'error');
    }
  }

  getAllUser = async(req, res) => {
    try {

      // Event Call
      // const eventEmitter = req.app.get('eventEmitter');
      // eventEmitter.emit('test',"demo user");

      // get data with pagination
      const userdata = await UserModel.pagination({page:1, limit:3, select: "id"});

      return APIResources.apiSuccess(res, 'success', userdata);
    } catch (error) {
      Logs.createLog(error, 'GetAllUser');
      return APIResources.apiError(res,'error');
    }
  };

  addUser = async (req, res) => {
    try {

      // upload images
      await new Promise((resolve, reject) => {
        ImageMulter.upload.single("reviewProfile")(req, res, (err) => {
          if (err) return reject(err);
          return resolve();
        });
      });

      const data = {
        name: req.body.name,
        email: req.body.email,
      };

      // json validation
      const validate = Validation.ajvChack({
        name: Validation.prop("string"),
        email: Validation.prop("string", { format: "email" }),
      });
      if (!validate(data)) {
        throw new Error(validate.errors[0].message);
      }

      return APIResources.apiSuccess(res,"success",data);
    } catch (error) {
      Logs.createLog(error, 'addUser');
      return APIResources.apiError(res,'error');
    }
  };
}
module.exports = new UserController();
