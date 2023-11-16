const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('environment_based', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        value: {
            type: DataTypes.STRING,
        },
        valueJSON: {
            type: DataTypes.JSON,
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};

