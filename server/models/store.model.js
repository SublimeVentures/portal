const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('store', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        priceBytes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        availability: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};

