const { Room, RoomPlayer, User } = require('../services/dbSchema')

async function generateRoomCode () {
  let roomCode
  let isUnique = false
  do {
    roomCode = generateRandomCode()
    const existingRoom = await Room.findOne({ code: roomCode })
    isUnique = !existingRoom
  } while (!isUnique)
  return roomCode
}

function generateRandomCode () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) { // Use the comparison operator '<' instead of assignment '='
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

async function createRoom (req, res) {
  const { email, password, nickname } = req.body
  try {
    // Create user
    const newUser = new User({ email, passwordHash: password }) // Ensure password hashing in practice
    await newUser.save()

    // Generate a unique room code
    const roomCode = await generateRoomCode() // Properly await the room code
    const newRoom = new Room({
      code: roomCode
    })
    console.log(roomCode) // Now this should log the actual room code string
    await newRoom.save()

    // Create a room player linking the user, room, and nickname
    const newRoomPlayer = new RoomPlayer({
      room: newRoom._id,
      user: newUser._id,
      nickname
    })
    await newRoomPlayer.save()

    res.status(201).send({ roomCode: newRoom.code, message: 'Room created successfully!' })
  } catch (error) {
    console.log(error) // Log the full error for better debugging
    res.status(500).send({ message: 'Error creating room', error: error.toString() })
  }
}

async function joinRoom (req, res) {
  const { email, password, roomCode, nickname } = req.body
  try {
    const room = await Room.findOne({ code: roomCode })
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' })
    }

    let user = await User.findOne({ email })
    if (!user) {
      user = new User({ email, passwordHash: password }) // Assuming password is hashed prior
      await user.save()
    }

    const newRoomPlayer = new RoomPlayer({
      room: room._id,
      user: user._id,
      nickname
    })

    await newRoomPlayer.save()
    res.json({ success: true, message: `User ${nickname} joined room ${roomCode}` })
  } catch (error) {
    console.error('Error joining room:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

async function getRoomPlayers (req, res) {
  const { code } = req.query
  try {
    // First, find the room to ensure it exists
    const room = await Room.findOne({ code })
    if (!room) {
      console.log('No room found for code:', code)
      res.status(404).json({ success: false, message: 'Room not found' })
      return
    }
    // Then, fetch all players associated with this room
    const players = await RoomPlayer.find({ room: room._id }).populate('user')

    res.json({ success: true, players: players.map(p => ({ nickname: p.nickname, email: p.user.email })) })
  } catch (error) {
    console.error('Error fetching room players:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

module.exports = {
  getRoomPlayers,
  joinRoom,
  createRoom
}
