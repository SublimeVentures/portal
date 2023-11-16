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
        offerId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            references: {
                model: 'offer', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
    }, {
        indexes: [{unique: true, fields: ['offerId']}],
        freezeTableName: true,
        timestamps: true
    });
};

