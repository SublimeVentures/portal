const express = require("express");
const router = express.Router();
const { getPublicPartners } = require("../queries/partners.query");
const { getOffersPublic } = require("../queries/offers.query");
const { getNeoTokyoEnvs } = require("../queries/neoTokyo.query");
const { getCyberKongzEnvs } = require("../queries/kongz.query");

router.get("/investments", async (req, res) => {
    return res.status(200).json(await getOffersPublic());
});
router.get("/partners", async (req, res) => {
    return res.status(200).json(await getPublicPartners());
});
router.get("/nt-calculator", async (req, res) => {
    return res.status(200).json(await getNeoTokyoEnvs());
});
router.get("/kongz-calculator", async (req, res) => {
    return res.status(200).json(await getCyberKongzEnvs());
});

module.exports = { router };
