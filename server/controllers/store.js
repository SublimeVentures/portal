const { getStore } = require("../queries/store.query");

async function getStoreData(user) {
    return await getStore(user.partnerId, user.tenantId);
}

module.exports = { getStoreData };
