const BaseService = require("../../common/base/base-service");
const userModel = require("./user.model");
const userResponse = require("./user.resource");

class UserService extends BaseService {
  constructor() {
    super({ inject: ["appError", "password"] });
  }

  /**
   * Get list
   */
  async getList() {
    const users = await userModel.get();
    return userResponse.collection(users, userResponse.toJSON);
  }

  /**
   * Get by id
   */
  async getById({ id }) {
    const findRecord = await userModel.findOne({ id });
    if (!findRecord) {
      throw new this.appError({ message: "DATA_NOT_FOUND", type: "NOT_FOUND" });
    }
    return userResponse.toJSON(findRecord);
  }

  /**
   * Create
   */
  async create({ data }) {

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: this.password.hash(data.password),
      status: data.status,
      notes: data.notes,
    };

    const insertedRows = await userModel.insert(payload);
    const createdUser = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;

    return userResponse.toJSON(createdUser);
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

    return userResponse.toJSON({ ...findRecord, id, ...payload });
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
      filters: name ? {name: { contains: name }} : {},
    });
    return userResponse.paginate(users.data, users.pagination);
  }
}

module.exports = new UserService();
