const express = require('express')
const path = require('path')
const router = express.Router()
const { requiresAuth } = require('express-openid-connect')
// The views are within the 'views' folder inside 'src'
// Adjust the path to go up one directory from the current one
const viewsPath = path.join(__dirname, '..', 'views')

// // Landing Page
// router.get('/', (req, res) => {
//   res.sendFile(path.join(viewsPath, 'landingPage.ejs'))
// })
router.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // If user is logged in, redirect to a different page or show a dashboard
    res.render(path.join(viewsPath, 'landingPage'))
  } else {
    // If user is not logged in, redirect to the Auth0 login screen
    res.oidc.login({ returnTo: '/' })
  }
})
// Create Page
router.get('/create', (req, res) => {
  res.render(path.join(viewsPath, 'create'))
})

// Join Page
router.get('/join', (req, res) => {
  res.render(path.join(viewsPath, 'join'))
})

// Draw Page
router.get('/drawing', (req, res) => {
  res.sendFile(path.join(viewsPath, 'drawing.html'))
})

// Waiting Room Page
router.get('/waitingRoom', (req, res) => {
  res.render(path.join(viewsPath, 'waitingRoom'))
})

// Description Page
router.get('/description', (req, res) => {
  res.sendFile(path.join(viewsPath, 'description.html'))
})

router.get('/gameOver', (req, res) => {
  res.sendFile(path.join(viewsPath, 'gameOver.html'))
})

router.get('/logs', (req, res) => {
  res.render(path.join(viewsPath, 'logs'))
})

router.get('/', function (req, res, next) {
  res.render('/index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  })
})

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  })
})

module.exports = router
