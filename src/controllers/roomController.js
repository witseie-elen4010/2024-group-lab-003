const { Room, User } = require('../services/dbSchema')

async function generateRoomCode () {
  let roomCode; let isUnique = false
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
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

async function createRoom (req, res) {
  let { username, isAdmin } = req.body
  try {
    let user = await User.findOne({ username })
    if (!user) {
      isAdmin = true
      user = new User({ username, isAdmin })
      await user.save()
    }

    const roomCode = await generateRoomCode()
    const newRoom = new Room({
      code: roomCode,
      users: [user._id]
    })

    await newRoom.save()
    res.status(201).send({ roomCode, message: 'Room created successfully!' })
  } catch (error) {
    res.status(500).send({ message: 'Error creating room', error: error.toString() })
  }
}

module.exports = {
  createRoom
}
const { User, Room } = require('../schemas/dbSchema');

// Function to join a room
async function joinRoom(req, res) {
    const { username, roomCode } = req.body;
    try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) {
            // Room not found, send success as false
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const user = new User({ username, isAdmin: false });
        await user.save();

        room.users.push(user);
        await room.save();

        // Send success as true for a successful room join
        res.json({ success: true, message: `User ${username} joined room ${roomCode}` });
    } catch (error) {
        console.error('Error joining room:', error);
        // Send success as false because an error occurred
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

// Function to check if a room exists
async function checkRoom(req, res) {
    const { roomCode } = req.body;
    try {
        const room = await Room.findOne({ code: roomCode });
        if (room) {
            res.json({ exists: true, message: 'Room exists' });
        } else {
            res.json({ exists: false, message: 'Room does not exist' });
        }
    } catch (error) {
        console.error('Error checking room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    joinRoom,
    checkRoom
};
