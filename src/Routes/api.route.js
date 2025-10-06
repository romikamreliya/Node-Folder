const express = require("express");

const apiMiddleware = require("../Middleware/api.middleware");
const permissionMiddleware = require("../Middleware/permission.middleware");
const UserController = require("../Controllers/user.controller");

class ApiRoutes {
  constructor() {
    this.routes = express.Router();
    this.allRoutes();
  }

  userApi = () => {
    this.routes.post("/user/ajv", UserController.ajv);
    this.routes.post("/user/filter", UserController.filter);
    this.routes.post("/user/token", UserController.token);
    this.routes.post("/user/tokenCheck", UserController.tokenCheck);
    this.routes.use("/user", apiMiddleware.userLogin);
    this.routes.get("/user/get",permissionMiddleware.checkPermission({moduleName:"user",actionName:"read"}), UserController.getAllUser);
    this.routes.post("/user/get",permissionMiddleware.checkPermission({moduleName:"user",actionName:"add"}), UserController.addUser);
  };

  allRoutes = () => {
    this.userApi();
    return this.routes;
  };
}

module.exports = new ApiRoutes();
