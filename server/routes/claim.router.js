const express = require("express");
const router = express.Router();
const { signUserClaim } = require("../controllers/claim");

router.post("/sign", async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await signUserClaim(user, request));
});

module.exports = { router };
