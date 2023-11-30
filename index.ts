import express from 'express'
import cors from 'cors'
import sanitizeRequestBody from './middleware/xss'
// import { RateLimiter } from './middleware/redisRateLimiter'

export const app = express()

app.use(cors())
app.use(sanitizeRequestBody)
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ msg: 'Server working' })
})

app.use('/api/v1/users', require('./routes/UserRoutes'))

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
  })
}
