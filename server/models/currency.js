const mongoose = require("mongoose");

const CurrencySchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
            index: true
        },
        logo: {
            type: String,
            required: false,
            default: "",
        },
        name: {
            type: String,
            required: true,
            default: "",
        },
        symbol: {
            type: String,
            required: true,
            default: "",
        },
        precision: {
            type: Number,
            required: true,
            default: 0,
        },
        isSettlement: {
            type: Boolean,
            required: true,
            default: false,
            index: true
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.models.Currency || mongoose.model('Currency', CurrencySchema)
