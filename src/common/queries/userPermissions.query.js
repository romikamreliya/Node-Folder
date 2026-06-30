const pool = require("../../infra/database/mysql.connection");

class UserPermissionsQuery {
  constructor() {
    this.db = pool;
  }

  format(data) {
    return data.map((item) => ({
      userId: item.user_id,
      permissionId: item.permission_id,
      permissionName: item.permission_name,
    }));
  }

  async get(userId) {
    const [rows] = await this.db.promise().query("SELECT * FROM user_permissions_view WHERE user_id = ?", [userId]);
    return this.format(rows);
  }
}

module.exports = new UserPermissionsQuery();
