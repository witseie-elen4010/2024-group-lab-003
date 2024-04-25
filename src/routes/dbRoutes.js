const express = require('express')
const router = express.Router()

const { createRoom } = require('../controllers/roomController')
const { joinRoom } = require('../controllers/roomController')
const { getRoomPlayers } = require('../controllers/roomController')
const { getRoomIdByCode } = require('../controllers/roomController')
const { isUserAdmin } = require('../controllers/roomController')
const { startRoom } = require('../controllers/roomController')
const { checkRoomStarted } = require('../controllers/roomController')
const { removePlayerFromRoomByID } = require('../controllers/roomController')

router.post('/create-room', createRoom)
router.post('/join-room', joinRoom)
router.get('/get-room-players', getRoomPlayers)
router.get('/get-room-id/:code', getRoomIdByCode)
router.get('/is-user-admin/:roomId/:userId', isUserAdmin)
router.post('/start-room/:roomId', startRoom)
router.get('/check-room-started/:roomId', checkRoomStarted)
router.post('/remove-player-from-room-by-user-id/:userID', removePlayerFromRoomByID)

module.exports = router
