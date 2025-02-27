const express = require("express");
const router = express.Router();
const { getStoreData } = require("../controllers/store");
const { verifyID } = require("../../src/lib/authHelpers");
const { getStoreItemsOwned } = require("../queries/storeUser.query");

router.get("/owned", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});
    return res.status(200).json(await getStoreItemsOwned(user.userId, user.tenantId));
});

router.get("/", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getStoreData(user));
});

module.exports = { router };
