const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {
    sequelize.define('otcPending', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hashRelated: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        nftId: {
            type: DataTypes.INTEGER,
        },
        acl: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isBuyer: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isTaker: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        isExpired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        data: {
            type: DataTypes.JSON,
        },
    }, {
        indexes: [
            {unique: true, fields: ['offerId', 'hash']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};
