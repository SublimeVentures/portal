const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('onchainType', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};
