const BaseMiddleware = require("../../common/base/base-middleware");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const Constants = require("../../common/utils/constants");

class RateLimitMiddleware extends BaseMiddleware {
  // ─── IP-based global limiter (skips whitelisted paths) ─────
  static globalLimiter = rateLimit({
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
    skip: (req) => Constants.rateLimit.skipPaths.includes(req.path),
    // skipSuccessfulRequests: true // Optionally skip counting successful requests
  });

  // ─── Per-user limiter (keyed by authenticated user ID) ─────
  static userLimiter = rateLimit({
    windowMs: Constants.rateLimit.userWindowMs,
    limit: Constants.rateLimit.userMaxRequests,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
    validate: false,
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
    // skipSuccessfulRequests: true // Optionally skip counting successful requests
  });

}

module.exports = RateLimitMiddleware;
