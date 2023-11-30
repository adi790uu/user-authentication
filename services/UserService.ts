import { db } from '../lib/db'
import { createHmac, randomBytes } from 'node:crypto'
import JWT from 'jsonwebtoken'
const SECRET = 'TRabdom2ejed'

export interface CreateUserPayload {
  username: string
  email: string
  password: string
}

export interface LoginUserPayload {
  email: string
  password: string
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac('sha256', salt)
      .update(password)
      .digest('hex')
    return hashedPassword
  }

  public static async createUser(payload: CreateUserPayload) {
    const { username, email, password } = payload

    const existingUser = await UserService.getUserByEmail(email)

    if (existingUser) {
      throw new Error('User already exists')
    }

    const userNameNotAvailable = await UserService.getUserByUsername(username)

    if (userNameNotAvailable) {
      throw new Error('Username already in use!')
    }

    const salt = randomBytes(32).toString('hex')
    const hashedPassword = UserService.generateHash(salt, password)

    const newUser = await db.user.create({
      data: {
        email,
        username,
        salt,
        password: hashedPassword,
      },
    })

    if (newUser) {
      const token = JWT.sign({ id: newUser.id, email: newUser.email }, SECRET)
      const data = {
        token: token,
      }
      return data
    }
  }

  private static getUserByEmail(email: string) {
    return db.user.findUnique({ where: { email } })
  }

  private static getUserByUsername(username: string) {
    return db.user.findUnique({ where: { username } })
  }

  public static async loginUser(payload: LoginUserPayload) {
    const { email, password } = payload
    const user = await UserService.getUserByEmail(email)

    if (!user) throw new Error('user not found')

    const userSalt = user.salt
    const usersHashPassword = UserService.generateHash(userSalt, password)

    if (usersHashPassword !== user.password)
      throw new Error('Incorrect Password')

    const token = JWT.sign({ id: user.id, email: user.email }, SECRET)
    const data = {
      token: token,
    }
    return data
  }

  public static decodeJWTToken(token: string) {
    return JWT.verify(token, SECRET)
  }
}

export default UserService
