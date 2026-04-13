const BaseRoute = require("../../common/base/base-route");
const webController = require("./web.controller");

/**
 * Web routes handler
 */
class WebRoutes extends BaseRoute {
  registerRoutes() {
    this.setupRoutes();
  }

  setupRoutes() {
    const router = this.version("v1");
    router.get("/", this.bindHandler(webController.homeView, webController));
  }
}

module.exports = new WebRoutes();
