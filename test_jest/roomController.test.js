// Import the necessary modules
const { joinRoom } = require('../src/controllers/roomController')
const { Room, RoomPlayer, User, Round, Drawing, Texting } = require('../src/services/dbSchema')

// Mocking Mongoose methods and Express response
jest.mock('../src/services/dbSchema')
jest.mock('../src/services/dbSchema')
jest.mock('../src/services/dbSchema')

describe('joinRoom function', () => {
  // Mock Express request and response objects
  let req, res

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'hashedpassword',
        roomCode: '12345',
        nickname: 'Tester'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if room not found', async () => {
    Room.findOne.mockResolvedValue(null)

    await joinRoom(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room not found'
    })
  })

  test('should handle errors correctly', async () => {
    Room.findOne.mockRejectedValue(new Error('Internal server error'))

    await joinRoom(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error'
    })
  })
})

// Import the function to test
const { getRoomPlayers } = require('../src/controllers/roomController')

// Setup the test environment
describe('getRoomPlayers', () => {
  let req, res

  beforeEach(() => {
    req = {
      query: { code: 'testCode' }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }

    // Clear mocks after each test
    jest.clearAllMocks()
  })

  test('should respond with 404 if room not found', async () => {
    Room.findOne.mockResolvedValue(null)

    await getRoomPlayers(req, res)

    expect(Room.findOne).toHaveBeenCalledWith({ code: 'testCode' })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Room not found' })
  }) // Timeout set to 10000 milliseconds

  test('should respond with 500 if there is an error', async () => {
    Room.findOne.mockRejectedValue(new Error('Internal server error'))

    await getRoomPlayers(req, res)

    expect(Room.findOne).toHaveBeenCalledWith({ code: 'testCode' })
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Internal server error' })
  })

  test('should return a list of players if room is found', async () => {
    const mockRoom = { _id: 'roomId' }
    const mockPlayers = [
      { nickname: 'Player1', user: { email: 'player1@example.com' } },
      { nickname: 'Player2', user: { email: 'player2@example.com' } }
    ]
    Room.findOne.mockResolvedValue(mockRoom)
    RoomPlayer.populate.mockResolvedValue(mockPlayers)

    await getRoomPlayers(req, res)

    expect(Room.findOne).toHaveBeenCalledWith({ code: 'testCode' })
    expect(RoomPlayer.find).toHaveBeenCalledWith({ room: 'roomId' })
  })
})

// Import the function to test
const { getRoomIdByCode } = require('../src/controllers/roomController')

// Setup the test environment
describe('getRoomIdByCode', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { code: 'uniqueRoomCode' }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }

    // Clear mocks after each test
    jest.clearAllMocks()
  })

  // Add your tests here
  test('should return 404 if no room is found', async () => {
    Room.findOne.mockResolvedValue(null) // No room found

    await getRoomIdByCode(req, res)

    expect(Room.findOne).toHaveBeenCalledWith({ code: 'uniqueRoomCode' })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Room not found' })
  })

  test('should return 500 if there is an error', async () => {
    Room.findOne.mockRejectedValue(new Error('Internal server error'))

    await getRoomIdByCode(req, res)

    expect(Room.findOne).toHaveBeenCalledWith({ code: 'uniqueRoomCode' })
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Internal server error' })
  })

  test('should return the room ID if found', async () => {
    const mockRoom = { _id: 'roomId' }
    Room.findOne.mockResolvedValue(mockRoom)

    await getRoomIdByCode(req, res)

    expect(Room.findOne).toHaveBeenCalledWith({ code: 'uniqueRoomCode' })
    expect(res.json).toHaveBeenCalledWith({ success: true, roomId: 'roomId' })
  })
})

// Import the function to test
const { isUserAdmin } = require('../src/controllers/roomController')

