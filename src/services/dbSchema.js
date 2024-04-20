const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false }
})

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

const User = mongoose.model('User', userSchema)
const Room = mongoose.model('Room', roomSchema)

module.exports = { User, Room }


