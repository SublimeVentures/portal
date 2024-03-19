const express = require("express");
const router = express.Router();
const { verifyID } = require("../../src/lib/authHelpers");
const { signUserClaim } = require("../controllers/claim");

router.post("/sign", async (req, res) => {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    return res.status(200).json(await signUserClaim(user, req));
});

module.exports = { router };
