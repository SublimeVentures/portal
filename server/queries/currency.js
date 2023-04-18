const Currency = require("../models/currency.js");

async function upsertCurrency(address, logo, name, symbol, precision, isSettlement) {
    return Currency.findOneAndUpdate(
        {
            address: address.toLowerCase()
        }, {
            logo:logo,
            name: name,
            symbol: symbol,
            precision: precision,
            isSettlement: isSettlement,
        }, {upsert: true}
    );
}

 async function getPayableCurrencies() {
    return Currency.find({isSettlement: true},{address:1, precision:1, symbol:1, _id:0});
}
module.exports = { getPayableCurrencies }
