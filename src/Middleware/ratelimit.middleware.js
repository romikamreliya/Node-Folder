const { rateLimit } = require("express-rate-limit");
const BaseController = require("../common/baseController");

class rateLimitMiddleware extends BaseController {

    static defaultLimiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        limit: 10,
        message: async (req, res) => {
            return this.response.send({ req, res, type: "TOO_MANY_REQUESTS", message: "Too many requests, please try again later" });
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true
    });

}

module.exports = rateLimitMiddleware;
