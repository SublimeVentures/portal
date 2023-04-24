const mongoose = require("mongoose");

const DelegateSchema = new mongoose.Schema(
    {
        address: {
            type: Number,
            required: true,
            index: true,
        },
        vault: {
            type: String,
            required: true,
            index: true,
        },
        partner: {
            type: String,
            required: true,
        },
        token: {
            type: Number,
            required: true,
            default:0
        },

    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.models.Delegate || mongoose.model('Delegate', DelegateSchema)
