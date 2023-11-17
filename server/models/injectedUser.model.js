const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('injectedUser', {
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
        },
        partnerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'partner',
                key: 'id',
            }
        },
    }, {
        indexes: [
            {unique: false, fields: ['access']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