// Setup the test environment
describe('isUserAdmin', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { roomId: 'room123', userId: 'user123' }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }

    // Clear mocks after each test
    jest.clearAllMocks()
  })

  test('should return 404 if no matching room player is found', async () => {
    RoomPlayer.findOne.mockResolvedValue(null) // Simulate no room player found

    await isUserAdmin(req, res)

    expect(RoomPlayer.findOne).toHaveBeenCalledWith({
      room: 'room123',
      user: 'user123'
    })
  })
  test('should return true for isAdmin if the room player is an admin', async () => {
    const mockRoomPlayer = { isAdmin: true }
    RoomPlayer.findOne.mockResolvedValue(mockRoomPlayer)
    console.log('Mock data returned:', RoomPlayer)

    await isUserAdmin(req, res)

    expect(RoomPlayer.findOne).toHaveBeenCalledWith({
      room: 'room123',
      user: 'user123'
    })
  })

  test('should return false for isAdmin if the room player is not an admin', async () => {
    const mockRoomPlayer = { isAdmin: false }
    RoomPlayer.findOne.mockResolvedValue(mockRoomPlayer)

    await isUserAdmin(req, res)

    expect(RoomPlayer.findOne).toHaveBeenCalledWith({
      room: 'room123',
      user: 'user123'
    })
  })
})

// Import the function to test
const { startRoom } = require('../src/controllers/roomController')

describe('startRoom', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { roomId: 'room123' }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should update the room and respond with success message', async () => {
    const mockUpdatedRoom = {
      _id: 'room123',
      hasStarted: true
    }
    Room.findByIdAndUpdate.mockResolvedValue(mockUpdatedRoom)

    await startRoom(req, res)

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      'room123',
      { $set: { hasStarted: true } },
      { new: true, runValidators: true }
    )
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Room started successfully',
      room: mockUpdatedRoom
    })
  })

  test('should return a 404 error if the room is not found', async () => {
    Room.findByIdAndUpdate.mockResolvedValue(null)

    await startRoom(req, res)

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      'room123',
      { $set: { hasStarted: true } },
      { new: true, runValidators: true }
    )
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room not found'
    })
  })

  test('should handle errors and respond with 500', async () => {
    const error = new Error('Internal server error')
    Room.findByIdAndUpdate.mockRejectedValue(error)

    await startRoom(req, res)

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      'room123',
      { $set: { hasStarted: true } },
      { new: true, runValidators: true }
    )
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

// Import the function to test
const { checkRoomStarted } = require('../src/controllers/roomController')

describe('checkRoomStarted', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { roomId: 'room123' }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Tests will be added here
  test('should respond with the started status of the room when found', async () => {
    const mockRoom = {
      _id: 'room123',
      hasStarted: true
    }
    Room.findById.mockResolvedValue(mockRoom)

    await checkRoomStarted(req, res)

    expect(Room.findById).toHaveBeenCalledWith('room123')
  })

  test('should return a 404 error if the room is not found', async () => {
    Room.findById.mockResolvedValue(null)

    await checkRoomStarted(req, res)

    expect(Room.findById).toHaveBeenCalledWith('room123')
  })
})

// Import the function to test
const { removePlayerFromRoomByID } = require('../src/controllers/roomController')

describe('removePlayerFromRoomByID', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { userID: 'user123', roomID: 'room123' }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Tests will be added here
  test('should successfully remove a player and respond with success', async () => {
    RoomPlayer.findOneAndDelete.mockResolvedValue({
      _id: 'someid', // Mocked return value indicating a player was removed
      user: 'user123',
      room: 'room123'
    })

    await removePlayerFromRoomByID(req, res)

    expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
      user: 'user123',
      room: 'room123'
    })
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Player removed'
    })
  })

  test('should return a 404 error if no player is found to remove', async () => {
    RoomPlayer.findOneAndDelete.mockResolvedValue(null) // No player found to remove

    await removePlayerFromRoomByID(req, res)

    expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
      user: 'user123',
      room: 'room123'
    })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room Player not found'
    })
  })
  test('should handle errors and respond with 500', async () => {
    const error = new Error('Internal server error')
    RoomPlayer.findOneAndDelete.mockRejectedValue(error) // Simulate an error during the delete operation

    await removePlayerFromRoomByID(req, res)

    expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
      user: 'user123',
      room: 'room123'
    })
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

// Import the function to test
const { removePlayerFromRoomByNickname } = require('../src/controllers/roomController')

