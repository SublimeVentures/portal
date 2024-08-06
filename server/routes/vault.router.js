const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { userVault } = require("../controllers/vault");
const queryMiddleware = require("../middlewares/query.middleware");

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

router.get("/all", queryMiddleware(requestSchema), async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await userVault(user, request));
});

module.exports = { router };
