import xss, { FilterXSS } from 'xss'
import { Request, Response, NextFunction } from 'express'

const xssFilter = new FilterXSS({})

const sanitizeRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      req.body[key] = xssFilter.process(req.body[key] as string) as string
    })
  }
  next()
}

export default sanitizeRequestBody
