const BaseController = require("../../common/base/base-controller");
const userSchemas = require("./user.schema.js");
const userService = require("./user.service");

class UserController extends BaseController {
  async getUsers(req, res) {
    const users = await userService.getList();
    return this.response.send({
      req,
      res,
      type: "SUCCESS",
      data: users,
      message: "SUCCESS",
    });
  }

  async createUser(req, res) {
    try {
      const data = {
        name: req.body?.name,
        email: req.body?.email,
        phone: req.body?.phone,
        password: req.body?.password,
        status: req.body?.status,
        notes: req.body?.notes,
      };

      // schema validation
      const validation = userSchemas.validate(data, "userCreate");
      if (!validation.isValid) {
        return this.response.send({
          req,
          res,
          type: "BAD_REQUEST",
          message: this.ajv.errorMsg({ error: validation.errors[0] }),
        });
      }

      // main logic
      const newUser = await userService.create({ data });
      
      return this.response.send({
        req,
        res,
        type: "CREATED",
        data: newUser,
        message: "SUCCESS",
      });
    } catch (error) {
      return this.response.send({
        req,
        res,
        type: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while creating the user.",
      });
    }
  }

  async updateUser(req, res) {
    const payload = {
      id: req.body?.id || "",
      ...(req.body?.name && { name: req.body.name }),
      ...(req.body?.email && { email: req.body.email }),
      ...(req.body?.phone && { phone: req.body.phone }),
      ...(req.body?.notes && { notes: req.body.notes }),
    };

    // Use centralized schema validation via class method
    const validation = userSchemas.validate(payload, "userUpdate");
    if (!validation.isValid) {
      return this.response.send({
        req,
        res,
        type: "BAD_REQUEST",
        message: this.ajv.errorMsg({ error: validation.errors[0] }),
      });
    }

    // main logic
    const updatedUser = await userService.update({
      id: payload.id,
      data: payload,
    });
    return this.response.send({
      req,
      res,
      type: "UPDATE",
      data: updatedUser,
      message: "SUCCESS",
    });
  }

  async deleteUser(req, res) {
    const payload = {
      id: req.body?.id,
    };

    // Use centralized schema validation via class method
    const validation = userSchemas.validate(payload, "userId");
    if (!validation.isValid) {
      return this.response.send({
        req,
        res,
        type: "BAD_REQUEST",
        message: this.ajv.errorMsg({ error: validation.errors[0] }),
      });
    }

    // main logic
    const deletedUser = await userService.delete({ id: payload.id });
    return this.response.send({
      req,
      res,
      type: "DELETE",
      data: deletedUser,
      message: "SUCCESS",
    });
  }

  async filterUsers(req, res) {
    const name = req.body?.name || "";

    // main logic
    const users = await userService.filter({ name });
    return this.response.send({
      req,
      res,
      type: "SUCCESS",
      data: users,
      message: "SUCCESS",
    });
  }
}

module.exports = new UserController();
