const mongoose = require("mongoose");

function dynamicSchema(investment) {
    const OfferLogSchema = new mongoose.Schema(
        {
            address: {
                type: String,
                required: true,
                index: true
            },
            amount: {
                type: Number,
                required: false
            },
            hash: {
                type: String,
                required: true
            },
            currency: {
                type: String,
                required: true
            },
            acl: {
                type: Number,
                required: true
            },
            isConfirmed: {
                type: Boolean,
                required: true,
                default:false
            },
            tx: {
                type: String,
                required: false
            },
            isExpired: {
                type: Boolean,
                required: true,
                default: false
            },
            nftId: {
                type: Number,
                required: false,
                default: 0
            }

        },
        {
            versionKey: false,
            timestamps: true
        }
    )

    return mongoose.models[`zlog.${investment}`] || mongoose.model(`zlog.${investment}`, OfferLogSchema);
}


module.exports = dynamicSchema
