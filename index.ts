import express from 'express'
import cors from 'cors'
import sanitizeRequestBody from './middleware/xss'

const app = express()

app.use(cors())
app.use(sanitizeRequestBody)
app.use(express.json())

app.use('/api/v1/users', require('./routes/UserRoutes'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
