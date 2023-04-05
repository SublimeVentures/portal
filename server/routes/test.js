import { Router } from'express';
// import {getSocket} from "../services/socket";
const router = Router()
// Test route
router.get('/test', (req, res) => {
  // getSocket().emit("msg", "dupa")
  res.status(200).json({aaa:"22"})
})

module.exports = router
