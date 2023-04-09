const mongoose = require("mongoose");

const InjectedUserSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
            index: true
        },
        partner: {
            type: String,
            required: true,
            index: true
        },
        multi: {
            type: Number,
            required: true,
            default: 1
        },
        offerAccess: {
            required: true,
            type: [Number]
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.models.InjectedUser || mongoose.model('InjectedUser', InjectedUserSchema)

