const express = require('express')
const router = express.Router();
const {userInvestment, userVault} = require("../controllers/vault");
const {verifyID} = require("../../src/lib/authHelpers");

router.get('/', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});
    return res.status(200).json(await userInvestment(user, req))
});

router.get('/all', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});

    return res.status(200).json(await userVault(user, req))
});


module.exports = {router}
