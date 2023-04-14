const express = require('express')
const router = express.Router();
const {getOfferList, getOfferDetails} = require("../queries/offer");
const {getEnv} = require("../services/mongo");

router.get('/', async (req, res) => {
  //todo: has to be logged in
  res.status(200).json(await getOfferList())
});

router.get('/:slug', async (req, res) => {
  //todo: has to be logged in
  const offer = await getOfferDetails(req.params.slug);
  const offerData = {...offer._doc, ...{
      alloFilled: 90000,
      alloMy:35000,
      research: getEnv().research
  }}
  console.log("offer", offerData)
  res.status(200).json(offerData)
});


module.exports = { router }
