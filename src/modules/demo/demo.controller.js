const BaseController = require("../../common/base/base-controller");
const userSchema = require("../user/user.schema");

class DemoController extends BaseController {
  constructor() {
    super({inject: ["responseUtil","ajvUtil","storageUtil","tokenUtil"]});
  }

  async test(req, res, next) {
    try {
      const eventEmitter = req.app.get("appEvent");
      eventEmitter.emit(eventEmitter.EVENTS.SOCKET_EMIT, { message: "This is a test event" });

      const apiVersion = this.helper.getVersion({ url: req.baseUrl });
      return this.responseUtil.send({
        req,
        res,
        type: "SUCCESS",
        message: "SUCCESS",
        data: apiVersion,
      });
    } catch (error) {
      next(error);
    }
  }

  async ajvFun(req, res, next) {
    try {
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
        throw new this.appError({type: "BAD_REQUEST", message: this.ajvUtil.errorMsg({ error: validation.errors[0] })});
      }

      return this.responseUtil.send({
        req,
        res,
        type: "SUCCESS",
        message: "SUCCESS",
        data: "valid",
      });
    } catch (error) {
      next(error);
    }
  }

  async filter(req, res, next) {
    try {
      const data = {
        name: req.body?.name,
        id: req.body?.id,
        range: req.body?.range,
      };

      // Use centralized schema validation via class method
      const validation = userSchema.validate(data, "filterSchema");
      if (!validation.isValid) {
        throw new this.appError({type: "BAD_REQUEST", message: this.ajvUtil.errorMsg({ error: validation.errors[0] })});
      }

      return this.responseUtil.send({
        req,
        res,
        type: "SUCCESS",
        message: "SUCCESS",
        data: "filterUser",
      });
    } catch (error) {
      next(error);
    }
  }

  async tokenGen(req, res, next) {
    try {
      const userData = { email: "user@gmail.com", pass: "pass" };
      const customAccessToken = this.tokenUtil.createCustomToken(userData);
      const jwtAccessToken = this.tokenUtil.createJwtAccessToken(userData);
      const customRefreshToken = this.tokenUtil.createRefreshToken();

      return this.responseUtil.send({
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
    } catch (error) {
      next(error);
    }
  }

  async tokenCheck(req, res, next) {
    try {
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
        throw new this.appError({type: "BAD_REQUEST", message: this.ajvUtil.errorMsg({ error: validation.errors[0] })});
      }

      // check JWT Access Token
      const jwtAccessTokenCheck = this.token.verifyJwtAccessToken(
        data.jwtAccessToken,
      );
      if (!jwtAccessTokenCheck.ok) {
        throw new this.appError({type: "UNAUTHORIZED"});
      }

      // check Custom Access Token
      const customAccessTokenCheck = this.token.verifyCustomToken(
        data.customAccessToken,
      );
      if (!customAccessTokenCheck.ok) {
        throw new this.appError({type: "UNAUTHORIZED"});
      }

      // check Custom Refresh Token
      const customRefreshTokenCheck = this.token.verifyRefreshToken(
        data.customRefreshToken,
      );
      if (!customRefreshTokenCheck.ok) {
        throw new this.appError({type: "UNAUTHORIZED"});
      }

      return this.responseUtil.send({
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
    } catch (error) {
      next(error);
    }
  }

  async uploadFile(req, res, next) {
    try {

      const payload = {
        name: req.body.name,
        age: Number(req.body.age),
        isActive: this.helper.parseBoolean(req.body.isActive),
        array:
          req.body?.array && typeof req.body.array === "string"
            ? req.body.array.split(",")
            : req.body.array,
        object:
          req.body?.object && typeof req.body.object === "string"
            ? JSON.parse(req.body.object)
            : req.body.object,
        profile: req?.file?.filename
          ? `${this.uploadPath}/${req.file.filename}`
          : "",
      };

      const validation = userSchema.validate(payload, "uploadSchema");
      if (!validation.isValid) {
        throw new this.appError({type: "BAD_REQUEST", message: this.ajvUtil.errorMsg({ error: validation.errors[0] })});
      }

      return this.responseUtil.send({
        req,
        res,
        type: "SUCCESS",
        message: "FILE_UPLOADED",
        data: payload,
      });
    } catch (error) {
      next(error);
    }
  }

  async apiVersion(req, res, next) {
    try {
      return this.responseUtil.send({
        req,
        res,
        type: "SUCCESS",
        message: "SUCCESS",
        data: { version:req.baseUrl },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DemoController();
