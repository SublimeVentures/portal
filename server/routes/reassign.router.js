const express = require("express");
const { reassign } = require("../controllers/reassign");
const router = express.Router();

router.get("/", async (req, res) => {
    const { user } = req;

    return res.status(200).json(await reassign(user));
});

module.exports = { router };
