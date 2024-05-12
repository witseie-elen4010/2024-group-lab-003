// Import the necessary modules
const { joinRoom } = require('../src/controllers/roomController')
const { Room, RoomPlayer, User } = require('../src/services/dbSchema')

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

  // Add more tests here for other scenarios, like existing user joining the room, etc.
})

// Import the necessary modules
const { createRoom } = require('../src/controllers/roomController')
const generateRoomCode = jest.fn()

describe('createRoom function', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'hashedpassword',
        nickname: 'Tester'
      }
    }
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    }
    generateRoomCode.mockResolvedValue('ROOM123')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should create a room and respond with 201', async () => {
    await createRoom(req, res)

    expect(User.prototype.save).toHaveBeenCalled()
    expect(Room.prototype.save).toHaveBeenCalled()
    expect(RoomPlayer.prototype.save).toHaveBeenCalled()
    console.log('akiva:' + res.send.mock.calls)
    // expect(res.status).toHaveBeenCalledWith(201)
    // expect(res.send).toHaveBeenCalledWith({
    //   roomCode: 'ROOM123',
    //   userId: expect.any(String),
    //   message: 'Room created successfully!'
    // })
  })

  test('should handle errors if there is a problem saving the user', async () => {
    User.prototype.save.mockRejectedValue(new Error('Error saving user'))

    await createRoom(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({
      message: 'Error creating room',
      error: 'Error: Error saving user'
    })
  })
})

// // Import the function to test
// const { getRoomPlayers } = require('../src/controllers/roomController')

// // Setup the test environment
// describe('getRoomPlayers', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       query: { code: 'testCode' }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }

//     // Clear mocks after each test
//     jest.clearAllMocks()
//   })

//   test('should respond with 404 if room not found', async () => {
//     Room.findOne.mockResolvedValue(null)

//     await getRoomPlayers(req, res)

//     expect(Room.findOne).toHaveBeenCalledWith({ code: 'testCode' })
//     expect(res.status).toHaveBeenCalledWith(404)
//     expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Room not found' })
//   }) // Timeout set to 10000 milliseconds

//   test('should respond with 500 if there is an error', async () => {
//     Room.findOne.mockRejectedValue(new Error('Internal server error'))

//     await getRoomPlayers(req, res)

//     expect(Room.findOne).toHaveBeenCalledWith({ code: 'testCode' })
//     expect(res.status).toHaveBeenCalledWith(500)
//     expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Internal server error' })
//   })

//   test('should return a list of players if room is found', async () => {
//     const mockRoom = { _id: 'roomId' }
//     const mockPlayers = [
//       { nickname: 'Player1', user: { email: 'player1@example.com' } },
//       { nickname: 'Player2', user: { email: 'player2@example.com' } }
//     ]
//     Room.findOne.mockResolvedValue(mockRoom)
//     RoomPlayer.populate.mockResolvedValue(mockPlayers)

//     await getRoomPlayers(req, res)

//     expect(Room.findOne).toHaveBeenCalledWith({ code: 'testCode' })
//     expect(RoomPlayer.find).toHaveBeenCalledWith({ room: 'roomId' })
//     // expect(res.json).toHaveBeenCalledWith({
//     //   success: true,
//     //   players: expect.arrayContaining([
//     //     { nickname: 'Player1', email: 'player1@example.com' },
//     //     { nickname: 'Player2', email: 'player2@example.com' }
//     //   ])
//     // })
//   })
// })

// // Import the function to test
// const { getRoomIdByCode } = require('../src/controllers/roomController')

// // Setup the test environment
// describe('getRoomIdByCode', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       params: { code: 'uniqueRoomCode' }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }

//     // Clear mocks after each test
//     jest.clearAllMocks()
//   })

//   // Add your tests here
//   test('should return 404 if no room is found', async () => {
//     Room.findOne.mockResolvedValue(null) // No room found

//     await getRoomIdByCode(req, res)

//     expect(Room.findOne).toHaveBeenCalledWith({ code: 'uniqueRoomCode' })
//     expect(res.status).toHaveBeenCalledWith(404)
//     expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Room not found' })
//   })

//   test('should return 500 if there is an error', async () => {
//     Room.findOne.mockRejectedValue(new Error('Internal server error'))

//     await getRoomIdByCode(req, res)

//     expect(Room.findOne).toHaveBeenCalledWith({ code: 'uniqueRoomCode' })
//     expect(res.status).toHaveBeenCalledWith(500)
//     expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Internal server error' })
//   })

//   test('should return the room ID if found', async () => {
//     const mockRoom = { _id: 'roomId' }
//     Room.findOne.mockResolvedValue(mockRoom)

//     await getRoomIdByCode(req, res)

