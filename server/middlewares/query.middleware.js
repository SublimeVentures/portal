const { serializeError } = require("serialize-error");

/**
 * @param {import("zod").ZodSchema} schema
 * @returns {import("express").RequestHandler}
 */
module.exports = (schema) => async (req, res, next) => {
    try {
        req.parsedQuery = schema.parse(req.query);
        next();
    } catch (err) {
        return res.status(400).json({
            ok: false,
            error: serializeError(err.message),
        });
    }
};
