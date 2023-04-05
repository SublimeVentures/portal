import express from 'express';
const router = express.Router();
import {getOffersPublic} from "../queries/offer";
import {getPartners} from "../queries/partner";

router.get('/investments', async (req, res) => {
  res.status(200).json(await getOffersPublic())

});

router.get('/partners', async (req, res) => {
  res.status(200).json(await getPartners())
})

export default router;
