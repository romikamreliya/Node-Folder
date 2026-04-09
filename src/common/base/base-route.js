const express = require("express");

class BaseRoute {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {}

  getRoutes() {
    return this.router;
  }

  bindHandler(handler, context = null) {
    if (typeof handler !== "function") {
      throw new Error("Route handler must be a function.");
    }
    return context ? handler.bind(context) : handler;
  }
}

module.exports = BaseRoute;
