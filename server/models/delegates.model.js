const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('delegates', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        vault: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        partner: {
            type: DataTypes.STRING,
        },
        token: {
            type: DataTypes.INTEGER,
        },

    }, {
        freezeTableName: true,
        timestamps: true,
    });
};

