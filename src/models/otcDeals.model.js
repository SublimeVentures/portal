const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {
    sequelize.define('otcDeals', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        hashCreate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hashSettle: {
            type: DataTypes.STRING,
        },
        dealId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        buyer: {
            type: DataTypes.STRING,
        },
        seller: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,  //0- added, 1- filled, 3- removed
        },

    }, {
        indexes: [
            {unique: true, fields: ['offerId', 'dealId']},
            {unique: false, fields: ['offerId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

