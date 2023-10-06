const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('otcDeals', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        otcId: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        dealId: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
        },
        maker: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        taker: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isSell: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isCancelled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isFilled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isOnChainConfirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        indexes: [
            {unique: false, fields: ['offerId', 'dealId', 'networkChainId']},
            {unique: false, fields: ['maker']},
            {unique: false, fields: ['taker']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

