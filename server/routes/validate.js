const express = require('express')
const router = express.Router();
const {getPartners} = require("../queries/partner");
const {login} = require("../controllers/login");

router.get('/l0gin/:address', async (req, res) => {
  //todo: write check / whitelist only server

  res.status(200).json(await login(req.params.address))

});


module.exports = { router }
