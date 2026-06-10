const express = require("express");
const webRoutes = require("../modules/web/web.routes");
const demoRoutes = require("../modules/demo/demo.routes");
const userRoutes = require("../modules/user/user.routes");
const rateLimitMiddleware = require("./middleware/rate-limit.middleware");

class AppRouter {

  constructor() {
    this.version = {
      v1: "v1",
      v2: "v2"
    }
  }

  getRoutesV1(version) {
    const router = express.Router();
    router.use("/public", demoRoutes.getRoutes(version));
    router.use("/user", userRoutes.getRoutes(version));
    return router;
  }

  getRoutesV2(version) {
    const router = express.Router();
    router.use("/public", demoRoutes.getRoutes(version));
    return router;
  }

  registerRoutes() {
    const router = express.Router();
    
    // Health check — no auth, no rate limit
    router.get("/health", (req, res) => {
      res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now(),
      });
    });

    router.use("/", webRoutes.getRoutes());
    router.use("/api/" + this.version.v1, rateLimitMiddleware.globalLimiter.bind(rateLimitMiddleware), rateLimitMiddleware.userLimiter.bind(rateLimitMiddleware), this.getRoutesV1(this.version.v1));
    router.use("/api/" + this.version.v2, rateLimitMiddleware.globalLimiter.bind(rateLimitMiddleware), rateLimitMiddleware.userLimiter.bind(rateLimitMiddleware), this.getRoutesV2(this.version.v2));
    return router;
  }
}

module.exports = new AppRouter();
