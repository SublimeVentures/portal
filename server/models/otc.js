const mongoose = require("mongoose");

const OtcSchema = new mongoose.Schema(
    {
        offerId: {
            type: Number,
            required: false,
            index: true
        },
        dealId: {
            type: Number,
            required: false,
            index: true
        },
        buyer: {
            type: String,
            required: false,
            index: true
        },
        seller: {
            type: String,
            required: true,
            index: true
        },
        destination: {
            type: String,
            required: true,
        },
        payto: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        state: {
            type: Number,
            required: true,
            default: 0, //0- added, 1- filled, 3- removed
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.models.Otc || mongoose.model('Otc', OtcSchema)
