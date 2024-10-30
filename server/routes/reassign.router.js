const express = require("express");
const { reassign, awaitReassign } = require("../controllers/reassign");
const router = express.Router();

router.get("/", async (req, res) => {
    const { user } = req;

    const reassignRes = await reassign(req, user);

    return res.status(reassignRes.ok ? 200 : 500).json(reassignRes);
});

router.get("/await/:vaultId", async (req, res) => {
    const awaitRes = await awaitReassign(req);

    return res.status(awaitRes ? 200 : 500).json(awaitRes);
});

module.exports = { router };
