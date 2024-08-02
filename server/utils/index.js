const { Op, Sequelize } = require("sequelize");

function getWhereClause(filters, mainKeys, strictKeys = [], jsonKeys = []) {
    return Object.keys(filters).reduce((acc, key) => {
        if (mainKeys.includes(key)) {
            if (filters[key] !== "") {
                acc[key] = Sequelize.where(Sequelize.cast(Sequelize.col(key), "varchar"), {
                    [Op.iLike]: `${filters[key]}%`,
                });
            }
        } else if (strictKeys.length && strictKeys.includes(key)) {
            if (filters[key] !== "") acc[key] = filters[key];
        } else if (jsonKeys.includes(key)) {
            if (filters[key] !== "") {
                acc[key] = Sequelize.literal(`CAST("${key}" AS VARCHAR) ILIKE '%${filters[key]}%'`);
            }
        }

        return acc;
    }, {});
}

/**
 * Utility function to construct pagination parameters
 * @param {object} req - The request object
 * @returns {object} - An object containing limit, offset, page, currentPage and pageSize
 */
const getPaginationParams = (req) => {
    const { page = "0", pageSize = "10" } = req.query;
    const limit = parseInt(pageSize, 10) || 10;
    const offset = Math.max(0, parseInt(page, 10)) * limit;
    const currentPage = parseInt(page, 10) || 0;

    return {
        limit,
        offset,
        page: parseInt(page, 10),
        currentPage,
        pageSize: limit,
    };
};

module.exports = { getWhereClause, getPaginationParams };
