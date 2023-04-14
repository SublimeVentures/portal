const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
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
            required: false,
            default: "",
        },
        symbol: {
            type: String,
            required: false,
            default: "",
        },
        level: {
            type: Number,
            required: true,
            default: 0,
        },
        type: {
            type: Number,
            required: true,
            default: 0,
        },
        isPartner: {
            type: Boolean,
            required: true,
            default: false,
        },
        isVisible: {
            type: Boolean,
            required: true,
            default: false,
        },
        isEnabled: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema)

