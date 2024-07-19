const express = require("express");
const router = express.Router();
const { claim } = require("../controllers/mysterybox");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/claim", authMiddleware, async (req, res) => {
    const { user } = req;

    return res.status(200).json(await claim(user));
});

module.exports = { router };
