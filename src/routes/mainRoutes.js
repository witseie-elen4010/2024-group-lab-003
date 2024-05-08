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

// Draw Page
router.get('/drawing', (req, res) => {
  res.sendFile(path.join(viewsPath, 'drawing.html'))
})

// Waiting Room Page
router.get('/waitingRoom', (req, res) => {
  res.sendFile(path.join(viewsPath, 'waitingRoom.html'))
})

// Description Page
router.get('/description', (req, res) => {
  res.sendFile(path.join(viewsPath, 'description.html'))
})

router.get('/gameOver', (req, res) => {
  res.sendFile(path.join(viewsPath, 'gameOver.html'))
})

router.get('/logs', (req, res) => {
  res.sendFile(path.join(viewsPath, 'logs.html'))
})

module.exports = router
