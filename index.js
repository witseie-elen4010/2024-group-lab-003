const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
const roomRoutes = require('./src/routes/dbRoutes.js')
const path = require('path')
const logger = require('morgan')
const http = require('http')
const ejs = require('ejs')

const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use('/api', roomRoutes)

// Import the routes from the mainRoutes.js file located in the src/routes directory
const routes = require('./src/routes/mainRoutes.js')
const { auth, requiresAuth } = require('express-openid-connect')

app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs')

// Serve static files from the 'public' directory (change if your static files are in a different directory)
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

const PORT = process.env.PORT || 3000

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'Je-6qVCAR7EXrmwYjRVBnU9hwEIdLdMjekpszWscnXCBC1HOfXDhpv4vvWzZdYlI',
  baseURL: process.env.BASE_URL || `http://localhost:${PORT}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
}

// The `auth` router attaches /login, /logout
// and /callback routes to the baseURL
app.use(auth(config))

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user
  next()
})

// Use the routes defined in mainRoutes.js
app.use('/', routes)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})
// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err))

app.post('/verify-password', (req, res) => {
  const { password } = req.body

  if (password === process.env.ADMIN) {
    res.sendStatus(200) // OK
  } else {
    res.sendStatus(401) // Unauthorized
  }
})

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
