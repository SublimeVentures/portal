const {getUserVault} = require("../queries/vaults.query");

async function userVault(user) {
    const {userId, partnerId, tenantId} = user
    return await getUserVault(userId, partnerId, tenantId)
}

module.exports = {userVault}
