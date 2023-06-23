const express = require('express')
const router = express.Router();
const {getMarkets, getOffers, getHistory, createOffer, removeOffer} = require("../controllers/otc");

router.get('/markets', async (req, res) => {
    // const session = await getAccessToken(req)
    // if (!session) return res.status(401).json({})
    const session = {}
    return res.status(200).json(await getMarkets(session, req))
});

router.get('/offers/:id', async (req, res) => {
    // const session = await getAccessToken(req)
    // if (!session) return res.status(401).json({})
    const session = {}

    return res.status(200).json(await getOffers(session, req))
});

router.post('/:id/create', async (req, res) => {
    // const session = await getAccessToken(req)
    // if (!session) return res.status(401).json({})
    const session = {}

    return res.status(200).json(await createOffer(session, req))
});

router.post('/:id/remove', async (req, res) => {
    // const session = await getAccessToken(req)
    // if (!session) return res.status(401).json({})
    const session = {}

    return res.status(200).json(await removeOffer(session, req))
});

router.get('/history/:id', async (req, res) => {
    // const session = await getAccessToken(req)
    // if (!session) return res.status(401).json({})
    const session = {}

    return res.status(200).json(await getHistory(session, req))
});


module.exports = {router}
