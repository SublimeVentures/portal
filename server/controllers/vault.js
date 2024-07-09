const { getUserVault, getUserVaultStats } = require("../queries/vaults.query");

async function userVault(req, res, user) {
    const { userId, partnerId, tenantId } = user;
    let { limit, sortBy, sortOrder, isUpcoming, canClaim } = req.query;

    // Convert query parameters to appropriate types
    limit = limit ? Number(limit) : undefined;
    isUpcoming = convertToBoolean(isUpcoming);
    canClaim = convertToBoolean(canClaim);

    const validationErrors = validateQueryParams({ limit, sortBy, sortOrder, isUpcoming, canClaim });
    if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors.join(", ") });
    }

    const vault = await getUserVault(userId, partnerId, tenantId, { limit, sortBy, sortOrder, isUpcoming, canClaim });

    return res.status(200).json(vault);
}

function validateQueryParams({ limit, sortBy, sortOrder, isUpcoming, canClaim }) {
    const errors = [];
    if (limit && isNaN(limit)) errors.push("Invalid limit");
    if (sortBy && !["createdAt", "performance"].includes(sortBy)) errors.push("Invalid sortBy");
    if (sortOrder && !["ASC", "DESC"].includes(sortOrder)) errors.push("Invalid sortOrder");
    if (isUpcoming !== undefined && typeof isUpcoming !== "boolean") errors.push("Invalid isUpcoming");
    if (canClaim !== undefined && typeof canClaim !== "boolean") errors.push("Invalid canClaim");

    return errors;
}

function convertToBoolean(value) {
    if (value === undefined) return undefined;
    if (value === "true") return true;
    if (value === "false") return false;
    return value; // leave as is if not 'true' or 'false'
}

async function userVaultStats(req, res, user) {
    const { userId } = user;

    const vaultStats = await getUserVaultStats(userId);

    return res.status(200).json(vaultStats);
}

module.exports = { userVault, userVaultStats };
