import express from 'express'
import cors from 'cors'
import sanitizeRequestBody from './middleware/xss'
import { RateLimiter } from './middleware/rateLimiter'

const app = express()

app.use(cors())
app.use(sanitizeRequestBody)
app.use(express.json())

app.use('/api/v1/users', require('./routes/UserRoutes'))

app.get('/test', RateLimiter, (req, res) => {
  console.log('test')
  res.json({ msg: 'test' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
