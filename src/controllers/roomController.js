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
