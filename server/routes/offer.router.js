const express = require('express')
const router = express.Router();
const {getParamOfferDetails, getOfferAllocation} = require("../controllers/offerDetails");
const {getParamOfferList} = require("../controllers/offerList");
const {verifyID} = require("../../src/lib/authHelpers");
const {useUpgrade} = require("../controllers/upgrade");

router.get('/', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});

    return res.status(200).json(await getParamOfferList(user))
});

router.get('/:slug', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});

    res.status(200).json(await getParamOfferDetails(user, req))
});

router.get('/:id/allocation', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});

    res.status(200).json(await getOfferAllocation(user, req))
});

router.get('/upgrade/:id/:upgrade', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});

    return res.status(200).json(await useUpgrade(user, req))
});



module.exports = {router}
