const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "environment",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
                type: DataTypes.STRING,
            },
            valueJSON: {
                type: DataTypes.JSON,
            },
            partnerId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "partner",
                    key: "id",
                },
            },
        },
        {
            indexes: [{ unique: true, fields: ["name", "partnerId"] }],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
