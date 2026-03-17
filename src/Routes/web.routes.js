const express = require("express");
const webController = require("../controllers/web.controller");

/**
 * Web routes handler
 */
class webRoutes {
  constructor() {
    this.routes = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.webRoutes();
  }

  webRoutes() {
    this.routes.get("/", webController.homeView);
  }

  allRoutes() {
    return this.routes;
  }
}

module.exports = new webRoutes();
