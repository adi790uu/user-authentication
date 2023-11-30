import { z } from 'zod'

export const createUserPayloadSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export const loginUserPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
