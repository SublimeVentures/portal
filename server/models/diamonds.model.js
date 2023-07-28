const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('diamonds', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        tenant: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: false
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};

// 0x1feEFAD7c874A93056AFA904010F9982c0722dFc
