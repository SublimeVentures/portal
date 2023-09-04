const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('raises', {
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
        alloSide: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloGuaranteed: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloResPartner: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloFilledPartner: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloSidePartner: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },

    }, {
        indexes: [{unique: true, fields: ['offerId']}],
        freezeTableName: true,
        timestamps: true
    });
};

