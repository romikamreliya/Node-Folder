const CommonResources = require('./common.resources');

class UserResources extends CommonResources {
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

module.exports = new UserResources();