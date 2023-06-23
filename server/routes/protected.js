const express = require('express')
const router = express.Router();
const {logIn, logOut, refreshToken} = require("../controllers/login");
const {verifyID} = require("../../src/lib/authHelpers");

//GET USER DATA
router.get('/route', async (req, res) => {
    const {auth, user} = await verifyID(req)
    console.log("PROTECTED", auth, user)
    if(!auth)  return res.status(401).json({});

    return res.status(200).json({...user});
});

module.exports = {router}
