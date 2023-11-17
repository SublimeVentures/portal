const {DataTypes} = require("sequelize");


module.exports = (sequelize) => {
    sequelize.define('notification', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        typeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'notificationType', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        data: {
            type: DataTypes.JSON,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        indexes: [
            {unique: false, fields: ['userId']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

