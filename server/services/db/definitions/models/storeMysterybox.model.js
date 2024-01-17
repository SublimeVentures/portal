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
            allowNull: true,
            references: {
                model: 'user',
                key: 'id',
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
        storePartnerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'storePartner',
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
        offerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'offer',
                key: 'id',
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

