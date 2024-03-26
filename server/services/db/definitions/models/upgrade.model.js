const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "upgrade",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
            },
            storePartnerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "storePartner",
                    key: "id",
                },
            },
            offerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "offer",
                    key: "id",
                },
            },
            amount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            alloMax: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            alloUsed: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            isExpired: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            indexes: [
                { unique: true, fields: ["userId", "storePartnerId", "offerId"] },
                { unique: false, fields: ["offerId"] },
                { unique: false, fields: ["isExpired"] },
            ],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
