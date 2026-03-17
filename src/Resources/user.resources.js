const commonResources = require('./common.resources');

class userResources extends commonResources {
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