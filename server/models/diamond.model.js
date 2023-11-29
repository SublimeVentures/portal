const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('diamond', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tenant: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chainId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'network', // This is a reference to another model
                key: 'chainId',       // This is the column name of the referenced model
            }
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};
