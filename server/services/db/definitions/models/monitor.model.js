const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "monitor",
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
                    model: "user", // This is a reference to another model
                    key: "id", // This is the column name of the referenced model
                },
            },
            offerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "offer", // This is a reference to another model
                    key: "id", // This is the column name of the referenced model
                },
            },
        },
        {
            indexes: [{ unique: false, fields: ["userId"] }],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
