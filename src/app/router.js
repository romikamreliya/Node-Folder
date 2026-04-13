const express = require("express");
const demoRoutes = require("../modules/demo/demo.routes");
const userRoutes = require("../modules/user/user.routes");

class AppRouter {
  getRoutesV1() {
    const router = express.Router();
    router.use("/public", demoRoutes.getRoutes());
    router.use("/user", userRoutes.getRoutes());
    return router;
  }
}

module.exports = new AppRouter();
