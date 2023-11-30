import express from 'express'
import {
  registerUser,
  authUser,
  getLoggedUserDetails,
} from '../controllers/users'
import validateToken from '../middleware/isAuth'
import { RateLimiter } from '../middleware/rateLimiter'

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(authUser)

router.use(RateLimiter)
router.route('/getUser').get(validateToken, getLoggedUserDetails)

module.exports = router
