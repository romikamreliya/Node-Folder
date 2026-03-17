const db = require("../database/connection");
const baseModel = require("../common/baseModel");
const userResources = require("../resources/user.resources");

class userModel extends baseModel {
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
module.exports = new userModel();
