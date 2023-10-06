const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('otcLocks', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        owner: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: false,
        },
        offerId: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        expiryDate: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        isExpired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        isSell: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },

    }, {
        indexes: [
            {unique: false, fields: ['owner']},
            {unique: false, fields: ['isExpired']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

