const express = require("express");
const router = express.Router();
const { signUserClaim } = require("../controllers/claim");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/sign", authMiddleware, async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await signUserClaim(user, request));
});

module.exports = { router };
