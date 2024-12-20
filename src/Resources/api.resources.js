const Helper = require("../Utils/helper");

class APIResources{

    apierror = (res, msg = "error") => {
        return res.send({
            res: false,
            msg: Helper.ResMessage(msg),
            data: []
        })
    }
    apisuccess = (res, msg = "success", data = []) => {
        return res.send({
            res: true,
            msg: Helper.ResMessage(msg),
            data
        });
    }

}

module.exports = new APIResources();