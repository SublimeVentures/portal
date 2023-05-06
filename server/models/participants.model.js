const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('participants', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nftId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        acl: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        hash: {
            type: DataTypes.STRING,
            defaultValue: 10
        },
        tx: {
            type: DataTypes.STRING,
            defaultValue: 10
        },
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isExpired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        indexes: [
            {unique: false, fields: ['nftId']},
            {unique: true, fields: ['hash']},
            {unique: true, fields: ['address', 'hash']},
        ],

        freezeTableName: true,
        timestamps: true
    });
};