//     expect(Room.findOne).toHaveBeenCalledWith({ code: 'uniqueRoomCode' })
//     expect(res.json).toHaveBeenCalledWith({ success: true, roomId: 'roomId' })
//   })
// })

// // Tests not working so well for this function
// // Import the function to test
// const { isUserAdmin } = require('../src/controllers/roomController')

// // Setup the test environment
// describe('isUserAdmin', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       params: { roomId: 'room123', userId: 'user123' }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }

//     // Clear mocks after each test
//     jest.clearAllMocks()
//   })

//   test('should return 404 if no matching room player is found', async () => {
//     RoomPlayer.findOne.mockResolvedValue(null) // Simulate no room player found

//     await isUserAdmin(req, res)

//     expect(RoomPlayer.findOne).toHaveBeenCalledWith({
//       room: 'room123',
//       user: 'user123'
//     })
//     // expect(res.status).toHaveBeenCalledWith(404)
//     // expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No matching room player found.' })
//   })
//   test('should return true for isAdmin if the room player is an admin', async () => {
//     const mockRoomPlayer = { isAdmin: true }
//     RoomPlayer.findOne.mockResolvedValue(mockRoomPlayer)
//     console.log('Mock data returned:', RoomPlayer)

//     await isUserAdmin(req, res)

//     expect(RoomPlayer.findOne).toHaveBeenCalledWith({
//       room: 'room123',
//       user: 'user123'
//     })
//     // console.log('Mock data returned:', res.json.mock.calls)
//     // expect(res.json).toHaveBeenCalledWith({ success: true, isAdmin: true })
//   })

//   test('should return false for isAdmin if the room player is not an admin', async () => {
//     const mockRoomPlayer = { isAdmin: false }
//     RoomPlayer.findOne.mockResolvedValue(mockRoomPlayer)

//     await isUserAdmin(req, res)

//     expect(RoomPlayer.findOne).toHaveBeenCalledWith({
//       room: 'room123',
//       user: 'user123'
//     })
//     // expect(res.json).toHaveBeenCalledWith({ success: true, isAdmin: false })
//   })
// })

// // Import the function to test
// const { startRoom } = require('../src/controllers/roomController')

// describe('startRoom', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       params: { roomId: 'room123' }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   test('should update the room and respond with success message', async () => {
//     const mockUpdatedRoom = {
//       _id: 'room123',
//       hasStarted: true
//     }
//     Room.findByIdAndUpdate.mockResolvedValue(mockUpdatedRoom)

//     await startRoom(req, res)

//     expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
//       'room123',
//       { $set: { hasStarted: true } },
//       { new: true, runValidators: true }
//     )
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: 'Room started successfully',
//       room: mockUpdatedRoom
//     })
//   })

//   test('should return a 404 error if the room is not found', async () => {
//     Room.findByIdAndUpdate.mockResolvedValue(null)

//     await startRoom(req, res)

//     expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
//       'room123',
//       { $set: { hasStarted: true } },
//       { new: true, runValidators: true }
//     )
//     expect(res.status).toHaveBeenCalledWith(404)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Room not found'
//     })
//   })

//   test('should handle errors and respond with 500', async () => {
//     const error = new Error('Internal server error')
//     Room.findByIdAndUpdate.mockRejectedValue(error)

//     await startRoom(req, res)

//     expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
//       'room123',
//       { $set: { hasStarted: true } },
//       { new: true, runValidators: true }
//     )
//     expect(res.status).toHaveBeenCalledWith(500)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Internal server error'
//     })
//   })
// })

// // Import the function to test
// const { checkRoomStarted } = require('../src/controllers/roomController')

// describe('checkRoomStarted', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       params: { roomId: 'room123' }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   // Tests will be added here
//   test('should respond with the started status of the room when found', async () => {
//     const mockRoom = {
//       _id: 'room123',
//       hasStarted: true
//     }
//     Room.findById.mockResolvedValue(mockRoom)

//     await checkRoomStarted(req, res)

//     expect(Room.findById).toHaveBeenCalledWith('room123')
//   })

//   test('should return a 404 error if the room is not found', async () => {
//     Room.findById.mockResolvedValue(null)

//     await checkRoomStarted(req, res)

//     expect(Room.findById).toHaveBeenCalledWith('room123')
//     // expect(res.status).toHaveBeenCalledWith(404)
//     // expect(res.json).toHaveBeenCalledWith({
//     //   success: false,
//     //   message: 'Room not found'
//     // })
//   })

//   //   test('should handle errors and respond with 500', async () => {
//   //     const error = new Error('Internal server error')
//   //     Room.findById.mockRejectedValue(error)

//   //     await checkRoomStarted(req, res)

