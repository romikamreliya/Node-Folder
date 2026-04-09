const express = require("express");
const webController = require("./web.controller");

/**
 * Web routes handler
 */
class WebRoutes {
  constructor() {
    this.routes = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.setupRoutes();
  }

  setupRoutes() {
    this.routes.get("/", webController.homeView);
  }

  allRoutes() {
    return this.routes;
  }
}

module.exports = new WebRoutes();
