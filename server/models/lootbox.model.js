const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('lootbox', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
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

