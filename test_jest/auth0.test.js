// tests/integration/profile.test.js

const request = require('supertest')
const express = require('express')
const { auth } = require('express-openid-connect')

// Mock the Auth0 Middleware
jest.mock('express-openid-connect', () => ({
  auth: () => (req, res, next) => {
    req.oidc = {
      isAuthenticated: () => true,
      user: {
        name: 'testuser',
        email: 'testuser@example.com'
      }
    }
    next()
  },
  requiresAuth: () => (req, res, next) => next()
}))

const app = express()
app.use(express.json())

// Apply mocked auth middleware globally
app.use(auth({
  authRequired: false,
  auth0Logout: true,
  secret: 'a-random-secret',
  baseURL: 'http://localhost:3000',
  clientID: 'dummy-client-id',
  issuerBaseURL: 'https://dummy.auth0.com'
}))

// Define a protected route
app.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.status(200).json(req.oidc.user)
  } else {
    res.status(401).send('Not Authenticated')
  }
})

describe('GET /profile', () => {
  it('should return user info when authenticated', async () => {
    const response = await request(app).get('/profile')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      name: 'testuser',
      email: 'testuser@example.com'
    })
  })
})
