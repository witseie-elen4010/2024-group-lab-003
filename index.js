const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
const roomRoutes = require('./src/routes/dbRoutes.js')

const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use('/api', roomRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err))

const PORT = process.env.PORT || 3000

app.post('/verify-password', (req, res) => {
  const { password } = req.body

  if (password === process.env.ADMIN) {
    res.sendStatus(200) // OK
  } else {
    res.sendStatus(401) // Unauthorized
  }
})

// Import the routes from the mainRoutes.js file located in the src/routes directory
const routes = require('./src/routes/mainRoutes.js')

// Serve static files from the 'public' directory (change if your static files are in a different directory)
app.use(express.static('public'))

// Use the routes defined in mainRoutes.js
app.use('/', routes)

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
