const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema(
    {
        owner: {
            type: String,
            required: true,
            index: true
        },
        offerId: {
            type: Number,
            required: true,
            index: true
        },
        invested: {
            type: Number,
            required: true,
        },
        availableRefund: {
            type: Number,
            required: true,
        },
        refundState: {
            type: Number,
            required: true,
        },
        locked: {
            type: Boolean,
            required: true
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.models.InvestmentSchema || mongoose.model('Investment', InvestmentSchema)
