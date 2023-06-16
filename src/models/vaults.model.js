const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('vaults', {
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
        invested: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        refund: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        refundState: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        locked: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    }, {
        indexes: [
            {unique: true, fields: ['owner', 'offerId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

