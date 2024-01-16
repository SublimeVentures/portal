const express = require('express')
const router = express.Router();
const {verifyID} = require("../../src/lib/authHelpers");
const {getUserWallets, addUserWallet, removeUserWallet, refreshStaking} = require("../controllers/wallets");

router.get('/wallets', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});

    res.status(200).json(await getUserWallets(user))
});


router.post('/wallets/:operation', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});


    let result

    if(req.params.operation === 'add') {
        result = await addUserWallet(user, req)
    } else if(req.params.operation === 'remove') {
        result = await removeUserWallet(user, req)
    } else {
       return res.status(200).json({})
    }

    if(result.ok) {
        const cookies = [result.cookie.refreshCookie, result.cookie.accessCookie]
        res.setHeader("Set-Cookie", cookies);
        delete result.data.user;
        delete result.token
        delete result.cookie
    }
    return res.status(200).json(result)
});

router.post('/stake', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if(!auth)  return res.status(401).json({});
    console.log("wallets",user)
    const isUserWallet = user.wallets.find(el=> el=== req.body.address)
    if(!isUserWallet) return res.status(400).json({});

    const result = await refreshStaking(req, isUserWallet)

    if(result.ok) {
        const cookies = [result.cookie.refreshCookie, result.cookie.accessCookie]
        res.setHeader("Set-Cookie", cookies);
        delete result.data.user;
        delete result.token
        delete result.cookie
    }
    return res.status(200).json(result)
});




module.exports = {router}
