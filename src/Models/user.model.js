const db = require("../Database/connection");
const BaseModel = require("./baseModel");
const userResources = require("../Resources/user.resources");

class UserModel extends BaseModel {
  constructor() {
    super({
      table: "user",
      columns: ["id", "name", "email", "phone"],
      hidden: ["created_at", "created_by"],
      primaryKey: "id",
      limit: 20,
    });
    this.resources = userResources;
  }

}
module.exports = new UserModel();
