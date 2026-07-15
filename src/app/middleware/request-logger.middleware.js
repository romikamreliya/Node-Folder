class RequestLoggerMiddleware {

  // Fields whose values must never appear in logs (passwords, tokens, keys…)
  static #SENSITIVE_KEYS = new Set([
    "password", "confirm_password", "old_password", "new_password",
    "token", "access_token", "refresh_token", "id_token",
    "authorization", "secret", "api_key", "apiKey",
    "pin", "user_pin", "otp", "cvv", "card_number",
  ]);

  static #maskBody(body) {
    if (!body || typeof body !== "object") return body;
    const masked = { ...body };
    for (const key of Object.keys(masked)) {
      if (RequestLoggerMiddleware.#SENSITIVE_KEYS.has(key.toLowerCase())) {
        masked[key] = "***";
      }
    }
    return masked;
  }

  /**
   * Logs every incoming request with method, URL, IP, status, and response time.
   * Attach early in the middleware chain (before routes).
   */
  static handle(req, res, next) {
    const start = Date.now();
    const { method, originalUrl, ip } = req;
    const rid = req.requestId || "-";

    console.log(
      `[${rid}] --> ${method} ${originalUrl} (ip : ${req.headers["x-forwarded-for"] || ip}) (userAgent : ${req.headers["user-agent"]})`,
    );
    console.log(
      `[${rid}] Request Body: ${method !== "GET" ? JSON.stringify(RequestLoggerMiddleware.#maskBody(req.body)) : "N/A"}`,
    );

    // Intercept res.end to capture status & duration
    const originalEnd = res.end.bind(res);
    res.end = function (...args) {
      const duration = Date.now() - start;
      console.log(
        `[${rid}] <-- ${method} ${originalUrl} (statusCode : ${res.statusCode}) (${duration}ms)`,
      );
      return originalEnd(...args);
    };

    next();
  }

  /**
   * Skip logging for specific paths (e.g. health check, static assets).
   * @param {string[]} paths - Array of URL prefixes to skip
   */
  static skip(paths = []) {
    return (req, res, next) => {
      if (paths.some((p) => req.originalUrl.startsWith(p))) {
        return next();
      }
      return RequestLoggerMiddleware.handle(req, res, next);
    };
  }
}

module.exports = RequestLoggerMiddleware;
