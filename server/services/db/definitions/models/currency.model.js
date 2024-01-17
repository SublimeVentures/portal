const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('currency', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        logo: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        symbol: {
            type: DataTypes.STRING,
        },
        precision: {
            type: DataTypes.INTEGER,
        },
        isSettlement: {
            type: DataTypes.BOOLEAN,
        },
        isStore: {
            type: DataTypes.BOOLEAN,
        },
        isStaking: {
            type: DataTypes.BOOLEAN,
        },
        chainId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'network', 
                key: 'chainId',       
            }
        },
        partnerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'partner', 
                key: 'id',       
            }
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });
};

