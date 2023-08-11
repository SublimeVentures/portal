const express = require('express')
const router = express.Router();
const {claim} = require("../controllers/mysterybox");
const {verifyID} = require("../../src/lib/authHelpers");

router.get('/claim', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});

    return res.status(200).json(await claim(user))
});



module.exports = {router}
