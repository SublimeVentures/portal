const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "offerLimit",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            offerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "offer",
                    key: "id",
                },
            },
            partnerId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "partner",
                    key: "id",
                },
            },
            alloMin: {
                type: DataTypes.INTEGER,
            },
            alloMax: {
                type: DataTypes.INTEGER,
            },
            d_open: {
                type: DataTypes.INTEGER,
            },
            d_close: {
                type: DataTypes.INTEGER,
            },
            lengthWhales: {
                type: DataTypes.INTEGER,
            },
            lengthRaffle: {
                type: DataTypes.INTEGER,
            },
            lengthFCFS: {
                type: DataTypes.INTEGER,
            },
            lengthGuaranteed: {
                type: DataTypes.INTEGER,
            },
            guaranteedIsExpired: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            indexes: [{ unique: true, fields: ["partnerId", "offerId"] }],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
