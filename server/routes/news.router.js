const express = require("express");
const router = express.Router();
const { partnerNews } = require("../controllers/news");
const { verifyID } = require("../../src/lib/authHelpers");

router.get("/", async (req, res) => {
    const data = await verifyID(req);
    const { auth, user } = data;
    if (!auth) return res.status(401).json({});
    return partnerNews(req, res, user);
});

module.exports = { router };
