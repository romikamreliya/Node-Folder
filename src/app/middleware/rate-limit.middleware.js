const BaseMiddleware = require("../../common/base/base-middleware");
const { rateLimit } = require("express-rate-limit");
const Constants = require("../../common/utils/constants");

class RateLimitMiddleware extends BaseMiddleware {
  static defaultLimiter = rateLimit({
    windowMs: Constants.rateLimit.windowMs,
    limit: Constants.rateLimit.maxRequests,
    message: async (req, res) => {
      return this.response.send({
        req,
        res,
        type: "TOO_MANY_REQUESTS",
        message: "TOO_MANY_REQUESTS",
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
  });
}

module.exports = RateLimitMiddleware;
