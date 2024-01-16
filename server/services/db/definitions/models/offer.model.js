const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('offer', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        otc: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        ppu: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            allowNull: false,
        },
        ppuOriginal: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            allowNull: false,
        },
        alloRaised: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        isPaused: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        isSettled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        isRefund: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        isAccelerator: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
        },
        dealStructure: {
            type: DataTypes.STRING,
        },
        genre: {
            type: DataTypes.STRING,
        },
        descriptionId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: true,
            references: {
                model: 'offerDescription',
                key: 'id',
            }
        },
        ticker: {
            type: DataTypes.STRING,
        },
        tge: {
            type: DataTypes.DOUBLE,
        },
        url_discord: {
            type: DataTypes.STRING,
        },
        url_twitter: {
            type: DataTypes.STRING,
        },
        url_web: {
            type: DataTypes.STRING,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true
        },
        t_vesting: {
            type: DataTypes.STRING,
        },
        t_cliff: {
            type: DataTypes.STRING,
        },
        t_unlock: {
            type: DataTypes.ARRAY(DataTypes.JSON)
        },
        t_start: {
            type: DataTypes.INTEGER,
        },
        media: {
            type: DataTypes.ARRAY(DataTypes.JSON)
        },
        display: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        displayPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        vault: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alloTotal: {
            type: DataTypes.INTEGER,
        },
    }, {
        indexes: [
            {unique: true, fields: ['slug']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

