function joinClicked (roomCode, nickname) {
  if (roomCode.trim() === '' || nickname.trim() === '') {
    window.alert('Please fill in all fields.')
    return
  }
  // When email login is implemented this is removed
  const email = `user_${new Date().getTime()}@example.com` // Generates a unique email
  const password = 'defaultPassword123' // Temporary password

  fetch('/api/join-room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, roomCode, nickname })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Passing the room code as a URL parameter
        window.location.href = `/waitingRoom?roomCode=${encodeURIComponent(roomCode)}&userId=${encodeURIComponent(data.userId)}`
      } else {
        window.alert(data.message)
      }
    })
    .catch(error => {
      console.error('Error:', error)
      window.alert('Error joining room. Please try again.')
    })
}

document.getElementById('joinRoom').addEventListener('click', function () {
  this.disabled = true
  const roomCode = document.getElementById('roomCode').value
  const nickname = document.getElementById('nickname').value
  joinClicked(roomCode, nickname)
})
