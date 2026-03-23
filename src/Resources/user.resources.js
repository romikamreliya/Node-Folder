const baseResources = require('../common/baseResources');

class userResources extends baseResources {
    constructor() {
        super();
    }

    toJSON(data) {
        return {
            id:      data.id,
            name:    data.name,
            email:   data.email,
            phone:   data.phone
        };
    }
}

module.exports = new userResources();