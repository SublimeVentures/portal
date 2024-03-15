const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "otcLock",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            wallet: {
                type: DataTypes.STRING,
                defaultValue: 0,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
            },
            offerId: {
                type: DataTypes.INTEGER,
                unique: false,
                allowNull: false,
                references: {
                    model: "offer",
                    key: "id",
                },
            },
            otcDealId: {
                type: DataTypes.INTEGER,
                unique: false,
                allowNull: false,
                references: {
                    model: "otcDeal",
                    key: "id",
                },
            },
            expiryDate: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            isExpired: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            isSell: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            indexes: [
                { unique: false, fields: ["userId"] },
                { unique: false, fields: ["wallet"] },
                { unique: false, fields: ["isExpired"] },
            ],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
