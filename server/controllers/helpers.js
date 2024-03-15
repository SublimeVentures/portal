const crypto = require("crypto");

const createHash = (data) => {
    return crypto.createHash("shake256", { outputLength: 3 }).update(data).digest("hex");
};

module.exports = { createHash };
