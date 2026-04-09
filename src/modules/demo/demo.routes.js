const BaseRoute = require("../../common/base/base-route");
const demoController = require("./demo.controller");

class DemoRoutes extends BaseRoute {
  registerRoutes() {
    const uploadMiddleware = demoController.upload.getUploadMiddleware();

    this.router.get(
      "/test",
      this.bindHandler(demoController.test, demoController),
    );
    this.router.post(
      "/ajv",
      this.bindHandler(demoController.ajvFun, demoController),
    );
    this.router.post(
      "/filter",
      this.bindHandler(demoController.filter, demoController),
    );
    this.router.post(
      "/token",
      this.bindHandler(demoController.tokenGen, demoController),
    );
    this.router.post(
      "/tokenCheck",
      this.bindHandler(demoController.tokenCheck, demoController),
    );
    this.router.post(
      "/apiVersion",
      this.bindHandler(demoController.apiVersion, demoController),
    );
    this.router.post(
      "/upload",
      uploadMiddleware.single("file"),
      this.bindHandler(demoController.uploadFile, demoController),
    );
  }
}

module.exports = new DemoRoutes();
