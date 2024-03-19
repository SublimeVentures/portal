const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "storePartner",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            storeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "store",
                    key: "id",
                },
            },
            tenantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "partner",
                    key: "id",
                },
            },
            price: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            availability: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            img: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            enabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            indexes: [
                { unique: false, fields: ["storeId"] },
                { unique: false, fields: ["tenantId"] },
            ],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
