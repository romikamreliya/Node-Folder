const { log } = require("winston");
const BaseController = require("../../common/base/base-controller");
const userSchema = require("../user/user.schema");

class DemoController extends BaseController {

  constructor() {
    const uploadPath = "public/upload/demo";
    super({ uploadPath });
    this.uploadPath = uploadPath;
  }

  async test(req, res) {
    const eventEmitter = req.app.get("appEvent");
    eventEmitter.emit("socketEmit", { message: "This is a test event" });

    const apiVersion = this.helper.getVersion({ url: req.baseUrl });
    return this.response.send({
      req,
      res,
      type: "SUCCESS",
      message: "SUCCESS",
      data: apiVersion,
    });
  }

  async ajvFun(req, res) {
    const data = {
      type: req.body?.type,
      name: req.body?.name,
      email: req.body?.email,
      email_two: req.body?.email_two,
      phone: req.body?.phone,
      website: req.body?.website,
      demoTemp: req.body?.demoTemp,
      array: req.body?.array,
      object: req.body?.object,
    };

    // Use centralized schema validation via class method
    const validation = userSchema.validate(data, "ajvFunSchema");
    if (!validation.isValid) {
      return this.response.send({
        req,
        res,
        type: "BAD_REQUEST",
        message: this.ajv.errorMsg({ error: validation.errors[0] }),
      });
    }

    return this.response.send({
      req,
      res,
      type: "SUCCESS",
      message: "SUCCESS",
      data: "valid",
    });
  }

  async filter(req, res) {
    const data = {
      name: req.body?.name,
      id: req.body?.id,
      range: req.body?.range,
    };

    // Use centralized schema validation via class method
    const validation = userSchema.validate(data, "filterSchema");
    if (!validation.isValid) {
      return this.response.send({
        req,
        res,
        type: "BAD_REQUEST",
        message: this.ajv.errorMsg({ error: validation.errors[0] }),
      });
    }

    return this.response.send({
      req,
      res,
      type: "SUCCESS",
      message: "SUCCESS",
      data: "filterUser",
    });
  }

  async tokenGen(req, res) {
    const userData = { email: "user@gmail.com", pass: "pass" };
    const customAccessToken = this.token.createCustomToken(userData);
    const jwtAccessToken = this.token.createJwtAccessToken(userData);
    const customRefreshToken = this.token.createRefreshToken();

    return this.response.send({
      req,
      res,
      type: "SUCCESS",
      message: "SUCCESS",
      data: {
        customAccessToken,
        jwtAccessToken,
        customRefreshToken,
      },
    });
  }

  async tokenCheck(req, res) {
    const data = {
      customAccessToken: req.body.customAccessToken,
      jwtAccessToken: req.body.jwtAccessToken,
      customRefreshToken: req.body.customRefreshToken,
    };

    // json validation
    const validate = this.ajv.ajvCheck({
      customAccessToken: this.ajv.prop("string", {
        title: "Custom Access Token",
        minLength: 10,
      }),
      jwtAccessToken: this.ajv.prop("string", {
        title: "JWT Access Token",
        minLength: 10,
      }),
      customRefreshToken: this.ajv.prop("string", {
        title: "Custom Refresh Token",
        minLength: 10,
      }),
    });

    if (!validate(data)) {
      return this.response.send({
        req,
        res,
        type: "BAD_REQUEST",
        message: this.ajv.errorMsg({ error: validate.errors[0] }),
      });
    }

    // check JWT Access Token
    const jwtAccessTokenCheck = this.token.verifyJwtAccessToken(
      data.jwtAccessToken,
    );
    if (!jwtAccessTokenCheck.ok) {
      return this.response.send({
        req,
        res,
        type: "UNAUTHORIZED",
        message: "UNAUTHORIZED",
      });
    }

    // check Custom Access Token
    const customAccessTokenCheck = this.token.verifyCustomToken(
      data.customAccessToken,
    );
    if (!customAccessTokenCheck.ok) {
      return this.response.send({
        req,
        res,
        type: "UNAUTHORIZED",
        message: "UNAUTHORIZED",
      });
    }

    // check Custom Refresh Token
    const customRefreshTokenCheck = this.token.verifyRefreshToken(
      data.customRefreshToken,
    );
    if (!customRefreshTokenCheck.ok) {
      return this.response.send({
        req,
        res,
        type: "UNAUTHORIZED",
        message: "UNAUTHORIZED",
      });
    }

    return this.response.send({
      req,
      res,
      type: "SUCCESS",
      message: "SUCCESS",
      data: {
        customAccessToken: customAccessTokenCheck,
        jwtAccessToken: jwtAccessTokenCheck,
        customRefreshToken: customRefreshTokenCheck,
      },
    });
  }

  async uploadFile(req, res) {
    try {

      // upload images
      await new Promise((resolve, reject) => {
        this.upload.getUploadMiddleware().single("reviewProfile")(req, res, (err) => {
          if (err) {
            return this.response.error({ req, res, key: err.message });
          }
          return resolve();
        });
      });

      const payload = {
        name: req.body.name,
        age: Number(req.body.age),
        isActive: Boolean(req.body.isActive),
        array: req.body?.array && typeof req.body.array === "string" ? req.body.array.split(",") : req.body.array,
        object: req.body?.object && typeof req.body.object === "string" ? JSON.parse(req.body.object) : req.body.object,
        profile: req?.file?.filename ? `${this.uploadPath}/${req.file.filename}` : "",
      }

      console.log('payload', payload);
      

      const validation = userSchema.validate(payload, "uploadSchema");
      if (!validation.isValid) {
        return this.response.send({
          req,
          res,
          type: "BAD_REQUEST",
          message: this.ajv.errorMsg({ error: validation.errors[0] }),
        });
      }

      return this.response.send({
        req,
        res,
        type: "SUCCESS",
        message: "FILE_UPLOADED",
        data: payload,
      });
    } catch (error) {
      throw new this.appError({
        message: "FILE_UPLOAD_FAILED",
        type: "BAD_REQUEST",
      });
    }
  }

  async apiVersion(req, res) {
    const version = this.helper.getVersion({ url: req.baseUrl });
    return this.response.send({
      req,
      res,
      type: "SUCCESS",
      message: "SUCCESS",
      data: { version },
    });
  }
}

module.exports = new DemoController();
