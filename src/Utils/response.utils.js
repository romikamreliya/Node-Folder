const I18nUtils = require("./i18n.utils");

class ResponseUtils {

    static i18n = I18nUtils;
    
    static success({req, res, key, code = null, data = {}}) {
        return res.json({
            success: true,
            code: code,
            message: this.i18n.t({key, len:req.lang}),
            data,
        });
    }
    static error({req, res, key, code = null, status = 400}) {
        return res.json({ 
            success: false, 
            code: code,
            message: this.i18n.t({key, len:req.lang}) 
        });
    }
}

module.exports = ResponseUtils;
