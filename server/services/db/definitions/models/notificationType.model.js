const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "notificationType",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                defaultValue: 0,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        },
    );
};
