const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('userWallet', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        wallet: {
            type: DataTypes.STRING, // For primary Web3 wallet address
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            }
        },
        isStaking: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDelegate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        indexes: [
            { unique: true, fields: ['wallet', 'isActive'] },
            { unique: false, fields: ['userId'] }
        ],
        freezeTableName: true,
        timestamps: true
    });
};
