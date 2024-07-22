const express = require("express");
const router = express.Router();
const { userVault } = require("../controllers/vault");
const queryMiddleware = require("../middlewares/query.middleware");

router.get("/all", queryMiddleware, async (req, res) => {
    const { user, ...request } = req;

    return res.status(200).json(await userVault(user, request));
});

module.exports = { router };
