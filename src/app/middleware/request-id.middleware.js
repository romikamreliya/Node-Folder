const crypto = require("crypto");

/**
 * Request ID middleware.
 *
 * Reads an incoming X-Request-ID header (for distributed tracing) or
 * generates a new UUID v4 if none is provided.
 *
 * Attaches the ID as `req.requestId` and sets it on the response header.
 */
class RequestIdMiddleware {
  static handle(req, res, next) {
    const id = req.headers["x-request-id"] || crypto.randomUUID();
    req.requestId = id;
    res.setHeader("X-Request-ID", id);
    next();
  }
}

module.exports = RequestIdMiddleware;