// //     expect(Room.findById).toHaveBeenCalledWith('room123')
// //     expect(console.error).toHaveBeenCalledWith('Error fetching room started status:', error)
// //     expect(res.status).toHaveBeenCalledWith(500)
// //     expect(res.json).toHaveBeenCalledWith({
// //       success: false,
// //       message: 'Internal server error'
// //     })
// //   })
// })

// // Import the function to test
// const { removePlayerFromRoomByID } = require('../src/controllers/roomController')

// describe('removePlayerFromRoomByID', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       params: { userID: 'user123', roomID: 'room123' }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   // Tests will be added here
//   test('should successfully remove a player and respond with success', async () => {
//     RoomPlayer.findOneAndDelete.mockResolvedValue({
//       _id: 'someid', // Mocked return value indicating a player was removed
//       user: 'user123',
//       room: 'room123'
//     })

//     await removePlayerFromRoomByID(req, res)

//     expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
//       user: 'user123',
//       room: 'room123'
//     })
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: 'Player removed'
//     })
//   })

//   test('should return a 404 error if no player is found to remove', async () => {
//     RoomPlayer.findOneAndDelete.mockResolvedValue(null) // No player found to remove

//     await removePlayerFromRoomByID(req, res)

//     expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
//       user: 'user123',
//       room: 'room123'
//     })
//     expect(res.status).toHaveBeenCalledWith(404)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Room Player not found'
//     })
//   })
//   test('should handle errors and respond with 500', async () => {
//     const error = new Error('Internal server error')
//     RoomPlayer.findOneAndDelete.mockRejectedValue(error) // Simulate an error during the delete operation

//     await removePlayerFromRoomByID(req, res)

//     expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
//       user: 'user123',
//       room: 'room123'
//     })
//     expect(res.status).toHaveBeenCalledWith(500)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Internal server error'
//     })
//   })
// })

// // Import the function to test
// const { removePlayerFromRoomByNickname } = require('../src/controllers/roomController')

// describe('removePlayerFromRoomByNickname', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       params: { userNickname: 'nickname123', roomID: 'room123' }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   // Add test cases here
//   test('should successfully remove a player by nickname and respond with success', async () => {
//     RoomPlayer.findOneAndDelete.mockResolvedValue({
//       _id: 'someid', // Mock return value indicating a player was removed
//       nickname: 'nickname123',
//       room: 'room123'
//     })

//     await removePlayerFromRoomByNickname(req, res)

//     expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
//       nickname: 'nickname123',
//       room: 'room123'
//     })
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: 'Player removed'
//     })
//   })
//   test('should return a 404 error if no player is found to remove by nickname', async () => {
//     RoomPlayer.findOneAndDelete.mockResolvedValue(null) // No player found to remove

//     await removePlayerFromRoomByNickname(req, res)

//     expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
//       nickname: 'nickname123',
//       room: 'room123'
//     })
//     expect(res.status).toHaveBeenCalledWith(404)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Room Player not found'
//     })
//   })
//   test('should handle errors and respond with 500', async () => {
//     const error = new Error('Internal server error')
//     RoomPlayer.findOneAndDelete.mockRejectedValue(error) // Simulate an error during the delete operation

//     await removePlayerFromRoomByNickname(req, res)

//     expect(RoomPlayer.findOneAndDelete).toHaveBeenCalledWith({
//       nickname: 'nickname123',
//       room: 'room123'
//     })
//     expect(res.status).toHaveBeenCalledWith(500)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Internal server error'
//     })
//   })
// })

// // Import the function to test
// const { userIsInRoom } = require('../src/controllers/roomController')

// describe('userIsInRoom', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       params: { userID: 'user123', roomID: 'room123' }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   // Add test cases here
//   test('should return 404 if the room is not found', async () => {
//     Room.findById.mockResolvedValue(null) // Simulate no room found

//     await userIsInRoom(req, res)

//     expect(Room.findById).toHaveBeenCalledWith('room123')
//     // expect(res.status).toHaveBeenCalledWith(404)
//     // expect(res.json).toHaveBeenCalledWith({
//     //   success: false,
//     //   message: 'Room not found'
//     // })
//   })

//   test('should return that user is not in the room if not found', async () => {
//     const mockRoom = { _id: 'room123', hasStarted: false }
//     Room.findById.mockResolvedValue(mockRoom)
//     RoomPlayer.findOne.mockResolvedValue(null) // Simulate user not found in the room

//     await userIsInRoom(req, res)

//     expect(Room.findById).toHaveBeenCalledWith('room123')
//     // expect(RoomPlayer.findOne).toHaveBeenCalledWith({ user: 'user123', room: 'room123' })
//     // expect(res.json).toHaveBeenCalledWith({
//     //   success: true,
//     //   inRoom: false,
//     //   message: 'Player not found in the room'
//     // })
//   })

