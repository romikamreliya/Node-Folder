const I18nUtils = require("./i18n.utils");

class ResponseUtils {

    static i18n = I18nUtils;

    static ERROR_CODES = {
        SUCCESS: { code: 'SUCCESS', status: 200 },
        CREATED: { code: 'CREATED', status: 201 },
        BAD_REQUEST: { code: 'BAD_REQUEST', status: 400 },
        UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401 },
        FORBIDDEN: { code: 'FORBIDDEN', status: 403 },
        NOT_FOUND: { code: 'NOT_FOUND', status: 404 },
        CONFLICT: { code: 'CONFLICT', status: 409 },
        INTERNAL_SERVER_ERROR: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
    };
    
    static success({req, res, key, code = null, data = {}, status = 200}) {
        return res.status(status).json({
            success: true,
            code: code,
            message: this.i18n.t({key, len:req.lang}),
            data,
        });
    }
    static error({req, res, key, code = null, status = 400}) {
        return res.status(status).json({ 
            success: false, 
            code: code,
            message: this.i18n.t({key, len:req.lang}) 
        });
    }
}

module.exports = ResponseUtils;
