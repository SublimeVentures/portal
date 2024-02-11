const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('payout', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        offerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'offer',
                key: 'id',
            }
        },
        offerPayout: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
        },
        snapshotDate: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        claimDate: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        chainId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'network',
                key: 'chainId',
            }
        },
        currency: {
            type: DataTypes.STRING,
        },
        currencySymbol: {
            type: DataTypes.STRING,
        },
        precision: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        indexes: [
            {unique: false, fields: ['offerId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

