const express = require('express')
const router = express.Router();
const {getStoreData} = require("../controllers/store");
const {verifyID} = require("../../src/lib/authHelpers");

router.get('/', async (req, res) => {
    const {auth} = await verifyID(req)
    if(!auth)  return res.status(401).json({});

    return res.status(200).json(await getStoreData())
});



module.exports = {router}
