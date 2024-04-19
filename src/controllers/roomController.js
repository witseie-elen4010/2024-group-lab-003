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
