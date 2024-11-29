const express = require("express");
const { stake } = require("../controllers/staking");

const router = express.Router();

router.post("/", async (req, res) => {
    const { user } = req;
    return res.status(200).json(await stake(user, req));
});

module.exports = { router };
