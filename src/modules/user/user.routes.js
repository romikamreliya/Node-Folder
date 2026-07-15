const BaseRoute = require("../../common/base/base-route");
const authMiddleware = require("../../app/middleware/auth.middleware");
const userController = require("./user.controller");

class UserRoutes extends BaseRoute {
  registerRoutes() {
    this.webRoutes();
    this.mobileRoutes();
  }
  
  webRoutes() {

    // router
    const router = this.version("v1");

    // All routes below this middleware will require authentication
    router.use(
      this.bindHandler(authMiddleware.authenticateToken, authMiddleware),
    );

    router.get(
      "/get",
      authMiddleware.authorize({ user: ["read"] }),
      this.bindHandler(userController.getUsers, userController),
    );
    router.post(
      "/add",
      authMiddleware.authorize({ user: ["add"] }),
      this.bindHandler(userController.createUser, userController),
    );
    router.put(
      "/update",
      authMiddleware.authorize({ user: ["update"] }),
      this.bindHandler(userController.updateUser, userController),
    );
    router.delete(
      "/delete",
      authMiddleware.authorize({ user: ["delete"] }),
      this.bindHandler(userController.deleteUser, userController),
    );
  }

  mobileRoutes() {
    // router
    const router = this.version("v1");

    // All routes below this middleware will require authentication
    router.use(
      this.bindHandler(authMiddleware.authenticateToken, authMiddleware),
    );
    
    router.post(
      "/filter",
      authMiddleware.authorize({ user: ["read"] }),
      this.bindHandler(userController.filterUsers, userController),
    );
  }

}

module.exports = new UserRoutes();
