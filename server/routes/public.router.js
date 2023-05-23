const express = require('express')
const router = express.Router();
const {getPublicPartners} = require("../queries/partners.query");
const {getOffersPublic} = require("../queries/offers.query");

router.get('/investments', async (req, res) => {
  res.status(200).json(await getOffersPublic())
});

router.get('/partners', async (req, res) => {
  res.status(200).json(await getPublicPartners())
})

module.exports = { router }
