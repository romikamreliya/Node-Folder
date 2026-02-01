const I18nUtils = require("./i18n.utils");

/**
 * Response utility class for API responses
 */
class ResponseUtils {

    static i18n = I18nUtils;

    static ERROR_CODES = {
        // ✅ Success responses
        SUCCESS: { code: 'SUCCESS', status: 200 },
        CREATED: { code: 'CREATED', status: 201 },
        UPDATE: { code: 'UPDATE', status: 204 },
        DELETE: { code: 'DELETE', status: 204 },
        ACCEPTED: { code: 'ACCEPTED', status: 202 },
        NO_CONTENT: { code: 'NO_CONTENT', status: 204 },

        // 🔁 Client request issues
        BAD_REQUEST: { code: 'BAD_REQUEST', status: 400 },
        UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401 },
        PAYMENT_REQUIRED: { code: 'PAYMENT_REQUIRED', status: 402 },
        FORBIDDEN: { code: 'FORBIDDEN', status: 403 },
        NOT_FOUND: { code: 'NOT_FOUND', status: 404 },
        METHOD_NOT_ALLOWED: { code: 'METHOD_NOT_ALLOWED', status: 405 },
        NOT_ACCEPTABLE: { code: 'NOT_ACCEPTABLE', status: 406 },
        REQUEST_TIMEOUT: { code: 'REQUEST_TIMEOUT', status: 408 },
        CONFLICT: { code: 'CONFLICT', status: 409 },
        GONE: { code: 'GONE', status: 410 },
        PAYLOAD_TOO_LARGE: { code: 'PAYLOAD_TOO_LARGE', status: 413 },
        UNSUPPORTED_MEDIA_TYPE: { code: 'UNSUPPORTED_MEDIA_TYPE', status: 415 },
        UNPROCESSABLE_ENTITY: { code: 'UNPROCESSABLE_ENTITY', status: 422 },
        TOO_MANY_REQUESTS: { code: 'TOO_MANY_REQUESTS', status: 429 },

        // 🔒 Auth / token related
        TOKEN_EXPIRED: { code: 'TOKEN_EXPIRED', status: 401 },
        TOKEN_INVALID: { code: 'TOKEN_INVALID', status: 401 },
        ACCESS_DENIED: { code: 'ACCESS_DENIED', status: 403 },

        // 💥 Server errors
        INTERNAL_SERVER_ERROR: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
        NOT_IMPLEMENTED: { code: 'NOT_IMPLEMENTED', status: 501 },
        BAD_GATEWAY: { code: 'BAD_GATEWAY', status: 502 },
        SERVICE_UNAVAILABLE: { code: 'SERVICE_UNAVAILABLE', status: 503 },
        GATEWAY_TIMEOUT: { code: 'GATEWAY_TIMEOUT', status: 504 }
    };

    /**
     * Send success response
     * @param {Object} options - Response options
     * @param {Object} options.req - Express request object
     * @param {Object} options.res - Express response object
     * @param {string} options.key - Translation key for message
     * @param {string} [options.code=null] - Response code
     * @param {Object} [options.data={}] - Response data
     * @param {number} [options.status=200] - HTTP status code
     * @returns {Object} JSON response
     */
    static success({ req, res, key, code = null, data = {}, status = 200 }) {
        return res.status(status).json({
            success: true,
            code,
            message: this.i18n.t({ key, len: req.lang }),
            data
        });
    }

    /**
     * Send error response
     * @param {Object} options - Response options
     * @param {Object} options.req - Express request object
     * @param {Object} options.res - Express response object
     * @param {string} options.key - Translation key for message
     * @param {string} [options.code=null] - Error code
     * @param {number} [options.status=400] - HTTP status code
     * @returns {Object} JSON error response
     */
    static error({ req, res, key, code = null, status = 400 }) {
        return res.status(status).json({
            success: false,
            code,
            message: this.i18n.t({ key, len: req.lang })
        });
    }
}

module.exports = ResponseUtils;
