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
                model: 'onchainType', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        chainId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'network', // This is a reference to another model
                key: 'chainId',       // This is the column name of the referenced model
            }
        },
        tenant: {
            type: DataTypes.STRING,
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
