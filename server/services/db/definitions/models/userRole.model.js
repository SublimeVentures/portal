const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "userRole",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "role", // This is a reference to another model
                    key: "id", // This is the column name of the referenced model
                },
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user", // This is a reference to another model
                    key: "id", // This is the column name of the referenced model
                },
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        },
    );
};
