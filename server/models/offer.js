const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            index: true
        },
        //blockchain
        b_otc: { //otc channel
            type: Number,
            required: true,
            default: 0
        },
        b_ppu: { //price per unit
            type: Number,
            required: true
        },
        b_alloMin: { //min. allocation
            type: Number,
            required: true
        },
        b_alloRaised: { //allocation raised
            type: Number,
            required: true,
            default:0
        },
        b_tax: { //tax
            type: Number,
            required: true
        },
        b_isPaused: { //pause status
            type: Boolean,
            required: true
        },
        b_isSettled: { //settled status
            type: Boolean,
            required: true
        },
        b_isRefund: { //refund status
            type: Boolean,
            required: true
        },

        //description
        name: { //project name
            type: String,
            required: false
        },
        dealStructure: { //equity/token //old data
            type: String,
            required: false
        },
        alloTotal: { //total raised
            type: Number,
            required: false
        },
        genre: { //description for public investment
            type: String,
            required: false
        },
        image: { //link to the image
            type: String,
            required: false
        },
        description: { //long description
            type: String,
            required: false
        },
        descriptionShort: { //short description
            type: String,
            required: false
        },
        ticker: { //ticker
            type: String,
            required: false
        },
        tge: { //tge price
            type: Number,
            required: false
        },
        url_discord: { //link
            type: String,
            required: false
        },
        url_twitter: { //link
            type: String,
            required: false
        },
        url_web: { //link
            type: String,
            required: false
        },
        url_telegram: { //link
            type: String,
            required: false
        },
        url_medium: { //link
            type: String,
            required: false
        },
        icon: { //name of extra icon
            type: String,
            required: false,
        },
        slug: { //url
            type: String,
            required: false,
            default: "fill"
        },

        display: {
            type: Boolean,
            required: true,
            default: false
        },
        displayPublic: {
            type: Boolean,
            required: true,
            default: false
        },

        open: {
            type: Number,
            required: true
        },
        close: {
            type: Number,
            required: true
        },

    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.models.Offer || mongoose.model('Offer', OfferSchema)
