const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('multichain', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};

