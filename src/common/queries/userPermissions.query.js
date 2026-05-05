const prisma = require("../../infra/database/connection");

class UserPermissionsQuery {
  constructor() {
    this.db = prisma;
  }

  format(data) {
    return data.map((item) => ({
      userId: item.user_id,
      permissionId: item.permission_id,
      permissionName: item.permission_name,
    }));
  }

  async get(userId) {
    const data = await this.db.$queryRaw`SELECT * from user_permissions_view WHERE user_id = ${userId}`;
    return this.format(data);
  }
}

module.exports = new UserPermissionsQuery();
