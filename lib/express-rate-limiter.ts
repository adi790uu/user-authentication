//@ts-ignore
import rateLimit from 'express-rate-limit'
import { Request, Response } from 'express'

const customRateLimitHandler = (req: Request, res: Response) => {
  return res.status(429).json({
    status: 'error',
    message: 'You have exceeded the rate limit for this endpoint.',
    data: null,
  })
}

export const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 10,
  handler: customRateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
})
