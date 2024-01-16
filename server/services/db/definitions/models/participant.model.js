const {DataTypes} = require("sequelize");

function defineParticipantModel(sequelize, identifier) {
    const modelName = `z_participant_${identifier}`;
    sequelize.define(modelName, {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        onchainId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: true,
            references: {
                model: 'onchain',
                key: 'id',
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
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
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'partner',
                key: 'id',
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
            {unique: true, fields: ['onchainId']},
            {unique: true, fields: ['hash', 'userId']},
            {unique: false, fields: ['userId']},
            {unique: false, fields: ['isExpired']},
            {unique: false, fields: ['isGuaranteed']},
            {unique: false, fields: ['isConfirmedInitial']},
            {unique: false, fields: ['createdAt']},
        ],
        tableName: modelName,
        freezeTableName: true,
        timestamps: true
    });
    return sequelize.models[modelName];
}


module.exports = { defineParticipantModel };
