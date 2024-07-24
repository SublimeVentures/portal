const express = require("express");
const router = express.Router();

const { verifyID } = require("../../src/lib/authHelpers");
const { getNetworkList } = require("../queries/network.query");

router.get("/", async (req, res) => {
    const { auth } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await getNetworkList());
});

module.exports = { router };
