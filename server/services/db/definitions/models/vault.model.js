const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "vault",
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
            offerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "offer",
                    key: "id",
                },
            },
            invested: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            refund: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            refundState: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            locked: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            claimed: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
                allowNull: false,
            },
        },
        {
            indexes: [{ unique: true, fields: ["userId", "offerId"] }],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
