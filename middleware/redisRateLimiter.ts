import moment from 'moment'
import { Redis } from 'ioredis'
import { Request, Response, NextFunction } from 'express'

let redisClient: Redis | null = null

if (process.env.NODE_ENV !== 'test') {
  redisClient = new Redis()
  redisClient.on('error', (err: any) =>
    console.error('Redis Client Error', err),
  )
}

const WINDOW_SIZE_IN_HOURS = 1
const WINDOW_LOG_INTERVAL_IN_HOURS = 1
const MAX_WINDOW_REQUEST_COUNT = 5

const getCurrentTimestampInSeconds = (): number => moment().unix()

const getRequestLog = async (ip: string): Promise<Array<any> | null> => {
  if (!redisClient) {
    console.error('Redis client does not exist!')
    return null
  }

  const record = await redisClient.get(ip)
  return record ? JSON.parse(record) : null
}

const setRequestLog = async (ip: string, data: any): Promise<void> => {
  if (!redisClient) {
    console.error('Redis client does not exist!')
    return
  }

  await redisClient.set(ip, JSON.stringify(data))
}

export const RateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!redisClient) {
      console.error('Redis client does not exist!')
      return next()
    }
    const ip = req.ip as string
    const data = await getRequestLog(ip)

    console.log(data)

    if (!data) {
      const newRecord = [
        { requestTimeStamp: getCurrentTimestampInSeconds(), requestCount: 1 },
      ]
      await setRequestLog(ip, newRecord)
      return next()
    }

    const currentRequestTime = moment()

    const windowStartTimestamp = moment()
      .subtract(WINDOW_SIZE_IN_HOURS, 'hours')
      .unix()

    const requestsWithinWindow = data.filter(
      (entry) => entry.requestTimeStamp > windowStartTimestamp,
    )

    const totalWindowRequestsCount = requestsWithinWindow.reduce(
      (accumulator, entry) => accumulator + entry.requestCount,
      0,
    )

    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
      return res.status(429).send({
        error: `Too many requests!`,
      })
    }

    const lastRequestLog = data[data.length - 1]

    const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
      .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, 'hours')
      .unix()

    if (
      lastRequestLog.requestTimeStamp >
      potentialCurrentWindowIntervalStartTimeStamp
    ) {
      lastRequestLog.requestCount++
      data[data.length - 1] = lastRequestLog
    } else {
      data.push({
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      })
    }

    await setRequestLog(ip, data)
    next()
  } catch (error) {
    console.error('Rate Limiter Error', error)
    next()
  }
}

export default redisClient
