import { Request, Response } from 'express'
import UserService from '../services/UserService'
import { z, ZodError } from 'zod'

const createUserPayloadSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
})

const loginUserPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const registerUser = async (req: Request, res: Response) => {
  try {
    const payload = createUserPayloadSchema.parse(req.body)
    const data = await UserService.createUser(payload)

    if (data) {
      return res.status(201).json({ success: true, data: data })
    }
  } catch (error: any) {
    if (error.message === 'User already exists' || 'Username already in use!') {
      return res.status(409).json({ success: false, msg: error.message })
    } else if (error instanceof ZodError) {
      return res.status(400).json({ success: false, msg: 'Invalid input data' })
    } else {
      return res
        .status(500)
        .json({ success: false, msg: 'Internal Server Error' })
    }
  }
}

export const authUser = async (req: Request, res: Response) => {
  try {
    const payload = loginUserPayloadSchema.parse(req.body)
    const data = await UserService.loginUser(payload)

    if (data) {
      return res
        .status(200)
        .json({ success: true, msg: 'User logged in', data: data })
    }
  } catch (error: any) {
    if (error.message === 'user not found') {
      return res.status(404).json({ success: false, msg: 'User not found' })
    } else if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ success: false, msg: 'Invalid credentials' })
    } else {
      return res
        .status(500)
        .json({ success: false, msg: 'Internal Server Error' })
    }
  }
}

// export const getUser = async (req: Request, res: Response) => {
//   const userId = req.user
//   const keyword = req.query.keyword
//   let user

//   if (keyword) {
//     user = await User.findById(keyword)
//       .populate('likes')
//       .populate('favorites')
//       .populate('postsCreated')
//   } else {
//     user = await User.findById(userId)
//       .populate('likes')
//       .populate('favorites')
//       .populate('postsCreated')
//   }

//   if (user) {
//     return res.json({ msg: 'Success', user: user })
//   }

//   res.json({ msg: 'Failed' })
// }
