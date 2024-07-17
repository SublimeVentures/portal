const { serializeError } = require("serialize-error");
const logger = require("../../src/lib/logger");
const { getUserPayout, getAllPayouts } = require("../queries/payout.query");

async function userPayout(user, req) {
    try {
        const { userId } = user;
        const offerId = Number(req.params.id);
        return await getUserPayout(userId, offerId);
    } catch (error) {
        logger.error(`Can't fetch userPayout`, {
            error: serializeError(error),
            params: req.params,
        });
        return [];
    }
}

async function userPayouts(req, res, user) {
    try {
        const { userId } = user;
        let { limit, sortBy, sortOrder, isPending, isUpcoming, isSoon } = req.query;

        // Convert query parameters to appropriate types
        limit = limit ? Number(limit) : undefined;
        isPending = convertToBoolean(isPending);
        isUpcoming = convertToBoolean(isUpcoming);
        isSoon = convertToBoolean(isSoon);

        const validationErrors = validateQueryParams({ limit, sortBy, sortOrder, isPending, isUpcoming, isSoon });
        if (validationErrors.length > 0) {
            return res.status(400).json({ error: validationErrors.join(", ") });
        }

        const payouts = await getAllPayouts({ userId, limit, sortBy, sortOrder, isPending, isUpcoming, isSoon });
        return res.status(200).json(payouts);
    } catch (error) {
        logger.error(`Can't fetch userPayouts`, {
            error: serializeError(error),
            params: req.params,
        });
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

function validateQueryParams({ limit, sortBy, sortOrder, isPending, isUpcoming, isSoon }) {
    const errors = [];
    if (limit && isNaN(limit)) errors.push("Invalid limit");
    if (sortBy && !["createdAt", "amount"].includes(sortBy)) errors.push("Invalid sortBy");
    if (sortOrder && !["ASC", "DESC"].includes(sortOrder)) errors.push("Invalid sortOrder");
    if (isPending !== undefined && typeof isPending !== "boolean") errors.push("Invalid isPending");
    if (isUpcoming !== undefined && typeof isUpcoming !== "boolean") errors.push("Invalid isUpcoming");
    if (isSoon !== undefined && typeof isSoon !== "boolean") errors.push("Invalid isSoon");

    return errors;
}

function convertToBoolean(value) {
    if (value === undefined) return undefined;
    if (value === "true") return true;
    if (value === "false") return false;
    return value; // leave as is if not 'true' or 'false'
}

module.exports = { userPayout, userPayouts };
