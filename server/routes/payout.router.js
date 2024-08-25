const express = require("express");
const router = express.Router();
const { userPayout } = require("../controllers/payout");

router.get("/:id", async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await userPayout(user, request));
});

module.exports = { router };
