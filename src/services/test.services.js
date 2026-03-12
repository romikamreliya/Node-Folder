const userModel = require("../Models/user.model");

class testService {
  constructor() {}

  /**
   * Get list
   */
  static async getList() {
    const demos = await userModel.get();
    return demos;
  }

  /**
   * Get by id
   */
  static async getById({ id }) {
    const demo = await userModel.findOne({id});
    if (!demo) {
      throw new Error("DEMO_NOT_FOUND");
    }
    return demo;
  }

  /**
   * Create
   */
  static async create({ data }) {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone
    };

    const demo = await userModel.insert(payload);

    return demo;
  }

  /**
   * Update
   */
  static async update({ id, data }) {
    const demo =  await userModel.findOne({id});
    if (!demo) {
      throw new Error("DEMO_NOT_FOUND");
    }

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone
    };

    await UserModel.update(id, payload);

    return { success: true };
  }

  /**
   * Delete
   */
  static async delete({ id }) {
    const demo = await userModel.findOne({id});
    if (!demo) {
      throw new Error("DEMO_NOT_FOUND");
    }

    await UserModel.delete({id});

    return { success: true };
  }

  /**
   * filter
   */
  static async filter({ name = "" }) {
    const demos = await userModel.paginate({
      filters: {
        name: { like: name }
      }
    });
    return demos;
  }
}

module.exports = testService;