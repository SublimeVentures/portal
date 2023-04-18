const express = require('express')
const router = express.Router();
const {getAccessToken} = require("../services/auth");
const {reserveSpot} = require("../controllers/invest");
const {getPayableCurrencies} = require("../queries/currency");

router.get('/', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    return res.status(200).json(await getPayableCurrencies())
});


module.exports = {router}
