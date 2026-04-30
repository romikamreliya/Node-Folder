const BaseController = require("../../common/base/base-controller");
const userSchemas = require("./user.schema.js");
const userService = require("./user.service");
const UserRequestDto = require("./user.dto.js");

class UserController extends BaseController {
  constructor() {
    super({ inject: ["responseUtil", "ajvUtil"] });
  }

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

    // payload transformation
    const payloadDto = UserRequestDto.createFromRequest(req);

    // payload schema validation
    const validation = userSchemas.validate(payloadDto, "userCreate");
    if (!validation.isValid) {
      return this.response.send({
        req,
        res,
        type: "BAD_REQUEST",
        message: this.ajvUtil.errorMsg({ error: validation.errors[0] }),
      });
    }

    // main logic
    const newUser = await userService.create({ data: payloadDto });
    
    // response send
    return this.responseUtil.send({
      req,
      res,
      type: "CREATED",
      data: newUser,
      message: "SUCCESS",
    });
  }

  async updateUser(req, res) {

    // payload transformation
    const payloadDto = UserRequestDto.updateFromRequest(req);

    // payload schema validation
    const validation = userSchemas.validate(payloadDto, "userUpdate");
    if (!validation.isValid) {
      return this.response.send({
        req,
        res,
        type: "BAD_REQUEST",
        message: this.ajvUtil.errorMsg({ error: validation.errors[0] }),
      });
    }

    // main logic
    const updatedUser = await userService.update({
      id: payloadDto.id,
      data: payloadDto,
    });

    // response send
    return this.responseUtil.send({
      req,
      res,
      type: "UPDATE",
      data: updatedUser,
      message: "SUCCESS",
    });
  }

  async deleteUser(req, res) {

    // payload transformation
    const payloadDto = UserRequestDto.deleteFromRequest(req);

    // Use centralized schema validation via class method
    const validation = userSchemas.validate({ id: payloadDto.id }, "userId");
    if (!validation.isValid) {
      return this.response.send({
        req,
        res,
        type: "BAD_REQUEST",
        message: this.ajvUtil.errorMsg({ error: validation.errors[0] }),
      });
    }

    // main logic
    await userService.delete({ id: payloadDto.id });

    // response send
    return this.responseUtil.send({
      req,
      res,
      type: "DELETE",
      message: "SUCCESS",
    });
  }

  async filterUsers(req, res) {

    // payload transformation
    const payloadDto = UserRequestDto.filterFromRequest(req);

    // main logic
    const users = await userService.filter({ name: payloadDto.name });
    
    return this.responseUtil.send({
      req,
      res,
      type: "SUCCESS",
      data: users,
      message: "SUCCESS",
    });
  }
}

module.exports = new UserController();
