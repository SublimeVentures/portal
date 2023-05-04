const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('networks', {
        chainId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isDev: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });


};

