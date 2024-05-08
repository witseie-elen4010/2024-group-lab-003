const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }) // Limit to 10MB

const { createRoom } = require('../controllers/roomController')
const { joinRoom } = require('../controllers/roomController')
const { getRoomPlayers } = require('../controllers/roomController')
const { getRoomIdByCode } = require('../controllers/roomController')
const { isUserAdmin } = require('../controllers/roomController')
const { startRoom } = require('../controllers/roomController')
const { checkRoomStarted } = require('../controllers/roomController')
const { removePlayerFromRoomByID } = require('../controllers/roomController')
const { removePlayerFromRoomByNickname } = require('../controllers/roomController')
const { userIsInRoom } = require('../controllers/roomController')
const { setNumRounds } = require('../controllers/roomController')
const { setTimePerRound } = require('../controllers/roomController')
const { addRoundsToRoom } = require('../controllers/roomController')
const { getRoundID } = require('../controllers/roomController')
const { insertBookEntries } = require('../controllers/roomController')
const { getRoomRounds } = require('../controllers/roomController')
const { addTextDescription } = require('../controllers/roomController')
const { getText } = require('../controllers/roomController')
const { getBookUserIdFromDraw } = require('../controllers/roomController')
const { incrementPlayersReadyInRound } = require('../controllers/roomController')
const { checkAllPlayersReady } = require('../controllers/roomController')
const { getPlayersByRoomId } = require('../controllers/roomController')
const { getRoomRoundsByRoomId } = require('../controllers/roomController')
const { getFinalText } = require('../controllers/roomController')
const { addImage } = require('../controllers/roomController')
const { getBookUserIdFromText } = require('../controllers/roomController')
const { getDrawing } = require('../controllers/roomController')

router.post('/create-room', createRoom)
router.post('/join-room', joinRoom)
router.get('/get-room-players', getRoomPlayers)
router.get('/get-room-id/:code', getRoomIdByCode)
router.get('/is-user-admin/:roomId/:userId', isUserAdmin)
router.post('/start-room/:roomId', startRoom)
router.get('/check-room-started/:roomId', checkRoomStarted)
router.post('/remove-player-from-room-by-user-id/:userID/:roomID', removePlayerFromRoomByID)
router.post('/remove-player-from-room-by-user-nickname/:userNickname/:roomID', removePlayerFromRoomByNickname)
router.get('/user-is-in-room/:roomID/:userID', userIsInRoom)
router.post('/set-num-rounds/:roomID/:numRounds', setNumRounds)
router.post('/set-time-per-round/:roomID/:timePerRound', setTimePerRound)
router.post('/add-round-objects/:roomID/:numRounds', addRoundsToRoom)
router.get('/get-round-id/:roomID/:roundNumber', getRoundID)
router.post('/add-all-texts-and-draws', insertBookEntries)
router.get('/get-room-rounds', getRoomRounds)
router.post('/add-description/:userId/:roundId/:text', addTextDescription)
router.get('/get-text/:roundId/:bookUserId', getText)
router.get('/get-user-book-id-from-draw/:roundId/:drawUserId', getBookUserIdFromDraw)
router.post('/increment-round-players/:roomId/:roundNumber', incrementPlayersReadyInRound)
router.get('/round-is-ready/:roomId/:roundNum', checkAllPlayersReady)
router.get('/get-users-by-room-id/:roomId', getPlayersByRoomId)
router.get('/get-room-rounds-by-room-id/:roomId', getRoomRoundsByRoomId)
router.get('/get-final-test/:roundId/:bookUserId', getFinalText)
router.get('/get-user-book-id-from-text/:roundId/:textUserId', getBookUserIdFromText)

router.post('/addImageToDrawing', upload.single('image'), addImage)
router.get('/get-drawing/:roundId/:bookUserId', getDrawing)

module.exports = router
