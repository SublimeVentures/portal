const {getStore} = require("../queries/store.query");
const {getEnv} = require("../services/db");
const {isBased} = require("../../src/lib/utils");

async function getStoreData() {
    const storeItems =  await getStore()

    if(isBased) {
        storeItems.forEach(function(v){ delete v.priceBytes });
    } else {
        storeItems.forEach(function(v){
            v.price = v.priceBytes
            delete v.priceBytes
        });
    }

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
