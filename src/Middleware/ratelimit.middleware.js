const { rateLimit } = require("express-rate-limit");

class rateLimitMiddleware {

    static defaultLimiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        limit: 10,
        message: async (req, res) => {
            return res.status(429).json({ success: false, message: "Too many requests, please try again later" });
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true
    });

}

module.exports = rateLimitMiddleware;
