const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('claim', {
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
                model: 'user',
                key: 'id',
            }
        },
        offerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'offer',
                key: 'id',
            }
        },
        payoutId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'payout',
                key: 'id',
            }
        },
        amount: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
        },
        isClaimed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    }, {
        indexes: [
            {unique: false, fields: ['userId']},
            {unique: false, fields: ['offerId']},
            {unique: false, fields: ['offerId', 'userId']},
            {unique: true, fields: ['offerId', 'userId', 'payoutId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

