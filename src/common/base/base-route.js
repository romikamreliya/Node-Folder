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

  bindHandler(controller, methodName) {
    const handler = controller?.[methodName];
    if (typeof handler !== "function") {
      throw new Error(
        `Route handler '${methodName}' is not defined on controller.`,
      );
    }
    return handler.bind(controller);
  }
}

module.exports = BaseRoute;
