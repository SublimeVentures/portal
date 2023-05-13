const express = require('express')
const router = express.Router();
const {getAccessToken} = require("../services/auth");
const {userInvestment, userVault} = require("../controllers/vault");

router.get('/', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    return res.status(200).json(await userInvestment(session, req))
});

router.get('/all', async (req, res) => {
    const session = await getAccessToken(req)
    if (!session) return res.status(401).json({})

    return res.status(200).json(await userVault(session, req))
});


module.exports = {router}
