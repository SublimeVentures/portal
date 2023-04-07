const mongoose = require("mongoose");

const EnvironmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },
        value: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.models.Environment || mongoose.model('Environment', EnvironmentSchema)
