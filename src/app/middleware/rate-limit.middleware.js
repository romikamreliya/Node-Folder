const BaseMiddleware = require("../../common/base/base-middleware");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

class RateLimitMiddleware extends BaseMiddleware {
  // ─── IP-based global limiter (skips whitelisted paths) ─────
  static globalLimiter = rateLimit({
    windowMs: this.constants.rateLimit.windowMs,
    limit: this.constants.rateLimit.maxRequests,
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
    skip: (req) => this.constants.rateLimit.skipPaths.includes(req.path),
    // skipSuccessfulRequests: true // Optionally skip counting successful requests
  });

  // ─── Per-user limiter (keyed by authenticated user ID) ─────
  static userLimiter = rateLimit({
    windowMs: this.constants.rateLimit.userWindowMs,
    limit: this.constants.rateLimit.userMaxRequests,
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