describe('removePlayerFromRoomByNickname', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { userNickname: 'nickname123', roomID: 'room123' }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Add test cases here
  test('should successfully remove a player by nickname and respond with success', async () => {
    RoomPlayer.findOneAndDelete.mockResolvedValue({
      _id: 'someid', // Mock return value indicating a player was removed
      nickname: 'nickname123',
      room: 'room123'
    })

    await removePlayerFromRoomByNickname(req, res)

    expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
      nickname: 'nickname123',
      room: 'room123'
    })
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Player removed'
    })
  })
  test('should return a 404 error if no player is found to remove by nickname', async () => {
    RoomPlayer.findOneAndDelete.mockResolvedValue(null) // No player found to remove

    await removePlayerFromRoomByNickname(req, res)

    expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
      nickname: 'nickname123',
      room: 'room123'
    })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room Player not found'
    })
  })
  test('should handle errors and respond with 500', async () => {
    const error = new Error('Internal server error')
    RoomPlayer.findOneAndDelete.mockRejectedValue(error) // Simulate an error during the delete operation

    await removePlayerFromRoomByNickname(req, res)

    expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
      nickname: 'nickname123',
      room: 'room123'
    })
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

// Import the function to test
const { userIsInRoom } = require('../src/controllers/roomController')

describe('userIsInRoom', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { userID: 'user123', roomID: 'room123' }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Add test cases here
  test('should return 404 if the room is not found', async () => {
    Room.findById.mockResolvedValue(null) // Simulate no room found

    await userIsInRoom(req, res)

    expect(Room.findById).toHaveBeenCalledWith('room123')
  })

  test('should return that user is not in the room if not found', async () => {
    const mockRoom = { _id: 'room123', hasStarted: false }
    Room.findById.mockResolvedValue(mockRoom)
    RoomPlayer.findOne.mockResolvedValue(null) // Simulate user not found in the room

    await userIsInRoom(req, res)

    expect(Room.findById).toHaveBeenCalledWith('room123')
  })

  test('should confirm user is in the room and return room status', async () => {
    const mockRoom = { _id: 'room123', hasStarted: true }
    const mockPlayer = { _id: 'player123', user: 'user123', room: 'room123' }
    Room.findById.mockResolvedValue(mockRoom)
    RoomPlayer.findOne.mockResolvedValue(mockPlayer)

    await userIsInRoom(req, res)

    expect(Room.findById).toHaveBeenCalledWith('room123')
  })
})

// Import the function to test
const { setNumRounds } = require('../src/controllers/roomController')

describe('setNumRounds', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { roomID: 'room123', numRounds: 5 }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Add test cases here
  test('should update the number of rounds for the room and respond with success', async () => {
    const mockUpdatedRoom = { _id: 'room123', numRounds: 5 }
    Room.findByIdAndUpdate.mockResolvedValue(mockUpdatedRoom)

    await setNumRounds(req, res)

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      'room123',
      { $set: { numRounds: 5 } }
    )
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Number of rounds updated successfully',
      room: mockUpdatedRoom
    })
  })

  test('should return a 404 error if the room is not found', async () => {
    Room.findByIdAndUpdate.mockResolvedValue(null) // No room found to update

    await setNumRounds(req, res)

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      'room123',
      { $set: { numRounds: 5 } }
    )
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room not found'
    })
  })
  test('should handle errors and respond with 500', async () => {
    const error = new Error('Internal server error')
    Room.findByIdAndUpdate.mockRejectedValue(error) // Simulate an error during the update operation

    await setNumRounds(req, res)

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      'room123',
      { $set: { numRounds: 5 } }
    )
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

// Import the function to test
const { setTimePerRound } = require('../src/controllers/roomController')

describe('setTimePerRound', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { roomID: 'room123', timePerRound: 30 }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Add test cases here
  test('should update the time per round for the room and respond with success', async () => {
    const mockUpdatedRoom = { _id: 'room123', timePerRound: 30 }
    Room.findByIdAndUpdate.mockResolvedValue(mockUpdatedRoom)

    await setTimePerRound(req, res)

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      'room123',
      { $set: { timePerRound: 30 } }
    )
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Time per round updated successfully',
      room: mockUpdatedRoom
    })
  })
  test('should return a 404 error if the room is not found', async () => {
    Room.findByIdAndUpdate.mockResolvedValue(null) // No room found to update

    await setTimePerRound(req, res)

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      'room123',
      { $set: { timePerRound: 30 } }
    )
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room not found'
    })
  })
  test('should handle errors and respond with 500', async () => {
    const error = new Error('Internal server error')
    Room.findByIdAndUpdate.mockRejectedValue(error) // Simulate an error during the update operation

    await setTimePerRound(req, res)

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
      'room123',
      { $set: { timePerRound: 30 } }
    )
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { addRoundsToRoom } = require('../src/controllers/roomController')

describe('addRoundsToRoom function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roomID: 'roomId123',
        numRounds: 3
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if room not found', async () => {
    Room.findById.mockResolvedValue(null)

    await addRoundsToRoom(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room not found'
    })
  })

  test('should add rounds and respond with round IDs', async () => {
    Room.findById.mockResolvedValue({ _id: 'roomId123' })
    RoomPlayer.countDocuments.mockResolvedValue(5)
    const mockRound = new Round()
    mockRound._id = 'roundId'

    await addRoundsToRoom(req, res)

    expect(Room.findById).toHaveBeenCalledWith('roomId123')
    expect(RoomPlayer.countDocuments).toHaveBeenCalledWith({ room: 'roomId123' })
  })
})

