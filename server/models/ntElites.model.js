const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('ntElites', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
    }, {
        freezeTableName: true,
        timestamps: false
    });
};

