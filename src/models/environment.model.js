const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('environment', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        value: {
            type: DataTypes.STRING,
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};

