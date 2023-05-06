const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define('offers', {
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
        alloMin: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        alloRaised: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        tax: {
            type: DataTypes.INTEGER,
            defaultValue: 10,
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
        isPhased: {
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
        rrPages: {
            type: DataTypes.INTEGER,
        },
        genre: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
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
        icon: {
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
        access: {
            type: DataTypes.INTEGER,
            defaultValue: 0, //0 - only whales, 1- everyone, 2-only partners
            allowNull: false,
        },
        accessPartnerDate: {
            type: DataTypes.INTEGER,
        },
        d_open: {
            type: DataTypes.INTEGER,
        },
        d_close: {
            type: DataTypes.INTEGER,
        },
        d_openPartner: {
            type: DataTypes.INTEGER,
        },
        d_closePartner: {
            type: DataTypes.INTEGER,
        },
        alloMax: {
            type: DataTypes.INTEGER,
        },
        alloMaxPartner: {
            type: DataTypes.INTEGER,
        },
        alloTotal: {
            type: DataTypes.INTEGER,
        },
        alloTotalPartner: {
            type: DataTypes.INTEGER,
        },
        alloRequired: {
            type: DataTypes.INTEGER,
        },
        alloRequiredPartner: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        indexes: [
            {unique: true, fields: ['slug']},
        ],
        freezeTableName: true,
        timestamps: true
    });
};

