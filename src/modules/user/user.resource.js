const BaseResource = require("../../common/base/base-resource");

class UserResource extends BaseResource {
  toJSON(data) {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      notes: data.notes,
    };
  }
}

module.exports = new UserResource();
