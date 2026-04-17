const BaseMiddleware = require("../../common/base/base-middleware");
const { rateLimit } = require("express-rate-limit");
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
  });

  // ─── Per-user limiter (keyed by authenticated user ID) ─────
  static userLimiter = rateLimit({
    windowMs: Constants.rateLimit.userWindowMs,
    limit: Constants.rateLimit.userMaxRequests,
    keyGenerator: (req) => req.currentUser?.id || req.ip,
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
  });

  // ─── Factory for per-endpoint limiters ─────────────────────
  static createEndpointLimiter({ windowMs, maxRequests, keyGenerator } = {}) {
    return rateLimit({
      windowMs: windowMs || Constants.rateLimit.windowMs,
      limit: maxRequests || Constants.rateLimit.maxRequests,
      keyGenerator: keyGenerator || ((req) => req.ip),
      message: async (req, res) => {
        return RateLimitMiddleware.response.send({
          req,
          res,
          type: "TOO_MANY_REQUESTS",
          message: "TOO_MANY_REQUESTS",
        });
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  // ─── Pre-built auth limiter (login, signup, etc.) ──────────
  static authLimiter = RateLimitMiddleware.createEndpointLimiter({
    windowMs: Constants.rateLimit.auth.windowMs,
    maxRequests: Constants.rateLimit.auth.maxRequests,
  });
}

module.exports = RateLimitMiddleware;
