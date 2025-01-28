const UserModel = require("../Models/user.model");

const APIResources = require("../Resources/api.resources");
const UserResources = require("../Resources/user.resources");

const Validation = require("../Utils/validation");
const ImageMulter = require("../Utils/image.multer");
const Logs = require("../Utils/logs");

class UserController {
  constructor() {
  }

  getAllUser = async(req, res) => {
    try {

      // Event Call
      // const eventEmitter = req.app.get('eventEmitter');
      // eventEmitter.emit('test',"demo user");

      // get data with pagination
      const userdata = await UserModel.pagination(1,3);

      return APIResources.apiSuccess(res, 'success', userdata);
    } catch (error) {
      if (error.name != "Error") {
        Logs.createLog(error, 'GetAllUser'); 
      }
      return APIResources.apiError(res,'error');
    }
  };

  addUser = async (req, res) => {
    try {

      // upload images
      await new Promise((resolve, reject) => {
        ImageMulter.upload.single("reviewprofile")(req, res, (err) => {
          if (err) return reject(err);
          return resolve();
        });
      });

      const data = {
        name: req.body.name,
        email: req.body.email,
      };

      // json validation
      const validate = Validation.ajvchack({
        name: Validation.prop("string"),
        email: Validation.prop("string", { format: "email" }),
      });
      if (!validate(data)) {
        throw new Error(validate.errors[0].message);
      }

      return APIResources.apiSuccess(res,"success",data);
    } catch (error) {
      if (error.name != "Error") {
        Logs.createLog(error, 'addUser');
      }
      return APIResources.apiError(res,'error');
    }
  };
}
module.exports = new UserController();
