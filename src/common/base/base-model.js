const prisma = require("../../infra/database/connection");
const Constants = require("../utils/constants");

class BaseModel {
  constructor({ table, columns = [], hidden = [], primaryKey = "id", limit = Constants.defaultPageLimit }) {
    this.table = table;
    this.columns = columns;
    this.hidden = hidden;
    this.primaryKey = primaryKey;
    this.pageLimit = limit;
    this.db = prisma;
  }

  clean(data) {
    if (!data || typeof data !== 'object') { return {};}

    const validColumns = new Set([...this.columns, this.hidden]);

    return Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        return value !== undefined && validColumns.has(key);
      }).map(([key, value]) => [key, this.sanitize(value)])
    )
  }

  sanitize(value) {
    if (value === null || value === undefined) return value;

    if (typeof value === 'string') {
      return value.trim().replace(/[\u0000-\u001F\u007F]/g, '');
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }

    if (value instanceof Date || Buffer.isBuffer(value)) {
      return value;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map(item => this.sanitize(item));
    }

    // Handle Objects
    if (typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, this.sanitize(v)])
      );
    }

    return value;
  }

  // BASIC CRUD
  async get() {
    return await this.db[this.table].findMany();
  }

  async find(query) {
    return this.db[this.table].findMany({ where: this.clean(query) });
  }

  async findOne(query) {
    return this.db[this.table].findFirst({ where: this.clean(query) });
  }

  async insert(data) {
    return await this.db[this.table].create({ data: this.clean(data) });
  }

  async update(id, data) {
    return await this.db[this.table].update({
      where: { [this.primaryKey]: id },
      data: this.clean(data)
    });
  }

  async updateWhere(query, data) {
    return await this.db[this.table].update({
      where: this.clean(query),
      data: this.clean(data)
    });
  }

  async delete(query) {
    return await this.db[this.table].deleteMany({ where: this.clean(query) });
  }

  async count(query = {}) {
    return this.db[this.table].count({ where: this.clean(query) });
  }

  // PAGINATION + ADVANCED FILTERS
  /**
   * Fetch paginated data with filters, ordering, and selection.
   * @param {Object} options Options object
   * @param {number} [options.page=1] Current page number
   * @param {number} [options.limit=this.pageLimit] Number of records per page
   * @param {Object} [options.filters={}] Filter conditions
   * @param {Boolean} [options.pagination=true] Filter conditions
   * @param {string|string[]} [options.select="*"] Columns to select
   * @param {Object<string, "asc"|"desc">} [options.order={}] Sorting order
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
   *   order: { created_at: "desc" }
   *   pagination: true,
   * });
   */
  async paginate({
    page = 1,
    limit = this.pageLimit,
    filters = {},
    select = undefined,
    order = {},
    pagination = true
  } = {}) {
    // Validate and cap pagination params to prevent DoS
    const MAX_LIMIT = Constants.maxPageLimit;
    page = Math.max(1, Math.floor(Number(page) || 1));
    limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(Number(limit) || this.pageLimit)));

    if (!pagination) {
      return this.db[this.table].findMany({
        where: filters,
        select,
        orderBy: order
      });
    }
    
    const [data, total] = await this.db.$transaction([
      this.db[this.table].findMany({
        where: filters,
        select,
        orderBy: order,
        skip: (page - 1) * limit,
        take: limit
      }),
      this.db[this.table].count({ where: filters })
    ]);

    return {
      data,
      pagination: {
        totalRows: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    };
  }
}

module.exports = BaseModel;
