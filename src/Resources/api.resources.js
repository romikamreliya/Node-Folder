const Helper = require("../Utils/helper.utils");

class APIResources extends Helper{

    constructor() {
        super();
    }

    error = ({res, msg = "error", key = ""}) => {
        return res.send({
            res: false,
            key: key,
            msg: this.resMessage(msg),
            data: []
        })
    }
    success = ({res, msg = "success", data = [], key = ""}) => {
        return res.send({
            res: true,
            key: key,
            msg: this.resMessage(msg),
            data
        });
    }

}

module.exports = new APIResources();