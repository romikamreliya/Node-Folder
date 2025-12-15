const express = require("express");

const ApiMiddleware = require("../Middleware/api.middleware");
const permissionMiddleware = require("../Middleware/permission.middleware");
const UserController = require("../Controllers/user.controller");
const HelperUtils = require("../Utils/helper.utils");

class ApiRoutes {
  constructor() {
    this.routes = express.Router();
    this.userController = new UserController();
    this.apiMiddleware = ApiMiddleware;
    this.permissionMiddleware = permissionMiddleware;
    this.helper = HelperUtils;
    this.registerRoutes();
  }

  registerRoutes() {
    this.userRoutes();
  }

  userRoutes() {
    const userRouter = express.Router();

    // --- Public routes ---
    userRouter.get("/test", this.userController.test.bind(this.userController));
    userRouter.post("/ajv", this.userController.ajvFun.bind(this.userController));
    userRouter.post("/filter", this.userController.filter.bind(this.userController));
    userRouter.post("/token", this.userController.tokenGen.bind(this.userController));
    userRouter.post("/tokenCheck", this.userController.tokenCheck.bind(this.userController));
    userRouter.post("/apiVersion", this.userController.apiVersion.bind(this.userController));

    // // --- Protected routes ---
    userRouter.use(this.apiMiddleware.userLogin.bind(this.apiMiddleware));
    userRouter.get("/get", this.permissionMiddleware.checkPermission({moduleName: "user",actionName: "read"}), this.userController.getAllUser.bind(this.userController));
    userRouter.post("/add", this.permissionMiddleware.checkPermission({moduleName: "user",actionName: "add"}), this.userController.addUser.bind(this.userController));

    this.routes.use("/user", userRouter);
  }

  getRoutes() {
    return this.routes;
  }
}

module.exports = ApiRoutes;
