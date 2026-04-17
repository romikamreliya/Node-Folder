const BaseModel = require("../../common/base/base-model");

class UserModel extends BaseModel {
  constructor() {
    super({
      table: "user",
      columns: [
        "id",
        "name",
        "email",
        "phone",
        "password",
        "status",
        "notes",
        "updated_at",
        "created_at",
      ],
      hidden: ["password", "created_at", "updated_at", "created_by"],
      primaryKey: "id",
      limit: 20,
    });
  }
}
module.exports = new UserModel();
