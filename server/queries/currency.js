import Currency from "../models/currency.js";

export async function upsertCurrency(address, logo, name, symbol, precision, isSettlement) {
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
