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
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    // Use the comparison operator '<' instead of assignment '='
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
      code: roomCode,
      hasStarted: false
    })
    console.log(roomCode) // Now this should log the actual room code string
    await newRoom.save()

    // Create a room player linking the user, room, and nickname
    const newRoomPlayer = new RoomPlayer({
      room: newRoom._id,
      user: newUser._id,
      nickname,
      isAdmin: true
    })
    await newRoomPlayer.save()

    // Send roomCode, message, and newUser._id in the response
    res
      .status(201)
      .send({
        roomCode: newRoom.code,
        userId: newUser._id,
        message: 'Room created successfully!'
      })
  } catch (error) {
    console.log(error) // Log the full error for better debugging
    res
      .status(500)
      .send({ message: 'Error creating room', error: error.toString() })
  }
}

async function joinRoom (req, res) {
  const { email, password, roomCode, nickname } = req.body
  try {
    const room = await Room.findOne({ code: roomCode })
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: 'Room not found' })
    }

    let user = await User.findOne({ email })
    if (!user) {
      user = new User({ email, passwordHash: password }) // Assuming password is hashed prior
      await user.save()
    }

    const newRoomPlayer = new RoomPlayer({
      room: room._id,
      user: user._id,
      nickname,
      isAdmin: false
    })

    await newRoomPlayer.save()
    res.json({
      success: true,
      message: `User ${nickname} joined room ${roomCode}`,
      userId: user._id // Include user ID in the response
    })
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

    res.json({
      success: true,
      players: players.map((p) => ({
        nickname: p.nickname,
        email: p.user.email
      }))
    })
  } catch (error) {
    console.error('Error fetching room players:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

async function getRoomIdByCode (req, res) {
  const { code } = req.params // Assuming you're passing the room code as a URL parameter
  try {
    const room = await Room.findOne({ code })
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: 'Room not found' })
    }
    res.json({ success: true, roomId: room._id })
  } catch (error) {
    console.error('Error finding room by code:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

async function isUserAdmin (req, res) {
  const { roomId, userId } = req.params // Adjusted to camelCase

  try {
    const roomPlayer = await RoomPlayer.findOne({
      room: roomId,
      user: userId
    }).exec()

    if (!roomPlayer) {
      return res
        .status(404)
        .json({ success: false, message: 'No matching room player found.' })
    }

    res.json({ success: true, isAdmin: roomPlayer.isAdmin })
  } catch (error) {
    console.error('Error checking admin status:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function startRoom (req, res) {
  const { roomId } = req.params // Extract the roomId from request parameters
  try {
    // Update the room to set hasStarted to true
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $set: { hasStarted: true } },
      { new: true, runValidators: true } // Options to return the updated object and run schema validators
    )

    if (!updatedRoom) {
      return res
        .status(404)
        .json({ success: false, message: 'Room not found' })
    }

    res.json({
      success: true,
      message: 'Room started successfully',
      room: updatedRoom
    })
  } catch (error) {
    console.error('Error starting room:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function checkRoomStarted (req, res) {
  const { roomId } = req.params // Assuming the room ID is passed as a URL parameter

  try {
    const room = await Room.findById(roomId).exec() // Using exec() for cleaner promise handling

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: 'Room not found' })
    }

    res.json({ success: true, hasStarted: room.hasStarted })
  } catch (error) {
    console.error('Error fetching room started status:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Function to remove a player from a room by user ID
async function removePlayerFromRoomByID (req, res) {
  const { userID, roomID } = req.params // Extract the user ID from request parameters

  try {
    // Find the RoomPlayer by user ID and remove it
    const removePlayer = await RoomPlayer.findOneAndDelete({ user: userID, room: roomID })

    if (!removePlayer) {
      return res.status(404).json({ success: false, message: 'Room Player not found' })
    }

    // Respond with success
    res.json({
      success: true,
      message: 'Player removed'
    })
  } catch (error) {
    console.error('Error Removing Player:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Function to remove a player from a room by nickname
async function removePlayerFromRoomByNickname (req, res) {
  const { userNickname, roomID } = req.params // Extract the user nickname from request parameters

  try {
    // Find the RoomPlayer by user ID and remove it
    const removePlayer = await RoomPlayer.findOneAndDelete({ nickname: userNickname, room: roomID })

    if (!removePlayer) {
      return res.status(404).json({ success: false, message: 'Room Player not found' })
    }

    // Respond with success
    res.json({
      success: true,
      message: 'Player removed'
    })
  } catch (error) {
    console.error('Error Removing Player:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function userIsInRoom (req, res) {
  const { userID, roomID } = req.params // Assuming the room ID and userID are passed as URL parameters

  try {
    // Attempt to find the room based on roomID
    const room = await Room.findById(roomID).exec() // Using findById to locate the room
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' })
    }

    // Check if the user is in the room
    const foundPlayer = await RoomPlayer.findOne({ user: userID, room: roomID }).exec() // Using findOne to get a single document
    if (!foundPlayer) {
      return res.json({ success: true, inRoom: false, message: 'Player not found in the room' }) // Player not in the room is not an error
    }

    // If the player is found, respond with the room's status and that the player is in the room
    res.json({ success: true, inRoom: true, hasStarted: room.hasStarted })
  } catch (error) {
    console.error('Error fetching room or player status:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

module.exports = {
  getRoomPlayers,
  joinRoom,
  createRoom,
  getRoomIdByCode,
  isUserAdmin,
  startRoom,
  checkRoomStarted,
  removePlayerFromRoomByID,
  removePlayerFromRoomByNickname,
  userIsInRoom
}
