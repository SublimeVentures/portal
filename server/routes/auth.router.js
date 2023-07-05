const express = require('express')
const router = express.Router();
const {logIn, logOut, refreshToken} = require("../controllers/login");
const {verifyID} = require("../../src/lib/authHelpers");

//GET USER DATA
router.get('/login', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if (!auth) return res.status(401).json({});

    return res.status(200).json({...user});
});

//LOGIN USER
router.post('/login', async (req, res) => {
    if (!req.body?.message || !req.body?.signature) return res.status(400).json({});
    const result = await logIn(req)

    if (!result) return res.status(401).json({});

    res.setHeader("Set-Cookie", result.cookie);
    return res.status(200).json(result.data);
});

//REFRESH TOKEN
router.put('/login', async (req, res) => {
    const {auth, user} = await verifyID(req, true)
    if (!auth) return res.status(401).json({});

    const result = await refreshToken(user)
    if (!result) return res.status(403).json({});

    res.setHeader("Set-Cookie", result.cookie);
    return res.status(200).json(result.data);
});

//LOG OUT
router.delete('/login', async (req, res) => {
    const {auth, user} = await verifyID(req)
    if (!auth) return res.status(401).json({});

    const cookie = await logOut(user)
    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({logout: true});
});

module.exports = {router}
