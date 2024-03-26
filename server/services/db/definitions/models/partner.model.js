const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "partner",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            logo: {
                type: DataTypes.STRING,
            },
            name: {
                type: DataTypes.STRING,
            },
            slug: {
                type: DataTypes.STRING,
            },
            acl: {
                type: DataTypes.INTEGER,
            },
            tenantDomain: {
                type: DataTypes.STRING,
            },
            isVisible: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isEnabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isPartner: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isTenant: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isMysteryboxEnabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            displayOrder: {
                type: DataTypes.INTEGER,
            },
            isNewLabel: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            indexes: [{ unique: true, fields: ["slug"] }],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
