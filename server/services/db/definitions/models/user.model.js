const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
            },
            registeredWith: {
                type: DataTypes.STRING,
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
            },
            passwordHash: {
                type: DataTypes.STRING, // Store hashed passwords only
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            discordId: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            googleId: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            appleId: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
        },
        {
            indexes: [
                // Indexes for faster searches on unique fields
                { unique: true, fields: ["username"] },
                { unique: true, fields: ["email"] },
                { unique: true, fields: ["discordId"] },
                { unique: true, fields: ["googleId"] },
                { unique: true, fields: ["appleId"] },
            ],
            freezeTableName: true,
            timestamps: true,
        },
    );
};
