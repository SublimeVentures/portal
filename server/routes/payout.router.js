const express = require("express");
const router = express.Router();
const { userPayout, userPayouts } = require("../controllers/payout");

router.get("/", async (req, res) => {
    const { user } = req;

    return userPayouts(req, res, user);
});

router.get("/:id", async (req, res) => {
    const { user } = req;

    return res.status(200).json(await userPayout(user, req));
});

module.exports = { router };
