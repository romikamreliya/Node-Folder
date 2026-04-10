const BaseRoute = require("../../common/base/base-route");
const authMiddleware = require("../../app/middleware/auth.middleware");
const userController = require("./user.controller");

class UserRoutes extends BaseRoute {
  registerRoutes() {
    this.router.use(
      this.bindHandler(authMiddleware.authenticateToken, authMiddleware),
    );
    
    this.webRoutes();
    this.mobileRoutes();
  }
  
  webRoutes() {
    this.router.get(
      "/get",
      authMiddleware.authorize({ user: ["read"] }),
      this.bindHandler(userController.getUsers, userController),
    );
    this.router.post(
      "/add",
      authMiddleware.authorize({ user: ["add"] }),
      this.bindHandler(userController.createUser, userController),
    );
    this.router.put(
      "/update",
      authMiddleware.authorize({ user: ["update"] }),
      this.bindHandler(userController.updateUser, userController),
    );
    this.router.delete(
      "/delete",
      authMiddleware.authorize({ user: ["delete"] }),
      this.bindHandler(userController.deleteUser, userController),
    );
  }

  mobileRoutes() {
    this.router.post(
      "/filter",
      authMiddleware.authorize({ user: ["read"] }),
      this.bindHandler(userController.filterUsers, userController),
    );
  }

}

module.exports = new UserRoutes();
