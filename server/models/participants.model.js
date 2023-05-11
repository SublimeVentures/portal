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
            defaultValue: 0
        },
        acl: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        hash: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        tx: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        isConfirmedInitial: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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

