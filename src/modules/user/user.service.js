const BaseService = require("../../common/base/base-service");
const userModel = require("./user.model");

class UserService extends BaseService {
  /**
   * Get list
   */
  async getList() {
    const users = await userModel.get();
    return userModel.resources.collection(users, userModel.resources.toJSON);
  }

  /**
   * Get by id
   */
  async getById({ id }) {
    const findRecord = await userModel.findOne({ id });
    if (!findRecord) {
      throw new this.appError({ message: "DATA_NOT_FOUND", type: "NOT_FOUND" });
    }
    return userModel.resources.toJSON(findRecord);
  }

  /**
   * Create
   */
  async create({ data }) {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      status: data.status ?? "active",
      notes: data.notes ?? null,
    };

    const insertedRows = await userModel.insert(payload);
    const createdUser = Array.isArray(insertedRows)
      ? insertedRows[0]
      : insertedRows;

    return userModel.resources.toJSON(createdUser);
  }

  /**
   * Update
   */
  async update({ id, data }) {
    const findRecord = await userModel.findOne({ id });
    if (!findRecord) {
      throw new this.appError({ message: "DATA_NOT_FOUND", type: "NOT_FOUND" });
    }

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
    };

    await userModel.update(id, payload);

    return userModel.resources.toJSON({ ...findRecord, id, ...payload });
  }

  /**
   * Delete
   */
  async delete({ id }) {
    const findRecord = await userModel.findOne({ id });
    if (!findRecord) {
      throw new this.appError({ message: "DATA_NOT_FOUND", type: "NOT_FOUND" });
    }

    await userModel.delete({ id });

    return { success: true };
  }

  /**
   * filter
   */
  async filter({ name = "" }) {
    const users = await userModel.paginate({
      filters: {
        name: { like: name },
      },
    });
    return userModel.resources.paginate(
      users.data,
      users.pagination,
      userModel.resources.toJSON,
    );
  }
}

module.exports = new UserService();
