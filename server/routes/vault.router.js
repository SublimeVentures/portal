const express = require("express");
const router = express.Router();
const { userVault } = require("../controllers/vault");
const { verifyID } = require("../../src/lib/authHelpers");

router.get("/all", async (req, res) => {
    const data = await verifyID(req);
    const { auth, user } = data;
    if (!auth) return res.status(401).json({});
    return userVault(req, res, user);
});

module.exports = { router };
