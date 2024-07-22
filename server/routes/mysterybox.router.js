const express = require("express");
const router = express.Router();
const { claim } = require("../controllers/mysterybox");

router.get("/claim", async (req, res) => {
    const { user } = req;

    return res.status(200).json(await claim(user));
});

module.exports = { router };
