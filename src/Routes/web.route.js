const express = require("express");
const WebController = require("../Controllers/web.controller");

class ApiRoutes {
  constructor() {
    this.routes = express.Router();
    this.allRoutes();
  }

  webRoutes = () => {
    this.routes.get("/", WebController.homeView);
  };

  allRoutes = () => {
    this.webRoutes();
    return this.routes;
  };
}

module.exports = new ApiRoutes();
