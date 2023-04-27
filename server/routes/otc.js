const express = require('express')
const router = express.Router();
const {getAccessToken} = require("../services/auth");
const {getMarkets, getOffers, getHistory} = require("../controllers/otc");

router.get('/markets', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    return res.status(200).json(await getMarkets())
});

router.get('/offers/:id', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    return res.status(200).json(await getOffers(req))
});

router.get('/history/:id', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    return res.status(200).json(await getHistory(req))
});


module.exports = {router}
