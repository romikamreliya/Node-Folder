const db = require("../Config/connection");
const Helper = require("../Utils/helper");
const UserResources = require("../Resources/user.resources");

class UserModel extends Helper {
  constructor() {
    super();
    this.name = "user";
    this.column = ["id", "name", "email", "phone"];
    this.columnHide = ["created_at", "created_by"];
  }

  validateData = (data) => {
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
    } catch (error) { throw error; }
  };

  find = async (query) => {
    try {
      return await db(this.name).where(this.validateData(query));
    } catch (error) { throw error; }
  };

  findOne = async (query) => {
    try {
      return await db(this.name).where(this.validateData(query)).first();
    } catch (error) { throw error; }
  };

  insert = async (data) => {
    try {
      return await db(this.name).insert(this.validateData(data));
    } catch (error) { throw error; }
  };

  update = async (id, data) => {
    try {
      return await db(this.name).where("id", id).update(this.validateData(data));
    } catch (error) { throw error; }
  };

  delete = async (query) => {
    try {
      return await db(this.name).where(this.validateData(query)).del();
    } catch (error) { throw error; }
  };

  count = async (query = {}) => {
    try {
      return await db(this.name).count('id as count').where(this.validateData(query)).first();
    } catch (error) { throw error; }
  };

  /**
   * Fetch paginated data with filters, ordering, and selection.
   * @param {Object} options Options object
   * @param {number} [options.page=1] Current page number
   * @param {number} [options.limit=this.pageLimit] Number of records per page
   * @param {Object} [options.filters={}] Filter conditions
   * @param {Boolean} [options.pagination=true] Filter conditions
   * @param {string|string[]} [options.select="*"] Columns to select
   * @param {Array<{column: string, dir?: "asc"|"desc"}>} [options.order=[]] Sorting rules
   * @returns {Promise<Object|Array>} Paginated result object or array
   * @returns {Array<Object>} return.data Array of rows
   * @returns {Object} return.pagination Pagination info
   * @returns {number} return.pagination.totalRows Total number of rows matching the filters
   * @returns {number} return.pagination.totalPages Total number of pages
   * @returns {number} return.pagination.currentPage Current page number
   * @returns {number} return.pagination.limit Number of rows per page
   *
   * @example
   * const result = await User.pagination({
   *   page: 2,
   *   limit: 10,
   *   filters: { name: { like: "Romik" } },
   *   select: ["id","name","email"],
   *   order: [{ column: "created_at", dir: "desc" }]
   *   pagination: true,
   * });
   */
  pagination = async ({ page = 1, limit = this.pageLimit, filters = {}, select = "*", order = [], pagination = true }) => {
    try {

      let dbQuery = db(this.name).select(select);

      // Columns filter
      const columns = this.validateData(filters);

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
          } else if (condition.eq) {
            dbQuery.where(field, '=', condition.eq);
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

      // Apply dynamic ordering
      if (Array.isArray(order) && order.length > 0) {
        order.forEach(({ column, dir }) => {
          if (column) dbQuery.orderBy(column, dir || "asc");
        });
      }

      if (pagination == false) {
        return await dbQuery.clone();
      }

      // Apply pagination
      const rowsData = await dbQuery.clone().limit(limit).offset((page - 1) * limit);
      const rowsCount = await dbQuery.clone().count('id as count').first();

      return {
        data: rowsData,
        pagination: {
          totalRows: rowsCount.count,
          totalPages: Math.ceil(rowsCount.count / limit),
          currentPage: page,
          limit: limit
        }
      };
    } catch (error) { throw error; }
  }
}
module.exports = new UserModel();
