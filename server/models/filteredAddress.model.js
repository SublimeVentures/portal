const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('filteredAddress', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        wallet: {
            type: DataTypes.STRING,
            unique: true
        },
        filter: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        freezeTableName: true,
        timestamps: true
    });
};
