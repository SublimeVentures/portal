const express = require('express')
const router = express.Router();
const {login} = require("../controllers/login");
const {getEnabledPartners} = require("../queries/partner");

router.get('/l0gin/:address', async (req, res) => {
  //todo: write check / whitelist only server
  res.status(200).json(await login(req.params.address))

});

router.get('/partners', async (req, res) => {
  //todo: write check / whitelist only server
  res.status(200).json(await getEnabledPartners())

});


module.exports = { router }
