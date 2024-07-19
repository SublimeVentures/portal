const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { userPayout } = require("../controllers/payout");

router.get("/:id", authMiddleware, async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await userPayout(user, request));
});

module.exports = { router };
