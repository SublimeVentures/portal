const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('currencies', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        logo: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        symbol: {
            type: DataTypes.STRING,
        },
        precision: {
            type: DataTypes.INTEGER,
        },
        isSettlement: {
            type: DataTypes.BOOLEAN,
        },
    }, {
        indexes: [
            {unique: false, fields: ['isSettlement']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

