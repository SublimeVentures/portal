const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('otcLock', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        wallet: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user', // This is a reference to another model
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
        otcDealId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            references: {
                model: 'otcDeal', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
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
            {unique: false, fields: ['userId']},
            {unique: false, fields: ['wallet']},
            {unique: false, fields: ['isExpired']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

