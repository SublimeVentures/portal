const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "offerDescription",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            description: {
                type: DataTypes.TEXT,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        },
    );
};
