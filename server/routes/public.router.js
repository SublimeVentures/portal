const express = require('express')
const router = express.Router();
const {getPublicPartners} = require("../queries/partners.query");
const {getOffersPublic} = require("../queries/offers.query");
const {getNeoTokyoEnvs} = require("../queries/neoTokyo.query");

router.get('/investments', async (req, res) => {
  return res.status(200).json(await getOffersPublic())
});

router.get('/partners', async (req, res) => {
  return res.status(200).json(await getPublicPartners())
})
router.get('/nt-calculator', async (req, res) => {
  return res.status(200).json(await getNeoTokyoEnvs())
})

module.exports = { router }
