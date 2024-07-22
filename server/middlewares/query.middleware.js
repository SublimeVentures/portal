const { z } = require("zod");
const { serializeError } = require("serialize-error");

const requestSchema = z.object({
    limit: z
        .number({
            invalid_type_error: "Invalid limit",
        })
        .optional(),
    sortBy: z
        .enum(["createdAt", "performance"], {
            invalid_type_error: "Invalid sortBy",
        })
        .optional(),
    sortOrder: z
        .enum(["ASC", "DESC"], {
            invalid_type_error: "Invalid sortOrder",
        })
        .optional(),
    isUpcoming: z
        .boolean({
            invalid_type_error: "Invalid isUpcoming",
        })
        .optional(),
    canClaim: z
        .boolean({
            invalid_type_error: "Invalid canClaim",
        })
        .optional(),
});

module.exports = async function queryValidationMiddleware(req, res, next) {
    try {
        requestSchema.parse(req.query);
        next();
    } catch (err) {
        return res.status(400).json({
            ok: false,
            error: serializeError(err.message),
        });
    }
};
