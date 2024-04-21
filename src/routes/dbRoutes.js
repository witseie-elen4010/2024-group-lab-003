const express = require('express')
const router = express.Router()

const { createRoom } = require('../controllers/roomController')
const { joinRoom } = require('../controllers/roomController')
const { getRoomPlayers } = require('../controllers/roomController')
const { getRoomIdByCode } = require('../controllers/roomController')
const { isUserAdmin } = require('../controllers/roomController')

router.post('/create-room', createRoom)
router.post('/join-room', joinRoom)
router.get('/get-room-players', getRoomPlayers)
router.get('/get-room-id/:code', getRoomIdByCode)
router.get('/is-user-admin/:roomId/:userId', isUserAdmin)

module.exports = router
