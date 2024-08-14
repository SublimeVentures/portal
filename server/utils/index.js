const Sentry = require("@sentry/nextjs");
const { Op, Sequelize } = require("sequelize");
const { serializeError } = require("serialize-error");
const logger = require("../services/logger");

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

module.exports = { getWhereClause, constructError, getPaginationParams };