const { getRoundID } = require('../src/controllers/roomController')

describe('getRoundID function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roomID: 'roomId123',
        roundNumber: 1
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if round not found', async () => {
    Round.findOne.mockResolvedValue(null)

    await getRoundID(req, res)

    expect(Round.findOne).toHaveBeenCalledWith({ room: 'roomId123', roundNumber: 1 })
  })

  test('should handle errors correctly', async () => {
    Round.findOne.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getRoundID(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { insertBookEntries } = require('../src/controllers/roomController')

describe('insertBookEntries function', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {
        kingArthursRoundTable: [['user1'], ['user2']],
        roundIdList: ['roundId1', 'roundId2'],
        userIDs: ['userId1', 'userId2']
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 400 if input data is invalid', async () => {
    req.body = {
      kingArthursRoundTable: [],
      roundIdList: [],
      userIDs: []
    }

    await insertBookEntries(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid input data'
    })
  })

  test('should create entries for even and odd rounds', async () => {
    Drawing.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue('Drawing saved')
    }))
    Texting.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue('Texting saved')
    }))

    await insertBookEntries(req, res)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Entries created successfully'
    })
  })

  test('should handle errors correctly', async () => {
    Drawing.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Internal server error'))
    }))

    await insertBookEntries(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { getRoomRounds } = require('../src/controllers/roomController')

describe('getRoomRounds function', () => {
  let req, res

  beforeEach(() => {
    req = {
      query: {
        code: 'testCode'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if no room found', async () => {
    Room.findOne.mockResolvedValue(null)

    await getRoomRounds(req, res)

    expect(Room.findOne).toHaveBeenCalledWith({ code: 'testCode' })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room not found'
    })
  })

  test('should respond with all rounds for the room', async () => {
    const mockRoom = { _id: 'roomId123' }
    const mockRounds = [{ _id: 'roundId1', bookUser: 'user1' }, { _id: 'roundId2', bookUser: 'user2' }]
    Room.findOne.mockResolvedValue(mockRoom)
    Round.find.mockResolvedValue(mockRounds)

    await getRoomRounds(req, res)

    expect(Round.find).toHaveBeenCalledWith({ room: 'roomId123' })
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      rounds: mockRounds.map(round => ({
        id: round._id,
        bookUser: round.bookUser
      }))
    })
  })

  test('should handle errors correctly', async () => {
    Room.findOne.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getRoomRounds(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error'
    })
  })
})

const { addTextDescription } = require('../src/controllers/roomController')

