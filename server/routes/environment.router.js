const express = require('express')
const router = express.Router();
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const {envCache} = require("../controllers/envionment");
const axios = require("axios");
const {verifyID} = require("../../src/lib/authHelpers");

//GET USER ENVIRONMENT DATA
router.get('/', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});

    try {
        const environment = envCache.get(`${user.tenantId}:${user.partnerId}`)

        if(!environment?.otcFee) {
            return await refreshPartnerEnvironment(user, res)
        }

        return res.status(200).json({...environment});
    } catch (error) {
        logger.error(`ERROR :: GET ENV DATA`, {error: serializeError(error)});
        return res.status(401).json({});
    }
});

async function refreshPartnerEnvironment (user, res) {
    try {
        const environment = await axios.post(`${process.env.AUTHER}/environment/partner_refresh`, {partnerId: user.partnerId, tenantId: user.tenantId}, {
            headers: {
                'content-type': 'application/json'
            }
        });
        const result = environment.data
        if (!result?.otcFee) return res.status(401).json({});

        return res.status(200).json({...result});
    } catch (error) {
        logger.error(`ERROR :: GET ENV DATA`, {error: serializeError(error)});
        return res.status(401).json({});
    }
}


module.exports = {router}
