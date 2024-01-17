const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('storeUser', {
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
        storePartnerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'storePartner',
                key: 'id',
            }
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    }, {
        indexes: [
            {unique: true, fields: ['userId', 'storePartnerId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

