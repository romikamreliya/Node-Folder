const express = require("express");

class BaseRoute {
  constructor() {
    this.routes = {};
    this.registerRoutes();
  }

  registerRoutes() {}

  version(ver = "v1") {
    if (!this.routes[ver]) {
      this.routes[ver] = express.Router();
    }
    return this.routes[ver];
  }

  getRoutes(version = "v1") {
    return this.routes[version] || express.Router();
  }

  bindHandler(handler, context = null) {
    if (typeof handler !== "function") {
      throw new Error("Route handler must be a function.");
    }
    return context ? handler.bind(context) : handler;
  }
}

module.exports = BaseRoute;
