const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('upgrade', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloMax: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloUsed: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        isExpired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        indexes: [
            {unique: true, fields: ['owner', 'storeId', 'offerId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

