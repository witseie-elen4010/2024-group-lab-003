const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
})

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  createTime: { type: Date, default: Date.now },
  hasStarted: { type: Boolean, default: false } // Default value set to false
})

const roomPlayerSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nickname: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false } // Default value set to false
})


const roundSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roundNumber: { type: Number, required: true }
})

const textPromptSchema = new mongoose.Schema({
  description: { type: String, required: true }
})

const imagePromptSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }
})

const drawingSchema = new mongoose.Schema({
  round: { type: mongoose.Schema.Types.ObjectId, ref: 'Round', required: true },
  textPrompt: { type: mongoose.Schema.Types.ObjectId, ref: 'TextPrompt' },
  imagePrompt: { type: mongoose.Schema.Types.ObjectId, ref: 'ImagePrompt' },
  drawerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageData: { type: String, required: true } // Storing image data as URL or file path
})

const guessSchema = new mongoose.Schema({
  drawing: { type: mongoose.Schema.Types.ObjectId, ref: 'Drawing', required: true },
  guesserUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guessText: { type: String, required: true }
})

const User = mongoose.model('User', userSchema)
const Room = mongoose.model('Room', roomSchema)
const RoomPlayer = mongoose.model('RoomPlayer', roomPlayerSchema)
const Round = mongoose.model('Round', roundSchema)
const TextPrompt = mongoose.model('TextPrompt', textPromptSchema)
const ImagePrompt = mongoose.model('ImagePrompt', imagePromptSchema)
const Drawing = mongoose.model('Drawing', drawingSchema)
const Guess = mongoose.model('Guess', guessSchema)

module.exports = {
  User,
  Room,
  RoomPlayer,
  Round,
  TextPrompt,
  ImagePrompt,
  Drawing,
  Guess
}
