const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('diamonds', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tenant: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};
