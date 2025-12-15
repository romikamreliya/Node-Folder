const { rateLimit } = require("express-rate-limit");

class RateLimitMiddleware {
    constructor() {}

    defaultLimiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minutes
        limit: 10,
        message: async (req, res) => {
            return res.send("error limit");
        },
        standardHeaders: 'draft-8',
        legacyHeaders: false,
    })

}

module.exports = new RateLimitMiddleware();
