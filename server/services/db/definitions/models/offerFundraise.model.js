const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('offerFundraise', {
        alloRes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloFilled: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloGuaranteed: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloFilledInjected: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloGuaranteedInjected: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        offerId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            references: {
                model: 'offer', 
                key: 'id',       
            }
        },
    }, {
        indexes: [{unique: true, fields: ['offerId']}],
        freezeTableName: true,
        timestamps: true
    });
};

