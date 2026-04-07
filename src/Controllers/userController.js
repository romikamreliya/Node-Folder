const BaseController = require("../common/baseController");
const userValidationSchemas = require("../validations/user.schemas");
const userServices = require("../services/user.services");

class userController extends BaseController {
  constructor() {
    super();
  }

  async getAllUser(req, res) {
    const userData = await userServices.getList();
    return this.response.send({req, res, type:"SUCCESS", data: userData, message:"SUCCESS"});
  }

  async addUser(req, res) {
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
  }

  async updateUser(req, res) {
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
  }

  async deleteUser(req, res) {
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
  }

  async filter(req, res) {
    const name = req.body?.name || "";

    // main logic
    const demos = await userServices.filter({ name });
    return this.response.send({req, res, type:"SUCCESS", data: demos, message:"SUCCESS"});
  }
}

module.exports = new userController();

