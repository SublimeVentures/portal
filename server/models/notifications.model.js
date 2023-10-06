const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {
    sequelize.define('notifications', {
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
        type: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: false,
        },
        data: {
            type: DataTypes.JSON,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        indexes: [
            {unique: false, fields: ['owner']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

