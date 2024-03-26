const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "ntStake",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            tokenId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            season: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            bytes: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            timelock: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            indexes: [{ unique: true, fields: ["tokenId", "season"] }],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
