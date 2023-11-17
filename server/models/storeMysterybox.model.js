const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('storeMysterybox', {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        item: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'store', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },
        offerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'offer', // This is a reference to another model
                key: 'id',       // This is the column name of the referenced model
            }
        },

        amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM("allocation", "upgrade", "discount", "NFT"),
            allowNull: false,
        }
    }, {
        indexes: [
            {unique: true, fields: ['code']},
            {unique: true, fields: ['userId', 'code']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

