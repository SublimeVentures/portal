const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('storeMysterybox', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        claimedBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        item: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        upgradeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM("allocation", "upgrade", "discount", "NFT"),
            allowNull: false,
        }
    }, {
        indexes: [
            {unique: true, fields: ['code']},
            {unique: true, fields: ['claimedBy', 'code']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

