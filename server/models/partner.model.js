const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('partner', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
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
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        erc: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isMetadata: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        metadataProp: {
            type: DataTypes.STRING,
        },
        metadataVal: {
            type: DataTypes.JSON,
        },
        multiplier: {
            type: DataTypes.INTEGER,
            defaultValue: 5
        },
        isDynamicImage: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
        isDynamicMetadata: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
        tokenUri: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imageUri: {
            type: DataTypes.STRING,
            allowNull: true,
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
        indexes: [
            {unique: true, fields: ['address']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

