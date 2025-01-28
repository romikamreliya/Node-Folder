const db = require("../Config/connection");
const Helper = require("../Utils/helper");

class UserModel extends Helper {
  constructor() {
    super();
    this.name = "user";
  }

  tableColumn = (data) => {
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
      return await db(this.name).where(this.tableColumn(query));
    } catch (error) { throw error;}
  };

  findOne = async (query) => {
    try {
      return await db(this.name).where(this.tableColumn(query)).first();
    } catch (error) { throw error;}
  };

  insert = async (data) => {
    try {
      return await db(this.name).insert(this.tableColumn(data));
    } catch (error) { throw error;}
  };

  update = async (id, data) => {
    try {
      return await db(this.name).where("id", id).update(this.tableColumn(data));
    } catch (error) { throw error;}
  };

  delete = async (query) => {
    try {
      return await db(this.name).where(this.tableColumn(query)).del();
    } catch (error) { throw error;}
  };

  count = async (query = {}) => {
    try {
      return await db(this.name).count('id as count').where(this.tableColumn(query)).first();
    } catch (error) { throw error;}
  };

  pagination = async (page = 1, limit = this.pageLimit, query = {}, select = '*') => {
    try {
      const rowsCount = await this.count(query)      
      return {
        data: await db(this.name).where(this.tableColumn(query)).select(select).limit(limit).offset((page - 1) * limit),
        pagination: {
          total_pages:Math.ceil(rowsCount.count / limit),
          currentPage: page,
          limit: limit
        }
      };
    } catch (error) { throw error;}
  }
}
module.exports = new UserModel();
