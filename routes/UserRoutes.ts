import express from 'express'
import {
  registerUser,
  authUser,
  getLoggedUserDetails,
} from '../controllers/users'
import validateToken from '../middleware/isAuth'
// import { RateLimiter } from '../middleware/redisRateLimiter'
import { limiter } from '../lib/express-rate-limiter'

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(authUser)

router.use(limiter)

router.route('/getUser').get(validateToken, getLoggedUserDetails)

module.exports = router
