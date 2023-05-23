const express = require('express')
const router = express.Router();
const {getAccessToken} = require("../services/auth");
const {reserveSpot, reserveExpire, replaceCurrency} = require("../controllers/invest");

router.get('/', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    return res.status(200).json(await reserveSpot(session, req))
});

router.get('/hash', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    return res.status(200).json(await reserveExpire(session, req))
});

module.exports = {router}
