const constants = require("../../common/utils/constants");
const helperUtil = require("../../common/utils/helper.util");

class BaseResource {
  constructor() {
    this.constants = constants;
    this.helperUtil = helperUtil;
  }
  /**
   * Apply format() to an array of items.
   * @param {Array}    data
   * @param {Function} [formatter]
   * @returns {Array}
   */
  collection(data = [], formatter) {
    if (!Array.isArray(data)) return [];
    if (typeof formatter === "function") {
      return data.map((item) => formatter(item));
    }
    return data;
  }

  /**
   * Wrap a paginated response with metadata.
   * @param {Object} options
   * @param {boolean} [options.enabled=true] - Whether pagination is enabled
   * @param {Array} [options.items=[]] - Array of items
   * @param {Object} [options.pageInfo={}] - Pagination info { totalRows, currentPage, limit, totalPages }
   * @param {Function} [options.transform] - Function to transform each item
   * @returns {Object}
   */
  paginate({enabled = true, items = [], pageInfo = {}, transform}) {
    if (!enabled) {
      return this.collection(items, transform);
    }
    return {
      data: this.collection(items, transform),
      pagination: {
        total: pageInfo.totalRows ?? 0,
        page: pageInfo.currentPage ?? 1,
        limit: pageInfo.limit ?? this.constants.defaultPageLimit,
        totalPages: pageInfo.totalPages ?? 0,
      },
    };
  }
}

module.exports = BaseResource;
