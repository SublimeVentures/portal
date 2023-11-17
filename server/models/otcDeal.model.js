const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('otcDeal', {
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
        onchainId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: true,
            references: {
                model: 'onchain', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        offerId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            references: {
                model: 'offer', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        indexes: [
            {unique: false, fields: ['offerId', 'dealId']},
            {unique: false, fields: ['maker']},
            {unique: false, fields: ['taker']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

