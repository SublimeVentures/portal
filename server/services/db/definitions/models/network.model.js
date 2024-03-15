const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "network",
        {
            chainId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isDev: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            indexes: [{ unique: false, fields: ["isDev"] }],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
