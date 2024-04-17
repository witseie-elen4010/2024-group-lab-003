const express = require('express')
const path = require('path')
const router = express.Router()

// The views are within the 'views' folder inside 'src'
// Adjust the path to go up one directory from the current one
const viewsPath = path.join(__dirname, '..', 'views')

// Landing Page
router.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'landingPage.html'))
})

// Create Page
router.get('/create', (req, res) => {
  res.sendFile(path.join(viewsPath, 'create.html'))
})

// Join Page
router.get('/join', (req, res) => {
  res.sendFile(path.join(viewsPath, 'join.html'))
})

module.exports = router
