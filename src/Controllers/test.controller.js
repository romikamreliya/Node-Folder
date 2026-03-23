const BaseController = require("../common/baseController");
const userValidationSchemas = require("../validations/user.schemas");

class testController extends BaseController {
  constructor() {
    super();
  }

  async test(req, res) {
    try {
      const apiVersion = this.helper.getVersion({ url: req.baseUrl });
      return this.response.send({ req, res, type: "SUCCESS", message: "SUCCESS", data: apiVersion });
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "test" });
      return this.response.send({ req, res, type: "INTERNAL_SERVER_ERROR", message: "ERROR" });
    }
  }

  async ajvFun(req, res) {
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
        object: req.body?.object
      };

      // Use centralized schema validation via class method
      const validation = userValidationSchemas.validate(data, "ajvFunSchema");
      if (!validation.isValid) {
        return this.response.send({ req, res, type: "BAD_REQUEST", message: this.ajv.errorMsg({ error: validation.errors[0] }) });
      }

      return this.response.send({ req, res, type: "SUCCESS", message: "SUCCESS", data: "valid" });
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "ajvFun" });
      return this.response.send({ req, res, type: "INTERNAL_SERVER_ERROR", message: "ERROR" });
    }
  }

  async filter(req, res) {
    try {
      const data = {
        name: req.body?.name,
        id: req.body?.id,
        range: req.body?.range
      };

      // Use centralized schema validation via class method
      const validation = userValidationSchemas.validate(data, "filterSchema");
      if (!validation.isValid) {
        return this.response.send({ req, res, type: "BAD_REQUEST", message: this.ajv.errorMsg({ error: validation.errors[0] }) });
      }

      // TODO: Implement filter logic - require userServices
      // const filterUser = await userServices.filter(data);
      return this.response.send({ req, res, type: "SUCCESS", message: "SUCCESS", data: "filterUser" });
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "filter" });
      return this.response.send({ req, res, type: "INTERNAL_SERVER_ERROR", message: "ERROR" });
    }
  }

  async tokenGen(req, res) {
    try {
      const userData = { email: "user@gmail.com", pass: "pass" };
      const customAccessToken = this.token.createCustomToken(userData);
      const jwtAccessToken = this.token.createJwtAccessToken(userData);
      const customRefreshToken = this.token.createRefreshToken();

      return this.response.send({req, res, type: "SUCCESS", message: "SUCCESS", data: {
          customAccessToken,
          jwtAccessToken,
          customRefreshToken
        }
      });
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "tokenGen" });
      return this.response.send({ req, res, type: "INTERNAL_SERVER_ERROR", message: "ERROR" });
    }
  }

  async tokenCheck(req, res) {
    try {
      const data = {
        customAccessToken: req.body.customAccessToken,
        jwtAccessToken: req.body.jwtAccessToken,
        customRefreshToken: req.body.customRefreshToken
      };

      // json validation
      const validate = this.ajv.ajvCheck({
        customAccessToken: this.ajv.prop("string", { title: "Custom Access Token", minLength: 10 }),
        jwtAccessToken: this.ajv.prop("string", { title: "JWT Access Token", minLength: 10 }),
        customRefreshToken: this.ajv.prop("string", { title: "Custom Refresh Token", minLength: 10 })
      });

      if (!validate(data)) {
        return this.response.send({ req, res, type: "BAD_REQUEST", message: this.ajv.errorMsg({ error: validate.errors[0] }) });
      }

      // check JWT Access Token
      const jwtAccessTokenCheck = this.token.verifyJwtAccessToken(data.jwtAccessToken);
      if (!jwtAccessTokenCheck.ok) {
        return this.response.send({ req, res, type: "UNAUTHORIZED", message: "UNAUTHORIZED" });
      }

      // check Custom Access Token
      const customAccessTokenCheck = this.token.verifyCustomToken(data.customAccessToken);
      if (!customAccessTokenCheck.ok) {
        return this.response.send({ req, res, type: "UNAUTHORIZED", message: "UNAUTHORIZED" });
      }

      // check Custom Refresh Token
      const customRefreshTokenCheck = this.token.verifyRefreshToken(data.customRefreshToken);
      if (!customRefreshTokenCheck.ok) {
        return this.response.send({ req, res, type: "UNAUTHORIZED", message: "UNAUTHORIZED" });
      }

      return this.response.send({ req, res, type: "SUCCESS", message: "SUCCESS", data: {
          customAccessToken: customAccessTokenCheck,
          jwtAccessToken: jwtAccessTokenCheck,
          customRefreshToken: customRefreshTokenCheck
        }
      });
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "tokenCheck" });
      return this.response.send({ req, res, type: "INTERNAL_SERVER_ERROR", message: "ERROR" });
    }
  }

  async apiVersion(req, res) {
    try {
      const apiVersion = this.helper.getVersion({ url: req.baseUrl });

      if (apiVersion === "v1") {
        // code for v1
      } else if (apiVersion === "v2") {
        // code for v2
      } else {
        return this.response.send({ req, res, type: "BAD_REQUEST", message: "INVALID_API_VERSION" });
      }

      return this.response.send({ req, res, type: "SUCCESS", message: "SUCCESS", data: { apiVersion } });
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "apiVersion" });
      return this.response.send({ req, res, type: "INTERNAL_SERVER_ERROR", message: "ERROR" });
    }
  }

  async uploadFile(req, res) {
    try {
      // upload images
      await new Promise((resolve, reject) => {
        this.upload.getUploadMiddleware().single("reviewProfile")(req, res, (err) => {
          if (err) {
            return this.response.send({ req, res, type: "BAD_REQUEST", message: err.message });
          }
          return resolve();
        });
      });

      return this.response.send({ req, res, type: "SUCCESS", message: "SUCCESS" });
    } catch (error) {
      if (error?.name === "AppError") {
        return this.response.send({req, res, type:error?.type || "INTERNAL_SERVER_ERROR", message:error.message}  );
      }
      this.logger.createLog({ msg: error, name: "uploadFile" });
      return this.response.send({ req, res, type: "INTERNAL_SERVER_ERROR", message: "ERROR" });
    }
  }
}

module.exports = new testController();
