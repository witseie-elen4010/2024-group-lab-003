const express = require('express')
const router = express.Router()

const { createRoom } = require('../controllers/roomController')
const { joinRoom } = require('../controllers/roomController')
const { getRoomPlayers } = require('../controllers/roomController')

router.post('/create-room', createRoom)
router.post('/join-room', joinRoom)
router.get('/get-room-players', getRoomPlayers)

module.exports = router
