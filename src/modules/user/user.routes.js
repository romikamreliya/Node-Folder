const BaseRoute = require("../../common/base/base-route");
const authMiddleware = require("../../app/middleware/auth.middleware");
const userController = require("./user.controller");

class UserRoutes extends BaseRoute {
  registerRoutes() {
    this.router.use(authMiddleware.authenticateToken.bind(authMiddleware));
    this.router.get(
      "/get",
      authMiddleware.authorize({ user: ["read"] }),
      this.bindHandler(userController, "getUsers"),
    );
    this.router.post(
      "/add",
      authMiddleware.authorize({ user: ["add"] }),
      this.bindHandler(userController, "createUser"),
    );
    this.router.put(
      "/update",
      authMiddleware.authorize({ user: ["update"] }),
      this.bindHandler(userController, "updateUser"),
    );
    this.router.delete(
      "/delete",
      authMiddleware.authorize({ user: ["delete"] }),
      this.bindHandler(userController, "deleteUser"),
    );
    this.router.post(
      "/filter",
      authMiddleware.authorize({ user: ["read"] }),
      this.bindHandler(userController, "filterUsers"),
    );
  }
}

module.exports = new UserRoutes();
