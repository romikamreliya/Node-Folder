const Helper = require("../Utils/helper");

class APIResources extends Helper{

    constructor() {
        super();
    }

    apiError = (res, msg = "error") => {
        return res.send({
            res: false,
            msg: this.resMessage(msg),
            data: []
        })
    }
    apiSuccess = (res, msg = "success", data = []) => {
        return res.send({
            res: true,
            msg: this.resMessage(msg),
            data
        });
    }

}

module.exports = new APIResources();