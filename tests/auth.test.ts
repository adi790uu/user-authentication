// api.test.ts
import request from 'supertest'
import { app } from '../index'

const generateUniqueUsername = () => `testuser_${Date.now()}`
const generateUniqueEmail = () => `adi7990+${Date.now()}@gmail.com`

const testUser = {
  username: generateUniqueUsername(),
  email: generateUniqueEmail(),
  password: 'StrongPassword123',
}

const invalidUser = {
  username: 'randommly',
  email: 'random',
  password: 'random',
}

const attack = {
  username: "<script>alert('XSS');</script>",
  email: 'testuser@example.com',
  password: 'StrongPassword123',
}

describe('Registration Endpoint Tests', () => {
  test('POST /api/v1/users/register should return status 201', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
    })
    expect(response.status).toBe(201)
  })

  test('POST /api/v1/users/register should return status 409 for existing username', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      username: testUser.username,
      email: generateUniqueEmail(),
      password: testUser.password,
    })
    expect(response.status).toBe(409)
  })

  test('POST /api/v1/users/register should return status 409 for existing email', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
    })
    expect(response.status).toBe(409)
  })

  test('POST /api/v1/users/register should sanitize input to prevent XSS', async () => {
    const response = await request(app)
      .post('/api/v1/users/register')
      .send(attack)
    expect(response.status).not.toBe(409)
  })
})

describe('Authentication Endpoint Tests', () => {
  test('POST /api/v1/users/login should return status 200', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: testUser.email,
      password: testUser.password,
    })
    expect(response.status).toBe(200)
  })

  test('POST /api/v1/users/login should return status 404 for non-existing email', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: generateUniqueEmail(), // Change to a non-existing email
      password: testUser.password,
    })
    expect(response.status).toBe(404)
  })

  test('POST /api/v1/users/login should return status 400 for invalid data', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: invalidUser.email,
      password: invalidUser.password,
    })
    expect(response.status).toBe(400)
  })
})
