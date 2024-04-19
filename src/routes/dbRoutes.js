const express = require('express');
const router = express.Router();
const { joinRoom } = require('../controllers/roomController');

router.post('/join-room', joinRoom);

module.exports = router;
