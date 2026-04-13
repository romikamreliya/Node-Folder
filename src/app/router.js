const express = require("express");
const demoRoutes = require("../modules/demo/demo.routes");
const userRoutes = require("../modules/user/user.routes");

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
}

module.exports = new AppRouter();