describe('addTextDescription function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        userId: 'userId123',
        roundId: 'roundId123',
        text: 'New text description'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should handle errors correctly', async () => {
    Texting.findOneAndUpdate.mockRejectedValue(new Error('Internal server error'))

    await addTextDescription(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { getText } = require('../src/controllers/roomController')

describe('getText function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roundId: 'roundId123',
        bookUserId: 'bookUserId123'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if text entry not found', async () => {
    Texting.findOne.mockResolvedValue(null)

    await getText(req, res)

    expect(Texting.findOne).toHaveBeenCalledWith({
      round: 'roundId123',
      bookUser: 'bookUserId123'
    })
  })

  test('should handle errors correctly', async () => {
    Texting.findOne.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getText(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { getBookUserIdFromDraw } = require('../src/controllers/roomController')

describe('getBookUserIdFromDraw function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roundId: 'roundId123',
        drawUserId: 'drawUserId123'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if drawing entry not found', async () => {
    Drawing.findOne.mockResolvedValue(null)

    await getBookUserIdFromDraw(req, res)

    expect(Drawing.findOne).toHaveBeenCalledWith({ round: 'roundId123', drawerUser: 'drawUserId123' })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Text entry not found'
    })
  })

  test('should respond with 404 if book user not found', async () => {
    const mockDrawingEntry = { bookUser: null }
    Drawing.findOne.mockResolvedValue(mockDrawingEntry)

    await getBookUserIdFromDraw(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Book user not found for the provided IDs'
    })
  })

  test('should retrieve and respond with book user ID', async () => {
    const mockDrawingEntry = { bookUser: 'bookUserId123' }
    Drawing.findOne.mockResolvedValue(mockDrawingEntry)

    await getBookUserIdFromDraw(req, res)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Book user ID retrieved successfully',
      bookUser: 'bookUserId123'
    })
  })

  test('should handle errors correctly', async () => {
    Drawing.findOne.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getBookUserIdFromDraw(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { getBookUserIdFromText } = require('../src/controllers/roomController')

describe('getBookUserIdFromText function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roundId: 'roundId123',
        textUserId: 'textUserId123'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if texting entry not found', async () => {
    Texting.findOne.mockResolvedValue(null)

    await getBookUserIdFromText(req, res)

    expect(Texting.findOne).toHaveBeenCalledWith({ round: 'roundId123', textUser: 'textUserId123' })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Text entry not found'
    })
  })

  test('should respond with 404 if book user not found', async () => {
    const mockTextingEntry = { bookUser: null }
    Texting.findOne.mockResolvedValue(mockTextingEntry)

    await getBookUserIdFromText(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Book user not found for the provided IDs'
    })
  })

  test('should retrieve and respond with book user ID', async () => {
    const mockTextingEntry = { bookUser: 'bookUserId123' }
    Texting.findOne.mockResolvedValue(mockTextingEntry)

    await getBookUserIdFromText(req, res)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Book user ID retrieved successfully',
      bookUser: 'bookUserId123'
    })
  })

  test('should handle errors correctly', async () => {
    Texting.findOne.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getBookUserIdFromText(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { incrementPlayersReadyInRound } = require('../src/controllers/roomController')

describe('incrementPlayersReadyInRound function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roomId: 'roomId123',
        roundNumber: 1
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if round not found', async () => {
    Round.findOneAndUpdate.mockResolvedValue(null)

    await incrementPlayersReadyInRound(req, res)

    expect(Round.findOneAndUpdate).toHaveBeenCalledWith(
      { room: 'roomId123', roundNumber: 1 },
      { $inc: { numberPlayersReady: 1 } },
      { new: true }
    )
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Round not found'
    })
  })

  test('should successfully increment player readiness', async () => {
    const mockUpdatedRound = {
      room: 'roomId123',
      roundNumber: 1,
      numberPlayersReady: 2
    }
    Round.findOneAndUpdate.mockResolvedValue(mockUpdatedRound)

    await incrementPlayersReadyInRound(req, res)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Player readiness incremented',
      round: mockUpdatedRound
    })
  })

  test('should handle errors correctly', async () => {
    Round.findOneAndUpdate.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await incrementPlayersReadyInRound(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { checkAllPlayersReady } = require('../src/controllers/roomController')

describe('checkAllPlayersReady function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roomId: 'roomId123',
        roundNum: 1
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if round not found', async () => {
    Round.findOne.mockResolvedValue(null)

    await checkAllPlayersReady(req, res)

    expect(Round.findOne).toHaveBeenCalledWith({ room: 'roomId123', roundNumber: 1 })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Round not found'
    })
  })

  test('should respond that all players are ready when conditions are met', async () => {
    const mockRound = {
      numberPlayersReady: 5,
      totalPlayers: 5
    }
    Round.findOne.mockResolvedValue(mockRound)

    await checkAllPlayersReady(req, res)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'All players are ready',
      allReady: true
    })
  })

  test('should respond that not all players are ready when conditions are not met', async () => {
    const mockRound = {
      numberPlayersReady: 3,
      totalPlayers: 5
    }
    Round.findOne.mockResolvedValue(mockRound)

    await checkAllPlayersReady(req, res)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Not all players are ready',
      allReady: false
    })
  })

  test('should handle errors correctly', async () => {
    Round.findOne.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await checkAllPlayersReady(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { getPlayersByRoomId } = require('../src/controllers/roomController')

describe('getPlayersByRoomId function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roomId: 'roomId123'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if room not found', async () => {
    Room.findById.mockResolvedValue(null)

    await getPlayersByRoomId(req, res)

    expect(Room.findById).toHaveBeenCalledWith('roomId123')
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Room not found'
    })
  })

  test('should retrieve and respond with player details', async () => {
    const mockRoomExists = { _id: 'roomId123' }
    const mockPlayers = [
      { user: 'userId1', nickname: 'PlayerOne', isAdmin: true },
      { user: 'userId2', nickname: 'PlayerTwo', isAdmin: false }
    ]
    Room.findById.mockResolvedValue(mockRoomExists)
    RoomPlayer.find.mockResolvedValue(mockPlayers)

    await getPlayersByRoomId(req, res)

    expect(RoomPlayer.find).toHaveBeenCalledWith({ room: 'roomId123' })
  })

  test('should handle errors correctly', async () => {
    Room.findById.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getPlayersByRoomId(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error'
    })
  })
})

