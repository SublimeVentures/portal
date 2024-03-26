const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "partnerDetails",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            partnerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "partner",
                    key: "id",
                },
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            symbol: {
                type: DataTypes.STRING,
            },
            erc: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            isDynImageUri: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isDynMetadataUri: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isDynMultiplier: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            dynMultiplierProp: {
                type: DataTypes.STRING,
            },
            dynMultiplierVal: {
                type: DataTypes.JSON,
            },
            multiplier: {
                type: DataTypes.FLOAT,
                defaultValue: 5,
            },
            uriToken: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            uriImage: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            chainId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "network",
                    key: "chainId",
                },
            },
        },
        {
            indexes: [
                { unique: true, fields: ["address"] },
                { unique: false, fields: ["partnerId"] },
            ],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
