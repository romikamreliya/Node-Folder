const db = require("../Database/connection");
const BaseModel = require("./baseModel");

class UserModel extends BaseModel {
  constructor() {
    super({
      table: "user",
      columns: ["id", "name", "email", "phone"],
      hidden: ["created_at", "created_by"],
      primaryKey: "id",
      limit: 20,
    });
  }

}
module.exports = new UserModel();
