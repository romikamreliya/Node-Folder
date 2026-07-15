const BaseRoute = require("../../common/base/base-route");
const demoController = require("./demo.controller");

class DemoRoutes extends BaseRoute {
  registerRoutes() {
    this.webRoutes();
    this.webRoutesV2();
  }

  webRoutes() {
    // router
    const router = this.version("v1");

    router.get(
      "/test",
      this.bindHandler(demoController.test, demoController),
    );
    router.post(
      "/ajv",
      this.bindHandler(demoController.ajvFun, demoController),
    );
    router.post(
      "/filter",
      this.bindHandler(demoController.filter, demoController),
    );
    router.post(
      "/token",
      this.bindHandler(demoController.tokenGen, demoController),
    );
    router.post(
      "/tokenCheck",
      this.bindHandler(demoController.tokenCheck, demoController),
    );
    router.post(
      "/apiVersion",
      this.bindHandler(demoController.apiVersion, demoController),
    );
    router.post(
      "/upload",
      demoController.storageUtil.getUploadMiddleware().single("reviewProfile"),
      this.bindHandler(demoController.uploadFile, demoController),
    );
  }

  webRoutesV2() {
    // router
    const router = this.version("v2");
    
    router.get(
      "/test",
      this.bindHandler(demoController.test, demoController),
    );
  }
}

module.exports = new DemoRoutes();
