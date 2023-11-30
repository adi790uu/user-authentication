import UserService from '../services/UserService'
import { Request, Response, NextFunction } from 'express'

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response<any, Record<string, any>>> => {
  try {
    const header = req.headers.authorization

    if (!header) {
      return res.status(401).json({ error: 'Authorization header missing' })
    }

    const token = header.split(' ')[1]

    const { id }: any = UserService.decodeJWTToken(token)

    //@ts-ignore
    req.user = id

    next()
  } catch (error) {
    console.error('Token validation error:', error)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export default validateToken
