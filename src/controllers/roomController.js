const { Room, RoomPlayer, User, Round, Texting, Drawing } = require('../services/dbSchema')

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
        id: p.user._id
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

// Create a function to set the number of rounds for a room
async function setNumRounds (req, res) {
  const { roomID, numRounds } = req.params // Extract the room ID and number of rounds from request parameters

  try {
    // Update the room to set the number of rounds
    const updatedRoom = await Room.findByIdAndUpdate(roomID, { $set: { numRounds } })

    if (!updatedRoom) {
      return res.status(404).json({ success: false, message: 'Room not found' })
    }

    // Respond with the updated room
    res.json({
      success: true,
      message: 'Number of rounds updated successfully',
      room: updatedRoom
    })
  } catch (error) {
    console.error('Error updating number of rounds:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Create a function to set the time for a room
async function setTimePerRound (req, res) {
  const { roomID, timePerRound } = req.params // Extract the room ID and time per round from request parameters

  try {
    // Update the room to set the time per round
    const updatedRoom = await Room.findByIdAndUpdate(roomID, { $set: { timePerRound } })

    if (!updatedRoom) {
      return res.status(404).json({ success: false, message: 'Room not found' })
    }

    // Respond with the updated room
    res.json({
      success: true,
      message: 'Time per round updated successfully',
      room: updatedRoom
    })
  } catch (error) {
    console.error('Error updating time per round:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function addRoundsToRoom (req, res) {
  const { roomID, numRounds } = req.params // Extract the room ID and number of rounds from request parameters

  try {
    // Check if the room exists before adding rounds
    const roomExists = await Room.findById(roomID)
    if (!roomExists) {
      return res.status(404).json({ success: false, message: 'Room not found' })
    }

    // Calculate total number of players in the room
    const totalNumberofPlayersInRoom = await RoomPlayer.countDocuments({ room: roomID })

    // Create and save each round to the database
    const roundIds = [] // Array to store the IDs of newly created rounds
    for (let i = 1; i <= numRounds; i++) {
      const newRound = new Round({
        room: roomID,
        roundNumber: i,
        numberPlayersReady: 0,
        totalPlayers: totalNumberofPlayersInRoom
      })
      await newRound.save()
      roundIds.push(newRound._id) // Add new round ID to the array
    }

    // Respond successfully after all rounds are added, including the IDs of the rounds
    res.json({
      success: true,
      message: 'Rounds added successfully',
      rounds: roundIds // Return the list of round IDs
    })
  } catch (error) {
    console.error('Error adding rounds:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function getRoundID (req, res) {
  const { roomID, roundNumber } = req.params // Extract the room ID and round number from request parameters

  try {
    // Find the round with the specified room ID and round number
    const round = await Round.findOne({ room: roomID, roundNumber }).select('_id')

    if (!round) {
      return res.status(404).json({ success: false, message: 'Round not found' })
    }

    // Respond with the round ID
    res.json({
      success: true,
      message: 'Round ID retrieved successfully',
      roundID: round._id
    })
  } catch (error) {
    console.error('Error retrieving round ID:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function insertBookEntries (req, res) {
  const { kingArthursRoundTable, roundIdList, userIDs } = req.body // Assuming these are passed in the request body

  try {
    // Check if the input arrays have appropriate lengths
    if (!roundIdList.length || !userIDs.length || !kingArthursRoundTable.length) {
      return res.status(400).json({ success: false, message: 'Invalid input data' })
    }

    const entries = []

    // Iterate over each round ID
    for (let i = 0; i < roundIdList.length; i++) {
      const roundID = roundIdList[i]
      const isEvenRound = (i % 2 === 1) // 0-based index: even index is odd round number

      for (let j = 0; j < userIDs.length; j++) {
        // Fetch the corresponding bookUser for the round using the column (user trajectory) for this round
        const bookUser = kingArthursRoundTable[i][j]
        const userID = userIDs[j]

        if (isEvenRound) {
        // Insert into Drawing schema for even rounds
          const newDrawing = new Drawing({
            round: roundID,
            bookUser,
            drawerUser: userID,
            imageData: '', // Left blank for later update
            textPrompt: undefined // Explicitly unset
          })
          entries.push(newDrawing.save())
        } else {
        // Insert into Texting schema for odd rounds
          const newTexting = new Texting({
            round: roundID,
            bookUser,
            textUser: userID,
            textData: '', // Left blank for later update
            imagePrompt: undefined // Explicitly unset
          })
          entries.push(newTexting.save())
        }
      }
    }

    // Wait for all entries to be saved
    await Promise.all(entries)

    res.json({
      success: true,
      message: 'Entries created successfully'
    })
  } catch (error) {
    console.error('Error creating book entries:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function getRoomRounds (req, res) {
  const { code } = req.query
  try {
    // First, find the room to ensure it exists
    const room = await Room.findOne({ code })
    if (!room) {
      console.log('No room found for code:', code)
      res.status(404).json({ success: false, message: 'Room not found' })
      return
    }

    // Then, fetch all rounds associated with this room
    const rounds = await Round.find({ room: room._id })

    res.json({
      success: true,
      rounds: rounds.map(round => ({
        id: round._id, // Map directly in the response
        bookUser: round.bookUser
      }))
    })
  } catch (error) {
    console.error('Error fetching rounds:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

async function addTextDescription (req, res) {
  const { userId, roundId, text } = req.params // Extract parameters

  try {
    // Create or update a texting document
    const updatedTexting = await Texting.findOneAndUpdate(
      { round: roundId, textUser: userId },
      { textData: text },
      { upsert: true, new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: 'Text description added successfully',
      texting: updatedTexting
    })
  } catch (error) {
    console.error('Error adding text description:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function getText (req, res) {
  const { roundId, bookUserId } = req.params // Assuming roundId and bookUserId are passed as URL parameters

  console.log(roundId)
  console.log(bookUserId)

  try {
    const textEntry = await Texting.findOne({
      round: roundId,
      bookUser: bookUserId
    }).exec() // Fetching the Texting document based on roundId and bookUserId

    console.log(textEntry.textData)
    console.log('')

    if (!textEntry) {
      return res
        .status(404)
        .json({ success: false, message: 'Text entry not found' })
    }

    res.json({ success: true, textData: textEntry.textData })
  } catch (error) {
    console.error('Error fetching text data:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function getBookUserIdFromDraw (req, res) {
  const { roundId, drawUserId } = req.params // Extract roundId and textUserId from request parameters

  console.log(roundId)
  console.log(drawUserId)

  try {
    // Find the Texting entry with the specified roundId and textUserId
    const drawingEntry = await Drawing.findOne({ round: roundId, drawerUser: drawUserId })

    console.log('Here')
    console.log(drawingEntry.bookUser)

    if (!drawingEntry) {
      return res.status(404).json({ success: false, message: 'Text entry not found' })
    }

    // Assuming bookUser is the intended output, though your schema indicates this might be from a different logic
    const bookUserId = drawingEntry.bookUser
    if (!bookUserId) {
      return res.status(404).json({ success: false, message: 'Book user not found for the provided IDs' })
    }

    // Respond with the bookUserId
    res.json({
      success: true,
      message: 'Book user ID retrieved successfully',
      bookUser: bookUserId
    })
  } catch (error) {
    console.error('Error retrieving book user ID:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function incrementPlayersReadyInRound (req, res) {
  const { roomId, roundNumber } = req.params // Extract the room ID and round number from request parameters

  try {
    // Find the round by roomID and roundNumber and atomically increment the numberPlayersReady field
    const updatedRound = await Round.findOneAndUpdate(
      { room: roomId, roundNumber }, // Condition to find the specific round
      { $inc: { numberPlayersReady: 1 } }, // Increment numberPlayersReady by 1
      { new: true } // Return the updated document
    )

    if (!updatedRound) {
      return res.status(404).json({ success: false, message: 'Round not found' })
    }

    // Respond successfully with the updated round information
    res.json({
      success: true,
      message: 'Player readiness incremented',
      round: updatedRound
    })
  } catch (error) {
    console.error('Error incrementing player readiness:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function checkAllPlayersReady (req, res) {
  const { roomId, roundNum } = req.params // Extract the room ID and round number from request parameters

  console.log(roomId)
  console.log(roundNum)

  try {
    // Find the round based on roomID and roundNumber
    const round = await Round.findOne({ room: roomId, roundNumber: roundNum })
    console.log(round.totalPlayers)
    if (!round) {
      return res.status(404).json({ success: false, message: 'Round not found' })
    }

    // Check if all players are ready
    if (round.numberPlayersReady === round.totalPlayers) {
      res.json({
        success: true,
        message: 'All players are ready',
        allReady: true
      })
    } else {
      res.json({
        success: true,
        message: 'Not all players are ready',
        allReady: false
      })
    }
  } catch (error) {
    console.error('Error checking player readiness:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

async function getPlayersByRoomId (req, res) {
  const roomId = req.params.roomId // Use req.params to access the room ID from the route
  console.log(`Room ID is ${roomId}`)
  try {
    // First, find the room to ensure it exists
    const roomExists = await Room.findById(roomId)
    if (!roomExists) {
      console.log('No room found for code:', roomId)
      res.status(404).json({ success: false, message: 'Room not found' })
      return
    }

    // Then, fetch all players associated with this room
    const players = await RoomPlayer.find({ room: roomId })
      .select('nickname isAdmin user') // Only select fields needed

    res.json({
      success: true,
      players: players.map(player => ({
        userId: player.user, // Access user ID directly
        nickname: player.nickname,
        isAdmin: player.isAdmin
      }))
    })
  } catch (error) {
    console.error('Error fetching room players:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

async function getRoomRoundsByRoomId (req, res) {
  const { roomId } = req.query
  try {
    // First, find the room to ensure it exists
    const room = await Room.findOne({ roomId })
    if (!room) {
      console.log('No room found for code:', roomId)
      res.status(404).json({ success: false, message: 'Room not found' })
      return
    }

    // Then, fetch all rounds associated with this room
    const rounds = await Round.find({ room: room._id })

    res.json({
      success: true,
      rounds: rounds.map(round => ({
        id: round._id, // Map directly in the response
        bookUser: round.bookUser
      }))
    })
  } catch (error) {
    console.error('Error fetching rounds:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

async function getFinalText (req, res) {
  const { roundId, bookUserId } = req.params
  console.log(`roundID: ${roundId}, bookUserId: ${bookUserId}`)
  try {
    const textEntry = await Texting.findOne({
      round: roundId,
      bookUser: bookUserId
    }).exec()

    if (!textEntry) {
      return res.status(404).json({ success: false, message: 'Text entry not found' })
    }

    res.json({ success: true, textData: textEntry.textData })
  } catch (error) {
    console.error('Error fetching text data:', error)
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
  userIsInRoom,
  setNumRounds,
  setTimePerRound,
  addRoundsToRoom,
  getRoundID,
  insertBookEntries,
  getRoomRounds,
  addTextDescription,
  getText,
  getBookUserIdFromDraw,
  incrementPlayersReadyInRound,
  checkAllPlayersReady,
  getPlayersByRoomId,
  getRoomRoundsByRoomId,
  getFinalText
}
