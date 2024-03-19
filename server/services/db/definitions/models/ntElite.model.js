const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "ntElite",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        },
    );
};
