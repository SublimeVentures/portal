const Currency = require("../models/currency.js");

async function getPayableCurrencies() {
    return Currency.find({isSettlement: true},{address:1, precision:1, symbol:1, _id:0});
}

async function getCurrencies() {
    const env = await Currency.find({}, '-_id')
    return Object.assign({}, ...(env.map(item => ({ [item.address]: {symbol: item.symbol, precision: item.precision, isSettlement: item.isSettlement} }) )));
}



module.exports = { getPayableCurrencies, getCurrencies }
