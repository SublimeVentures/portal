const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('partners', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
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
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        erc: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        multiplier: {
            type: DataTypes.INTEGER,
            defaultValue: 5
        },
    }, {
        indexes: [
            {unique: true, fields: ['address']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

