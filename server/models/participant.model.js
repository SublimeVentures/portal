const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('participant_36', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        onchainId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: true,
            references: {
                model: 'onchain', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        hash: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        isConfirmedInitial: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isExpired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isGuaranteed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [
            {unique: true, fields: ['hash']},
            {unique: true, fields: ['onchainId']},
            {unique: false, fields: ['userId']},
        ],

        freezeTableName: true,
        timestamps: true
    });
};

