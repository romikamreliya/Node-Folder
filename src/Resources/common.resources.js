class CommonResources {

    /**
     * Apply format() to an array of items.
     * @param {Array}    data
     * @param {Function} [formatter]
     * @returns {Array}
     */
    collection(data = [], formatter) {
        if (!Array.isArray(data)) return [];
        if (typeof formatter === 'function') {
            return data.map(item => formatter(item));
        }
        return data;
    }

    /**
     * Wrap a paginated response with metadata.
     * @param {Array}  data
     * @param {Object} pagination  - { total, page, limit, totalPages }
     * @param {Function} formatter
     * @returns {Object}
     */
    paginate(data = [], pagination = {}, formatter) {
        return {
            data       : this.collection(data, formatter),
            pagination : {
                total      : pagination.totalRows ?? 0,
                page       : pagination.currentPage ?? 1,
                limit      : pagination.limit ?? 10,
                totalPages : pagination.totalPages ?? 0,
            },
        };
    }
}

module.exports = CommonResources;
