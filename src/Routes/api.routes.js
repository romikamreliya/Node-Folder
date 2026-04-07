const express = require("express");
const apiMiddleware = require("../middleware/api.middleware");

const demoController = require("../controllers/demoController");
const userController = require("../controllers/userController");

/**
 * API routes handler
 */
class apiRoutes {
  constructor() {
    this.routes = express.Router();
    this.demoController = demoController;
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

    Router.get("/test", this.demoController.test.bind(this.demoController));
    Router.post("/ajv", this.demoController.ajvFun.bind(this.demoController));
    Router.post("/filter", this.demoController.filter.bind(this.demoController));
    Router.post("/token", this.demoController.tokenGen.bind(this.demoController));
    Router.post("/tokenCheck", this.demoController.tokenCheck.bind(this.demoController));
    Router.post("/apiVersion", this.demoController.apiVersion.bind(this.demoController));
    Router.post("/upload", this.demoController.uploadFile.bind(this.demoController));
    
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
