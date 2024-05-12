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

// require('dotenv').config()

// const fetch = require('node-fetch')

// describe('Auth0 Login Integration Test', () => {
//   it('should obtain a token for valid user credentials', async () => {
//     const url = `${process.env.ISSUER_BASE_URL}/oauth/token`
//     const payload = {
//       grant_type: 'client_credentials', // This grant type requires HTTPS
//       username: process.env.USER,
//       password: process.env.PASSWORD,
//       audience: process.env.AUDIENCE,
//       client_id: process.env.AUTH_API_CLIENT_ID,
//       client_secret: process.env.AUTH_API_SECRET
//     }
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     })

//     if (!response.ok) {
//       const errorData = await response.text()
//       throw new Error(`Failed to log in with status ${response.status}: ${errorData}`)
//     }

//     const data = await response.json()
//     expect(data.access_token).toBeDefined()
//     // expect(data.token_type).toBe('Bearer')
//   })
// })
