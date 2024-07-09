const express = require("express");
const router = express.Router();
const { userVault, userVaultStats } = require("../controllers/vault");
const { verifyID } = require("../../src/lib/authHelpers");

router.get("/all", async (req, res) => {
    const data = await verifyID(req);
    const { auth, user } = data;
    if (!auth) return res.status(401).json({});
    return userVault(req, res, user);
});

router.get("/stats", async (req, res) => {
    const data = await verifyID(req);
    const { auth, user } = data;
    if (!auth) return res.status(401).json({});
    return userVaultStats(req, res, user);
});

module.exports = { router };
