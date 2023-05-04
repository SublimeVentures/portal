const express = require('express')
const router = express.Router();
const {login} = require("../controllers/login");
const {checkSelfCall} = require("../services/auth");

router.get('/l0gin/:address', async (req, res) => {
  const session = await checkSelfCall(req.headers)
  if (!session) return res.status(401).json({})

  res.status(200).json(await login(req.params.address))
});

module.exports = { router }
