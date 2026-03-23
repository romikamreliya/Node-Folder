const BaseController = require("../common/baseController");
const userValidationSchemas = require("../validations/user.schemas");
const userServices = require("../services/user.services");

class userController extends BaseController {
  constructor() {
    super();
  }

  // CRUD operations
  async getAllUser(req, res) {
    try {
      const userData = await userServices.getList();
      return this.response.send({req, res, type:"SUCCESS", data: userData, message:"SUCCESS"});
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "getAllUser" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", message:"ERROR"});
    }
  }

  async addUser(req, res) {
    try {

      const data = {
        name: req.body?.name,
        email: req.body?.email,
        phone: req.body?.phone,
        password: req.body?.password,
        status: req.body?.status,
        notes: req.body?.notes
      };

      // schema validation
      const validation = userValidationSchemas.validate(data, "userCreate");
      if (!validation.isValid) {
        return this.response.send({ req, res, type:"BAD_REQUEST", message: this.ajv.errorMsg({ error: validation.errors[0] }) });
      }

      // main logic
      const newUser = await userServices.create({ data });

      return this.response.send({req, res, type:"CREATED", data: newUser, message:"SUCCESS"});
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "addUser" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", message:"ERROR"});
    }
  }

  async updateUser(req, res) {
    try {

      const payload = {
        id: req.body?.id || "",
        ...(req.body?.name && {name: req.body.name}),
        ...(req.body?.email && {email: req.body.email}),
        ...(req.body?.phone && {phone: req.body.phone}),
        ...(req.body?.notes && {notes: req.body.notes})
      };

      // Use centralized schema validation via class method
      const validation = userValidationSchemas.validate(payload, "userUpdate");
      if (!validation.isValid) {
        return this.response.send({req, res, type:"BAD_REQUEST", message: this.ajv.errorMsg({ error: validation.errors[0] }) });
      }

      // main logic
      const updatedUser = await userServices.update({ id: payload.id, data: payload });

      return this.response.send({req, res, type:"UPDATE", data: updatedUser, message:"SUCCESS"});
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "updateUser" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", message:"ERROR"});
    }
  }

  async deleteUser(req, res) {
    try {

      const payload = {
        id: req.body?.id
      }

      // Use centralized schema validation via class method
      const validation = userValidationSchemas.validate(payload, "userId");
      if (!validation.isValid) {
        return this.response.send({req, res, type:"BAD_REQUEST", message: this.ajv.errorMsg({ error: validation.errors[0] }) });
      }

      // main logic
      const deletedUser = await userServices.delete({ id: payload.id });

      return this.response.send({req, res, type:"DELETE", data: deletedUser, message:"SUCCESS"});
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "deleteUser" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", message:"ERROR"});
    }
  }

  async filter(req, res) {
    try {
      const name = req.body?.name || "";

      // main logic
      const demos = await userServices.filter({ name });

      return this.response.send({req, res, type:"SUCCESS", data: demos, message:"SUCCESS"});
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "filter" });
      return this.response.send({req, res, type:"INTERNAL_SERVER_ERROR", message:"ERROR"});
    }
  }
}

module.exports = new userController();
