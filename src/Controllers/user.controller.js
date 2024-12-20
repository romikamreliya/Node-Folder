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

      const eventEmitter = req.app.get('eventEmitter');
      eventEmitter.emit('test',"demo user");

      const userdata = await UserModel.pagination(1,3);

      return APIResources.apisuccess(res, 'success', UserResources.pagination(userdata));
    } catch (error) {
      Logs.CreateLog(error, 'GetAllUser');
      return APIResources.apierror(res,'error');
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
        return APIResources.apierror(res,validate.errors[0].message);
      }

      return APIResources.apisuccess(res,"success",data);
    } catch (error) {
      Logs.CreateLog(error, 'AddUser');
      return APIResources.apierror(res,'error');
    }
  };
}
module.exports = new UserController();
