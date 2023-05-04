const express = require('express')
const router = express.Router();
const {getEnv} = require("../services/mongo");
const {getAccessToken} = require("../services/auth");
const {getParamOfferDetails, getOfferAllocation} = require("../controllers/offerDetails");
const {getParamOfferList} = require("../controllers/offerList");
const {getInjectedUser} = require("../queries/injectedUser.query");

router.get('/', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    return res.status(200).json(await getParamOfferList(session, req))
});

router.get('/:slug', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    res.status(200).json(await getParamOfferDetails(session, req))
});

router.get('/:id/allocation', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    res.status(200).json(await getOfferAllocation(session, req))
});


module.exports = {router}
