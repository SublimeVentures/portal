const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "notification",
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
            typeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "notificationType",
                    key: "id",
                },
            },
            onchainId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "onchain",
                    key: "id",
                },
            },
            offerId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "offer",
                    key: "id",
                },
            },
            tenantId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "partner",
                    key: "id",
                },
            },
            data: {
                type: DataTypes.JSON,
                allowNull: false,
            },
        },
        {
            indexes: [{ unique: false, fields: ["userId"] }],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
