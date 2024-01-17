const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('diamond', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        partnerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'partner', 
                key: 'id',       
            }
        },
        chainId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'network', 
                key: 'chainId',       
            }
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};
