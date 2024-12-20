const db = require("../Config/connection");

class UserModel {
  constructor() {
    this.name = "user";
    this.pagelimit = 2;
  }

  tablecolumn = (data) => {
    return Object.fromEntries(Object.entries({
      "id": data.id,
      "name": data.name,
      "email": data.email,
      "phone": data.phone
    }).filter(([key, value]) => value !== null && value !== "" && value !== undefined));
  }

  get = async () => {
    try {
      return await db(this.name);
    } catch (error) { throw error;}
  };

  find = async (query) => {
    try {
      return await db(this.name).where(this.tablecolumn(query));
    } catch (error) { throw error;}
  };

  findone = async (query) => {
    try {
      return await db(this.name).where(this.tablecolumn(query)).first();
    } catch (error) { throw error;}
  };

  insert = async (data) => {
    try {
      return await db(this.name).insert(this.tablecolumn(data));
    } catch (error) { throw error;}
  };

  update = async (id, data) => {
    try {
      return await db(this.name).where("id", id).update(this.tablecolumn(data));
    } catch (error) { throw error;}
  };

  delete = async (query) => {
    try {
      return await db(this.name).where(this.tablecolumn(query)).del();
    } catch (error) { throw error;}
  };

  count = async (query = {}) => {
    try {
      return await db(this.name).count('id as count').where(this.tablecolumn(query)).first();
    } catch (error) { throw error;}
  };

  pagination = async (page = 1, limit = this.pagelimit, query = {}) => {
    try {
      return {
        data: await db(this.name).where(this.tablecolumn(query)).limit(limit).offset((page - 1) * limit),
        recordcount: await this.count(query),
        currentpage: page,
        limit: limit
      };
    } catch (error) { throw error;}
  }
}
module.exports = new UserModel();
