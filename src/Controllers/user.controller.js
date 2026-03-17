const userServices = require("../services/user.services");

const HelperUtils = require("../Utils/helper.utils");
const ResponseUtils = require("../Utils/response.utils");
const LoggerUtils = require("../Utils/logger.utils");
const AjvUtils = require("../Utils/ajv.utils");
const TokenUtils = require("../Utils/token.utils");
const UploadUtils = require("../Utils/upload.utils");

class UserController {
  constructor() {
    this.helper = HelperUtils;
    this.response = ResponseUtils;
    this.logger = LoggerUtils;
    this.ajv = AjvUtils;
    this.token = TokenUtils;
    this.upload = new UploadUtils();
  }

  // CRUD operations
  async getAllUser(req, res) {
    try {
      const userData = await userServices.getList();
      return this.response.send({req, res, type:"SUCCESS", data: userData, key:"SUCCESS"});
    } catch (error) {
      this.logger.createLog({ msg: error, name: "getAllUser" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", key:"ERROR"});
    }
  }

  async addUser(req, res) {
    try {
      // upload images
      await new Promise((resolve, reject) => {
        this.upload.getUploadMiddleware().single("reviewProfile")(req, res, (err) => {
          if (err) {
            return this.response.error({ req, res, key: err.message });
          }
          return resolve();
        });
      });

      const data = {
        name: req.body?.name,
        email: req.body?.email
      };

      // json validation
      const validate = this.ajv.ajvCheck({
        name: this.ajv.prop("string"),
        email: this.ajv.prop("string", { format: "customEmail" })
      });
      if (!validate(data)) {
        return this.response.error({ req, res, key: this.ajv.errorMsg({ error: validate.errors[0] }) });
      }

      // main logic
      const newUser = await userServices.create({ data });

      return this.response.send({req, res, type:"CREATED", data: newUser, key:"SUCCESS"});
    } catch (error) {
      this.logger.createLog({ msg: error, name: "addUser" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", key:"ERROR"});
    }
  }

  async updateUser(req, res) {
    try {

      const payload = {
        id: req.body?.id || "",
        ...(req.body?.name && {name: req.body.name}),
        ...(req.body?.email && {email: req.body.email})
      };

      // json validation
      const validate = this.ajv.ajvCheck({
        id: this.ajv.prop("number", { title: "User ID" }),
        name: this.ajv.prop("string", { title: "Name" }),
        email: this.ajv.prop("string", { title: "Email", format: "customEmail" })
      },
      {
        required: ["id"]
      });
      if (!validate(payload)) {
        return this.response.send({req, res, type:"BAD_REQUEST", key: this.ajv.errorMsg({ error: validate.errors[0] }) });
      }

      // main logic
      const updatedUser = await userServices.update({ id: payload.id, data: payload });

      return this.response.send({req, res, type:"UPDATE", data: updatedUser, key:"SUCCESS"});
    } catch (error) {
      this.logger.createLog({ msg: error, name: "updateUser" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", key:"ERROR"});
    }
  }

  async deleteUser(req, res) {
    try {

      const payload = {
        id: req.body?.id || ""
      }

      // json validation
      const validate = this.ajv.ajvCheck({
        id: this.ajv.prop("number", { title: "User ID" })
      },
      {
        required: ["id"]
      });
      if (!validate(payload)) {
        return this.response.send({req, res, type:"BAD_REQUEST", key: this.ajv.errorMsg({ error: validate.errors[0] }) });
      }

      // main logic
      const deletedUser = await userServices.delete({ id: payload.id });

      return this.response.send({req, res, type:"DELETE", data: deletedUser, key:"SUCCESS"});
    } catch (error) {
      this.logger.createLog({ msg: error, name: "deleteUser" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", key:"ERROR"});
    }
  }

  async filter(req, res) {
    try {
      const name = req.body?.name || "";

      // main logic
      const demos = await userServices.filter({ name });

      return this.response.send({req, res, type:"SUCCESS", data: demos, key:"SUCCESS"});
    } catch (error) {
      this.logger.createLog({ msg: error, name: "filter" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", key:"ERROR"});
    }
  }
}
module.exports = new UserController();
