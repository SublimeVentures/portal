const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('upgrade', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'store', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        offerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'offer', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
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
            {unique: true, fields: ['userId', 'storeId', 'offerId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

