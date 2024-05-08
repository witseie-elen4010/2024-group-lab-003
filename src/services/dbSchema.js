const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
})

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  createTime: { type: Date, default: Date.now },
  hasStarted: { type: Boolean, default: false },
  numRounds: { type: Number, required: false },
  timePerRound: { type: Number, required: false }
})

const roomPlayerSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nickname: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false } // Default value set to false
})

const roundSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roundNumber: { type: Number, required: true },
  numberPlayersReady: { type: Number, required: true },
  totalPlayers: { type: Number, required: true }
})

const drawingSchema = new mongoose.Schema({
  round: { type: mongoose.Schema.Types.ObjectId, ref: 'Round', required: true },
  bookUser: { type: mongoose.Schema.Types.ObjectId, required: true },
  textPrompt: { type: mongoose.Schema.Types.ObjectId, ref: 'TextPrompt', required: false },
  drawerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageData: { type: String, required: false } // Storing image data as URL or file path
})

const textingSchema = new mongoose.Schema({
  round: { type: mongoose.Schema.Types.ObjectId, ref: 'Round', required: false },
  bookUser: { type: mongoose.Schema.Types.ObjectId, required: true },
  imagePrompt: { type: mongoose.Schema.Types.ObjectId, ref: 'TextPrompt' },
  textUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  textData: { type: String, required: false } // Storing image data as URL or file path
})

const User = mongoose.model('User', userSchema)
const Room = mongoose.model('Room', roomSchema)
const RoomPlayer = mongoose.model('RoomPlayer', roomPlayerSchema)
const Round = mongoose.model('Round', roundSchema)
const Drawing = mongoose.model('Drawing', drawingSchema)
const Texting = mongoose.model('Guess', textingSchema)

module.exports = {
  User,
  Room,
  RoomPlayer,
  Round,
  Drawing,
  Texting
}
