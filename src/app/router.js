const express = require("express");
const webRoutes = require("../modules/web/web.routes");
const demoRoutes = require("../modules/demo/demo.routes");
const userRoutes = require("../modules/user/user.routes");
const rateLimitMiddleware = require("./middleware/rate-limit.middleware");

class AppRouter {
  getRoutesV1() {
    const router = express.Router();
    router.use("/public", demoRoutes.getRoutes("v1"));
    router.use("/user", userRoutes.getRoutes("v1"));
    return router;
  }

  getRoutesV2() {
    const router = express.Router();
    router.use("/public", demoRoutes.getRoutes("v2"));
    return router;
  }

  registerRoutes() {
    const router = express.Router();
    router.use("/", webRoutes.getRoutes());
    router.use("/api/v1", rateLimitMiddleware.globalLimiter, rateLimitMiddleware.userLimiter, this.getRoutesV1());
    router.use("/api/v2", rateLimitMiddleware.globalLimiter, rateLimitMiddleware.userLimiter, this.getRoutesV2());
    return router;
  }
}

module.exports = new AppRouter();
