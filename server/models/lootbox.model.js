const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('lootbox', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rewardType: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        claimed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};

