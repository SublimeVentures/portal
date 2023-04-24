const express = require('express')
const router = express.Router();
const {login} = require("../controllers/login");
const {getEnabledPartners} = require("../queries/partner");
const {checkSelfCall} = require("../services/auth");
const {upsertDelegation} = require("../queries/delegate");

router.get('/l0gin/:address', async (req, res) => {
  const session = await checkSelfCall(req.headers)
  if (!session) return res.status(401).json({})

  res.status(200).json(await login(req.params.address))

});

router.get('/partners', async (req, res) => {
  const session = await checkSelfCall(req.headers)
  if (!session) return res.status(401).json({})

  res.status(200).json(await getEnabledPartners())

});
router.get('/delegate', async (req, res) => {
  const session = await checkSelfCall(req.headers)
  if (!session) return res.status(401).json({})

  res.status(200).json(await upsertDelegation(req.body))

});


module.exports = { router }
