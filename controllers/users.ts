import { Request, Response } from 'express'
import UserService from '../services/UserService'
import {
  createUserPayloadSchema,
  loginUserPayloadSchema,
} from '../lib/zod/user'

import { ZodError } from 'zod'

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

export const getLoggedUserDetails = async (req: Request, res: Response) => {
  //@ts-ignore
  const id: string = req.user

  try {
    const user = await UserService.getUserById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const data = {
      username: user.username,
      email: user.email,
    }
    res.status(200).json({ msg: 'Success', data: data })
  } catch (error) {
    console.error('Error fetching user details:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
