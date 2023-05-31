const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('injectedUsers', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        ownedNfts: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        access: {
            type: DataTypes.ARRAY(DataTypes.INTEGER)
        }
    }, {
        indexes: [
            {unique: false, fields: ['access']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

