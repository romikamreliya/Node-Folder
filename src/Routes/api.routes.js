const express = require("express");
const apiMiddleware = require("../middleware/api.middleware");

const testController = require("../controllers/test.controller");
const userController = require("../controllers/user.controller");

/**
 * API routes handler
 */
class apiRoutes {
  constructor() {
    this.routes = express.Router();
    this.testController = testController;
    this.userController = userController;
    this.apiMiddleware = apiMiddleware;
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
    Router.post("/upload", this.testController.uploadFile.bind(this.testController));
    
    this.routes.use("/public", Router);
  }

  userRoutes() {
    const userRouter = express.Router();
    userRouter.use(this.apiMiddleware.authenticateToken.bind(this.apiMiddleware)); // Token validation

    userRouter.get("/get", this.apiMiddleware.authorize({"user":["read"]}), this.userController.getAllUser.bind(this.userController));
    userRouter.post("/add", this.apiMiddleware.authorize({"user":["add"]}), this.userController.addUser.bind(this.userController));
    userRouter.put("/update", this.apiMiddleware.authorize({"user":["update"]}), this.userController.updateUser.bind(this.userController));
    userRouter.delete("/delete", this.apiMiddleware.authorize({"user":["delete"]}), this.userController.deleteUser.bind(this.userController));
    userRouter.post("/filter", this.apiMiddleware.authorize({"user":["read"]}), this.userController.filter.bind(this.userController));

    this.routes.use("/user", userRouter);
  }

  getRoutes() {
    return this.routes;
  }
}

module.exports = new apiRoutes();
