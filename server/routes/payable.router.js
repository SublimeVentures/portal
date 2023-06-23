const express = require('express')
const router = express.Router();
const {getPayableCurrencies} = require("../queries/currencies.query");
const {getEnv} = require("../services/db");

router.get('/currencies', async (req, res) => {
    // const session = await getAccessToken(req)
    // if (!session) return res.status(401).json({})

    return res.status(200).json(await getPayableCurrencies(getEnv().isDev))
});


module.exports = {router}
