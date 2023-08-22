const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('upgrade', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    }, {
        indexes: [
            {unique: true, fields: ['owner', 'storeId', 'offerId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

