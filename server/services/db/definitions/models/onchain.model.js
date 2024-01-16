const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('onchain', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        txID: {
            type: DataTypes.STRING,
            unique: true
        },
        from: {
            type: DataTypes.STRING,
        },
        to: {
            type: DataTypes.STRING,
        },
        typeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'onchainType', 
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
        tenant: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'partner',
                key: 'id',
            }
        },
        data: {
            type: DataTypes.JSON,
        },
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isReverted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isRegisteredExecuted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isConfirmedExecuted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isRevertedExecuted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        blockRegistered: {
            type: DataTypes.BIGINT,
        },
        blockConfirmed: {
            type: DataTypes.BIGINT,
        },
        blockReverted: {
            type: DataTypes.BIGINT,
        },
    }, {
        indexes: [
            {unique: true, fields: ['txID', 'chainId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};
