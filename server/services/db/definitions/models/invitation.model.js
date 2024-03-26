const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "invitation",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roles: {
                type: DataTypes.JSON,
                defaultValue: [],
            },
            status: {
                type: DataTypes.ENUM("PENDING", "ACCEPTED", "DECLINED"),
                defaultValue: "PENDING",
                allowNull: false,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        },
    );
};