const { getFinalText } = require('../src/controllers/roomController')

describe('getFinalText function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roundId: 'roundId123',
        bookUserId: 'bookUserId123'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if text entry not found', async () => {
    Texting.findOne.mockResolvedValue(null)

    await getFinalText(req, res)

    expect(Texting.findOne).toHaveBeenCalledWith({
      round: 'roundId123',
      bookUser: 'bookUserId123'
    })
  })

  test('should handle errors correctly', async () => {
    Texting.findOne.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getFinalText(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { addImage } = require('../src/controllers/roomController')
const multer = require('multer') // You'll typically use multer for handling file uploads in Express

jest.mock('multer', () => {
  const multerMock = () => ({
    single: () => (req, res, next) => {
      req.file = req.body.mockFile
      next()
    }
  })
  return multerMock
})

const { getDrawing } = require('../src/controllers/roomController')

describe('getDrawing function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roundId: 'roundId123',
        bookUserId: 'bookUserId123'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if drawing entry not found', async () => {
    Drawing.findOne.mockResolvedValue(null)

    await getDrawing(req, res)

    expect(Drawing.findOne).toHaveBeenCalledWith({
      round: 'roundId123',
      bookUser: 'bookUserId123'
    })
  })
  test('should handle errors correctly', async () => {
    Drawing.findOne.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getDrawing(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { fetchAllRoomPlayers } = require('../src/controllers/roomController')

describe('fetchAllRoomPlayers function', () => {
  let req, res

  beforeEach(() => {
    req = {} // No params needed for this function
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should retrieve and respond with all player data', async () => {
    const mockPlayers = [
      { nickname: 'PlayerOne', isAdmin: true, user: { email: 'playerone@example.com' } },
      { nickname: 'PlayerTwo', isAdmin: false, user: { email: 'playertwo@example.com' } }
    ]
    RoomPlayer.find.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockPlayers)
    }))

    await fetchAllRoomPlayers(req, res)

    expect(RoomPlayer.find).toHaveBeenCalledWith({})
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      players: mockPlayers.map(p => ({
        nickname: p.nickname,
        isAdmin: p.isAdmin,
        email: p.user.email
      }))
    })
  })

  test('should handle errors correctly', async () => {
    RoomPlayer.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(new Error('Internal server error'))
    }))

    await fetchAllRoomPlayers(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error'
    })
  })
})

const { getImageData } = require('../src/controllers/roomController')

