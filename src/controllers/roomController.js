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
  const { email, password, nickname } = req.body;
  try {
    // Create user
    const newUser = new User({ email, passwordHash: password }); // Ensure password hashing in practice
    await newUser.save();

    // Generate a unique room code
    const roomCode = await generateRoomCode(); // Properly await the room code
    const newRoom = new Room({
      code: roomCode,
      hasStarted: false
    });
    console.log(roomCode); // Now this should log the actual room code string
    await newRoom.save();

    // Create a room player linking the user, room, and nickname
    const newRoomPlayer = new RoomPlayer({
      room: newRoom._id,
      user: newUser._id,
      nickname,
      isAdmin: true 
    });
    await newRoomPlayer.save();

    // Send roomCode, message, and newUser._id in the response
    res.status(201).send({ roomCode: newRoom.code, userId: newUser._id, message: 'Room created successfully!' });
  } catch (error) {
    console.log(error); // Log the full error for better debugging
    res.status(500).send({ message: 'Error creating room', error: error.toString() });
  }
}


async function joinRoom (req, res) {
  const { email, password, roomCode, nickname } = req.body;
  try {
    const room = await Room.findOne({ code: roomCode });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, passwordHash: password }); // Assuming password is hashed prior
      await user.save();
    }

    const newRoomPlayer = new RoomPlayer({
      room: room._id,
      user: user._id,
      nickname,
      isAdmin: false
    })

    await newRoomPlayer.save();
    res.json({ 
      success: true, 
      message: `User ${nickname} joined room ${roomCode}`,
      userId: user._id  // Include user ID in the response
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
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

async function getRoomIdByCode(req, res) {
  const { code } = req.params; // Assuming you're passing the room code as a URL parameter
  try {
    const room = await Room.findOne({ code: code });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, roomId: room._id });
  } catch (error) {
    console.error('Error finding room by code:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function isUserAdmin(req, res) {
  const { roomId, userId } = req.params; // Adjusted to camelCase

  try {
    const roomPlayer = await RoomPlayer.findOne({ room: roomId, user: userId }).exec();

    if (!roomPlayer) {
      return res.status(404).json({ success: false, message: 'No matching room player found.' });
    }

    res.json({ success: true, isAdmin: roomPlayer.isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


module.exports = {
  getRoomPlayers,
  joinRoom,
  createRoom,
  getRoomIdByCode,
  isUserAdmin
}
