const mongoose = require("mongoose");

const RaiseSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            index: true,
            unique: true
        },
        alloRes: {
            type: Number,
            required: true,
            default:0
        },
        alloFilled: {
            type: Number,
            required: true,
            default:0
        },
        alloSide: {
            type: Number,
            required: true,
            default:0
        },

        alloResPartner: {
            type: Number,
            required: true,
            default:0
        },
        alloFilledPartner: {
            type: Number,
            required: true,
            default:0
        },
        alloSidePartner: {
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

module.exports = mongoose.models.Raise || mongoose.model('Raise', RaiseSchema)
