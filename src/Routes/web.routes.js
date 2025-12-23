const express = require("express");
const WebController = require("../Controllers/web.controller");

/**
 * Web routes handler
 */
class WebRoutes {
  constructor() {
    this.routes = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.webRoutes();
  }

  webRoutes() {
    this.routes.get("/", WebController.homeView);
  }

  allRoutes() {
    return this.routes;
  }
}

module.exports = new WebRoutes();
