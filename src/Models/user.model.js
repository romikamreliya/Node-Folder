const db = require("../Config/connection");
const Helper = require("../Utils/helper");
const UserResources = require("../Resources/user.resources");

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

  pagination = async ({page = 1, limit = this.pageLimit, filters = {}, select = "*"}) => {
    try {

      let dbQuery = db(this.name).select(select);

      // Columns filter
      const columns = this.tableColumn(filters);

      // Advanced filters
      for (const [field, condition] of Object.entries(columns)) {
        if (typeof condition === "object" && condition !== null) {
          if (condition.like) {
            dbQuery.where(field, 'like', `%${condition.like}%`);
          } else if (condition.gt) {
            dbQuery.where(field, '>', condition.gt);
          } else if (condition.gte) {
            dbQuery.where(field, '>=', condition.gte);
          } else if (condition.lt) {
            dbQuery.where(field, '<', condition.lt);
          } else if (condition.lte) {
            dbQuery.where(field, '<=', condition.lte);
          } else if (condition.between && Array.isArray(condition.between)) {
            dbQuery.whereBetween(field, condition.between);
          } else if (condition.in && Array.isArray(condition.in)) {
            dbQuery.whereIn(field, condition.in);
          } else if (condition.notIn && Array.isArray(condition.notIn)) {
            dbQuery.whereNotIn(field, condition.notIn);
          } else if (condition.not) {
            dbQuery.whereNot(field, condition.not);
          } else if (condition.null) {
            dbQuery.whereNull(field);
          } else if (condition.notNull) {
            dbQuery.whereNotNull(field);
          }
        }
      }
      
      // Apply pagination
      const rowsData = await dbQuery.clone().limit(limit).offset((page - 1) * limit);
      const rowsCount = await dbQuery.clone().count('id as count').first();
      
      return {
        data: rowsData,
        pagination: {
          totalRows: rowsCount.count,
          totalPages:Math.ceil(rowsCount.count / limit),
          currentPage: page,
          limit: limit
        }
      };
    } catch (error) { throw error;}
  }
}
module.exports = new UserModel();
