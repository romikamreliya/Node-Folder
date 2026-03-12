const express = require("express");
const ApiMiddleware = require("../Middleware/api.middleware");
const testController = require("../Controllers/test.controller");
const HelperUtils = require("../Utils/helper.utils");

/**
 * API routes handler
 */
class ApiRoutes {
  constructor() {
    this.routes = express.Router();
    this.testController = testController;
    this.apiMiddleware = ApiMiddleware;
    this.helper = HelperUtils;
    this.registerRoutes();
  }

  registerRoutes() {
    this.publicRoutes();
    this.userRoutes();
  }

  publicRoutes() {
    const Router = express.Router();

    Router.get("/test", this.testController.test.bind(this.testController));
    Router.post("/ajv", this.testController.ajvFun.bind(this.testController));
    Router.post("/filter", this.testController.filter.bind(this.testController));
    Router.post("/token", this.testController.tokenGen.bind(this.testController));
    Router.post("/tokenCheck", this.testController.tokenCheck.bind(this.testController));
    Router.post("/apiVersion", this.testController.apiVersion.bind(this.testController));
    
    this.routes.use("/public", Router);
  }

  userRoutes() {
    const userRouter = express.Router();
    userRouter.use(this.apiMiddleware.authenticateToken.bind(this.apiMiddleware)); // Token validation

    userRouter.get("/get", this.apiMiddleware.authorize({"user":["read"]}), this.testController.getAllUser.bind(this.testController));
    userRouter.post("/add", this.apiMiddleware.authorize({"user":["add"]}), this.testController.addUser.bind(this.testController));
    userRouter.put("/update", this.apiMiddleware.authorize({"user":["update"]}), this.testController.updateUser.bind(this.testController));
    userRouter.delete("/delete", this.apiMiddleware.authorize({"user":["delete"]}), this.testController.deleteUser.bind(this.testController));

    this.routes.use("/user", userRouter);
  }

  getRoutes() {
    return this.routes;
  }
}

module.exports = new ApiRoutes();
