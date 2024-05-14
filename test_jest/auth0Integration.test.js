require('dotenv').config()

const fetch = require('node-fetch')

describe('Auth0 Login Integration Test', () => {
  it('should obtain a token for valid user credentials', async () => {
    const url = `${process.env.ISSUER_BASE_URL}/oauth/token`
    const payload = {
      grant_type: 'client_credentials', // This grant type requires HTTPS
      username: process.env.USER,
      password: process.env.PASSWORD,
      audience: process.env.AUDIENCE,
      client_id: process.env.AUTH_API_CLIENT_ID,
      client_secret: process.env.AUTH_API_SECRET
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to log in with status ${response.status}: ${errorData}`)
    }

    const data = await response.json()
    expect(data.access_token).toBeDefined()
    // expect(data.token_type).toBe('Bearer')
  })
})
