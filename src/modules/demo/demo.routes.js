const BaseRoute = require("../../common/base/base-route");
const demoController = require("./demo.controller");

class DemoRoutes extends BaseRoute {
  registerRoutes() {
    const uploadMiddleware = demoController.upload.getUploadMiddleware();

    this.router.get("/test", this.bindHandler(demoController, "test"));
    this.router.post("/ajv", this.bindHandler(demoController, "ajvFun"));
    this.router.post("/filter", this.bindHandler(demoController, "filter"));
    this.router.post("/token", this.bindHandler(demoController, "tokenGen"));
    this.router.post(
      "/tokenCheck",
      this.bindHandler(demoController, "tokenCheck"),
    );
    this.router.post(
      "/apiVersion",
      this.bindHandler(demoController, "apiVersion"),
    );
    this.router.post(
      "/upload",
      uploadMiddleware.single("file"),
      this.bindHandler(demoController, "uploadFile"),
    );
  }
}

module.exports = new DemoRoutes();
