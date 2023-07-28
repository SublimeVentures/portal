const {getStore} = require("../queries/store.query");
const {getEnv} = require("../services/db");

async function getStoreData() {
    const storeItems =  await getStore()

    return {
        store: storeItems,
        env: {
            cdn: getEnv().cdn,
            contract: getEnv().diamond,
            currency: getEnv().currenciesStore
        }
    }
}

module.exports = {getStoreData}