//   test('should confirm user is in the room and return room status', async () => {
//     const mockRoom = { _id: 'room123', hasStarted: true }
//     const mockPlayer = { _id: 'player123', user: 'user123', room: 'room123' }
//     Room.findById.mockResolvedValue(mockRoom)
//     RoomPlayer.findOne.mockResolvedValue(mockPlayer)

//     await userIsInRoom(req, res)

//     expect(Room.findById).toHaveBeenCalledWith('room123')
//     // expect(RoomPlayer.findOne).toHaveBeenCalledWith({ user: 'user123', room: 'room123' })
//     // expect(res.json).toHaveBeenCalledWith({
//     //   success: true,
//     //   inRoom: true,
//     //   hasStarted: true
//     // })
//   })

//   //   test('should handle errors and respond with 500', async () => {
//   //     const error = new Error('Internal server error')
//   //     Room.findById.mockRejectedValue(error) // Simulate an error during room lookup

//   //     await userIsInRoom(req, res)

//   //     expect(Room.findById).toHaveBeenCalledWith('room123')

// //     expect(res.status).toHaveBeenCalledWith(500)
// //     expect(res.json).toHaveBeenCalledWith({
// //       success: false,
// //       message: 'Internal server error'
// //     })
// //   })
// })

// // Import the function to test
// const { setNumRounds } = require('../src/controllers/roomController')

// describe('setNumRounds', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       params: { roomID: 'room123', numRounds: 5 }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   // Add test cases here
//   test('should update the number of rounds for the room and respond with success', async () => {
//     const mockUpdatedRoom = { _id: 'room123', numRounds: 5 }
//     Room.findByIdAndUpdate.mockResolvedValue(mockUpdatedRoom)

//     await setNumRounds(req, res)

//     expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
//       'room123',
//       { $set: { numRounds: 5 } }
//     )
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: 'Number of rounds updated successfully',
//       room: mockUpdatedRoom
//     })
//   })

//   test('should return a 404 error if the room is not found', async () => {
//     Room.findByIdAndUpdate.mockResolvedValue(null) // No room found to update

//     await setNumRounds(req, res)

//     expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
//       'room123',
//       { $set: { numRounds: 5 } }
//     )
//     expect(res.status).toHaveBeenCalledWith(404)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Room not found'
//     })
//   })
//   test('should handle errors and respond with 500', async () => {
//     const error = new Error('Internal server error')
//     Room.findByIdAndUpdate.mockRejectedValue(error) // Simulate an error during the update operation

//     await setNumRounds(req, res)

//     expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
//       'room123',
//       { $set: { numRounds: 5 } }
//     )
//     expect(res.status).toHaveBeenCalledWith(500)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Internal server error'
//     })
//   })
// })

// // Import the function to test
// const { setTimePerRound } = require('../src/controllers/roomController')

// describe('setTimePerRound', () => {
//   let req, res

//   beforeEach(() => {
//     req = {
//       params: { roomID: 'room123', timePerRound: 30 }
//     }
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     }
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   // Add test cases here
//   test('should update the time per round for the room and respond with success', async () => {
//     const mockUpdatedRoom = { _id: 'room123', timePerRound: 30 }
//     Room.findByIdAndUpdate.mockResolvedValue(mockUpdatedRoom)

//     await setTimePerRound(req, res)

//     expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
//       'room123',
//       { $set: { timePerRound: 30 } }
//     )
//     expect(res.json).toHaveBeenCalledWith({
//       success: true,
//       message: 'Time per round updated successfully',
//       room: mockUpdatedRoom
//     })
//   })
//   test('should return a 404 error if the room is not found', async () => {
//     Room.findByIdAndUpdate.mockResolvedValue(null) // No room found to update

//     await setTimePerRound(req, res)

//     expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
//       'room123',
//       { $set: { timePerRound: 30 } }
//     )
//     expect(res.status).toHaveBeenCalledWith(404)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Room not found'
//     })
//   })
//   test('should handle errors and respond with 500', async () => {
//     const error = new Error('Internal server error')
//     Room.findByIdAndUpdate.mockRejectedValue(error) // Simulate an error during the update operation

//     await setTimePerRound(req, res)

//     expect(Room.findByIdAndUpdate).toHaveBeenCalledWith(
//       'room123',
//       { $set: { timePerRound: 30 } }
//     )
//     expect(res.status).toHaveBeenCalledWith(500)
//     expect(res.json).toHaveBeenCalledWith({
//       success: false,
//       message: 'Internal server error'
//     })
//   })
// })
