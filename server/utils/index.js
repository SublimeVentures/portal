const { Op, Sequelize } = require("sequelize");

function getWhereClause(filters, mainKeys, strictKeys = [], jsonKeys = []) {
    return Object.keys(filters).reduce((acc, key) => {
        if (mainKeys.includes(key)) {
            if (filters[key] !== "") {
                acc[key] = Sequelize.where(
                    Sequelize.cast(Sequelize.col(key), 'varchar'),
                    { [Op.iLike]: `${filters[key]}%` }
                );
            }
        }

        else if (strictKeys.length && strictKeys.includes(key)) {
            if (filters[key] !== "") acc[key] = filters[key]
        }

        else if (jsonKeys.includes(key)) {
            if (filters[key] !== "") {
                acc[key] = Sequelize.literal(`CAST("${key}" AS VARCHAR) ILIKE '%${filters[key]}%'`);
            }
        }

        return acc;
    }, {});
}

module.exports = { getWhereClause }
