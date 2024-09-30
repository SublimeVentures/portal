const express = require("express");
const { reassign } = require("../controllers/reassign");
const router = express.Router();

router.get("/", async (req, res) => {
    const { user } = req;

    const reassignRes = await reassign(req, user);

    return res.status(200).json(reassignRes);
});

module.exports = { router };
