const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            index: true
        },
        b_name: {
            type: String,
            required: true
        },
        b_data: {
            type: String,
            required: false
        },
        b_otc: {
            type: Number,
            required: true,
            default: 0
        },
        b_ppu: {
            type: Number,
            required: true
        },
        b_alloMin: {
            type: Number,
            required: true
        },
        b_alloRaised: {
            type: Number,
            required: true,
            default:0
        },
        b_alloTotal: {
            type: Number,
            required: true
        },
        b_dopen: {
            type: Number,
            required: true
        },
        b_dclose: {
            type: Number,
            required: true
        },
        b_tax: {
            type: Number,
            required: true
        },
        b_isMultiphase: {
            type: Boolean,
            required: true
        },
        b_isPaused: {
            type: Boolean,
            required: true
        },
        b_isSettled: {
            type: Boolean,
            required: true
        },
        b_isRefund: {
            type: Boolean,
            required: true
        },
        d_type: {
            type: String,
            required: false
        },
        d_image: {
            type: String,
            required: false
        },
        d_desc: {
            type: String,
            required: false
        },
        d_ticker: {
            type: String,
            required: false
        },
        d_tgePrice: {
            type: Number,
            required: false
        },
        d_url_discord: {
            type: String,
            required: false
        },
        d_url_twitter: {
            type: String,
            required: false
        },
        d_url_web: {
            type: String,
            required: false
        },
        d_url_telegram: {
            type: String,
            required: false
        },
        d_url_medium: {
            type: String,
            required: false
        },
        c_display: {
            type: Boolean,
            required: true,
            default: false
        },
        c_type: {
            type: String,
            required: false,
            default: "hot"
        },
        c_url: {
            type: String,
            required: false,
            default: "fill"
        },
        c_filled: {
            type: Boolean,
            required: false,
            default: false
        },
      c_showPublic: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.models.Offer || mongoose.model('Offer', OfferSchema)
