const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "role",
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
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            permissions: {
                type: DataTypes.ARRAY(DataTypes.INTEGER),
                defaultValue: [],
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        },
    );
};
