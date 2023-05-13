const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {
    sequelize.define('otcSettlement', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
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
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        indexes: [
            {unique: true, fields: ['offerId', 'dealId', 'hash']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};
