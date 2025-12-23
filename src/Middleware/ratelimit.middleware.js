const { rateLimit } = require("express-rate-limit");

class RateLimitMiddleware {

    static defaultLimiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minutes
        limit: 10,
        message: async (req, res) => {
            return res.send("Too many requests, please try again later");
        },
        standardHeaders: 'draft-8',
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true
    })

}

module.exports = RateLimitMiddleware;
