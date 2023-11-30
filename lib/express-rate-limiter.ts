//@ts-ignore
import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: 'You have exceeded the 100 requests in 24 hrs limit!',
  standardHeaders: true,
  legacyHeaders: false,
})
