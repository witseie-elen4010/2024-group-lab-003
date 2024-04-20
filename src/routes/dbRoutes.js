const express = require('express')
const router = express.Router()

const { createRoom } = require('../controllers/roomController')
const { joinRoom } = require('../controllers/roomController');

router.post('/create-room', createRoom)
router.post('/join-room', joinRoom);

module.exports = router


