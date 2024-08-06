const express = require("express");
const router = express.Router();
const { getStoreData } = require("../controllers/store");
const { getStoreItemsOwned } = require("../queries/storeUser.query");

router.get("/owned", async (req, res) => {
    const { user } = req;
    return res.status(200).json(await getStoreItemsOwned(user.userId, user.tenantId));
});

router.get("/", async (req, res) => {
    const { user } = req;
    return res.status(200).json(await getStoreData(user));
});

module.exports = { router };
