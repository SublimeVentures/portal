import { Router } from'express';
import {getOffersPublic} from "../queries/offer";
import {getPartners} from "../queries/partner";
const router = Router()

router.get('/public/investments', async (req, res) => {
  res.status(200).json(await getOffersPublic())
})

router.get('/public/partners', async (req, res) => {
  res.status(200).json(await getPartners())
})

module.exports = router