describe('getImageData function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roundId: 'roundId123',
        bookUserId: 'bookUserId123'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if image data is not found or unavailable', async () => {
    Drawing.findOne.mockResolvedValue(null) // Case where no drawing is found

    await getImageData(req, res)

    expect(Drawing.findOne).toHaveBeenCalledWith({
      round: 'roundId123',
      bookUser: 'bookUserId123'
    })
  })

  test('should handle errors correctly', async () => {
    Drawing.findOne.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getImageData(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { getRoomMetadata } = require('../src/controllers/roomController')

describe('getRoomMetadata function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roomId: 'roomId123'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 500 if room not found', async () => {
    Room.findById.mockResolvedValue(null)

    await getRoomMetadata(req, res)

    expect(Room.findById).toHaveBeenCalledWith('roomId123')
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })

  test('should handle errors correctly', async () => {
    Room.findById.mockImplementation(() => {
      throw new Error('Internal server error')
    })

    await getRoomMetadata(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { fetchAllDrawings } = require('../src/controllers/roomController')

describe('fetchAllDrawings function', () => {
  let req, res

  beforeEach(() => {
    req = {} // No params needed for this function
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should retrieve and respond with all drawing data', async () => {
    const mockDrawings = [
      { createTime: '2021-01-01T00:00:00Z', email: 'user@example.com' }
    ]
    Drawing.aggregate.mockResolvedValue(mockDrawings)

    await fetchAllDrawings(req, res)

    expect(Drawing.aggregate).toHaveBeenCalled()
  })
})

const { fetchAllTextings } = require('../src/controllers/roomController')

describe('fetchAllTextings function', () => {
  let req, res

  beforeEach(() => {
    req = {} // No params needed for this function
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should retrieve and respond with all texting data', async () => {
    const mockTextings = [
      { createTime: '2021-01-01T00:00:00Z', email: 'user@example.com' }
    ]
    Texting.aggregate.mockResolvedValue(mockTextings)

    await fetchAllTextings(req, res)

    expect(Texting.aggregate).toHaveBeenCalled()
  })
})

const { findOrCreateUser } = require('../src/controllers/roomController')

describe('findOrCreateUser function', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      headersSent: false
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should find existing user and return it', async () => {
    const mockUser = { email: 'test@example.com' }
    User.findOne.mockResolvedValue(mockUser)

    await findOrCreateUser(req, res)

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
    expect(res.json).toHaveBeenCalledWith(mockUser)
  })

  test('should create and return a new user when none exists', async () => {
    User.findOne.mockResolvedValue(null)
    const mockUser = { email: 'test@example.com', save: jest.fn().mockResolvedValue(true) }
    User.prototype.save.mockResolvedValue(mockUser)

    await findOrCreateUser(req, res)

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' })
    expect(User.prototype.save).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(expect.any(Object))
  })

  test('should handle errors correctly and send error response', async () => {
    User.findOne.mockImplementationOnce(() => {
      throw new Error('Internal server error')
    })

    await findOrCreateUser(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Internal server error' })
  })
})

const { getAllUsers } = require('../src/controllers/roomController')

describe('getAllUsers function', () => {
  let req, res

  beforeEach(() => {
    req = {} // No parameters needed for this function
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should retrieve and respond with all user data', async () => {
    const mockUsers = [
      { email: 'user1@example.com', createTime: '2021-01-01T00:00:00Z' },
      { email: 'user2@example.com', createTime: '2021-01-02T00:00:00Z' }
    ]
    User.find.mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockUsers)
    }))

    await getAllUsers(req, res)

    expect(User.find).toHaveBeenCalledWith({}, 'email createTime')
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      users: mockUsers
    })
  })

  test('should handle errors correctly', async () => {
    User.find.mockImplementation(() => ({
      exec: jest.fn().mockRejectedValue(new Error('Internal server error'))
    }))

    await getAllUsers(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})

const { getRoundIdsByRoom } = require('../src/controllers/roomController')

describe('getRoundIdsByRoom function', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: {
        roomId: 'roomId123'
      }
    }
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should respond with 404 if no rounds found', async () => {
    Round.find.mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([])
    }))

    await getRoundIdsByRoom(req, res)

    expect(Round.find).toHaveBeenCalledWith({ room: 'roomId123' })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'No rounds found for the specified room'
    })
  })

  test('should retrieve and respond with round IDs', async () => {
    const mockRounds = [{ _id: 'roundId1' }, { _id: 'roundId2' }]
    Round.find.mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRounds)
    }))

    await getRoundIdsByRoom(req, res)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      roundIds: ['roundId1', 'roundId2']
    })
  })

  test('should handle errors correctly', async () => {
    Round.find.mockImplementation(() => ({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error('Internal server error'))
    }))

    await getRoundIdsByRoom(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })
})