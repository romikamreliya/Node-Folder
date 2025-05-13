const express = require("express");

const LoginMiddleware = require("../Middleware/login.middleware");
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
    this.routes.use("/user", LoginMiddleware.userLogin);
    this.routes.get("/user/get", UserController.getAllUser);
    this.routes.post("/user/get", UserController.addUser);
  };

  allRoutes = () => {
    this.userApi();
    return this.routes;
  };
}

module.exports = new ApiRoutes();
