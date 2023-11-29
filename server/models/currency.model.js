const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('currency', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        logo: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        symbol: {
            type: DataTypes.STRING,
        },
        precision: {
            type: DataTypes.INTEGER,
        },
        isSettlement: {
            type: DataTypes.BOOLEAN,
        },
        chainId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'network', // This is a reference to another model
                key: 'chainId',       // This is the column name of the referenced model
            }
        },
    }, {
        indexes: [
            {unique: false, fields: ['isSettlement']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

