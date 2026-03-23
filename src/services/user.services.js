const BaseController = require("../common/baseController");
const userModel = require("../models/user.model");

class userService extends BaseController {

  /**
   * Get list
   */
  static async getList() {
    const demos = await userModel.get();
    return userModel.resources.collection(demos, userModel.resources.toJSON);
  }

  /**
   * Get by id
   */
  static async getById({ id }) {
    const findRecord = await userModel.findOne({id});
    if (!findRecord) {
      throw new this.appError({message: "DATA_NOT_FOUND", type :"NOT_FOUND" });
    }
    return userModel.resources.toJSON(findRecord);
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

    return userModel.resources.toJSON(demo);
  }

  /**
   * Update
   */
  static async update({ id, data }) {
    const findRecord =  await userModel.findOne({id});
    if (!findRecord) {
      throw new this.appError({message: "DATA_NOT_FOUND", type :"NOT_FOUND" });
    }

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      note: data.note
    };

    await userModel.update(id, payload);

    return userModel.resources.toJSON({ id, ...payload });
  }

  /**
   * Delete
   */
  static async delete({ id }) {
    const findRecord = await userModel.findOne({id});
    if (!findRecord) {
      throw new this.appError({message: "DATA_NOT_FOUND", type: "NOT_FOUND"});
    }

    await userModel.delete({id});
    
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
    return userModel.resources.paginate(demos.data, demos.pagination, userModel.resources.toJSON);
  }
}

module.exports = userService;