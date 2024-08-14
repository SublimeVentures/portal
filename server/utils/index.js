const Sentry = require("@sentry/nextjs");
const { Op, Sequelize } = require("sequelize");
const { serializeError } = require("serialize-error");
const logger = require("../services/logger");

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
};

function constructError(type, error, config) {
    const { isLog = true, message, methodName, force, enableSentry } = config;

    if (isLog) {
        logger.error(`${type} :: [${methodName}] - FAILED`, {
            error: serializeError(error),
            force,
        });
    }

    if (enableSentry && error?.status && error.status !== 401) {
        Sentry.captureException({ location: methodName, error });
    }

    return { error: error.message || message, ok: false };
};

module.exports = { getWhereClause, constructError }
