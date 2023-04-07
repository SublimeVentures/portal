const express = require('express')
const router = express.Router();
const {getOffersPublic} = require("../queries/offer");
const {getPartners} = require("../queries/partner");

router.get('/investments', async (req, res) => {
  res.status(200).json(await getOffersPublic())

});

router.get('/partners', async (req, res) => {
  res.status(200).json(await getPartners())
})

module.exports = { router }
