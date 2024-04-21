// Function to handle the room creation logic when the "Create" button is clicked
function createClicked (nickname) {
  const email = `user_${new Date().getTime()}@example.com` // Generates a unique email
  const password = 'defaultPassword123' // Temporary password

  fetch('/api/create-room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, nickname })
  })
    .then(response => {
      if (response.ok) {
        return response.json() // Only parse JSON if response is OK
      } else {
        throw new Error('Failed to create room')
      }
    })
    .then(data => {
      const gameCodeP = document.getElementById('gameCode')
      const codeSpan = document.getElementById('code')
      codeSpan.textContent = data.roomCode
      gameCodeP.style.display = 'block' // Display the game code

      setTimeout(() => { // Redirect after 3 seconds
        window.location.href = `/waitingRoom?roomCode=${encodeURIComponent(data.roomCode)}&userId=${encodeURIComponent(data.userId)}`
      }, 0)
    })
    .catch(error => {
      console.error('Error creating room:', error)
      window.alert('Error creating room. Please try again.')
    })
}

document.getElementById('create').addEventListener('click', () => {
  const nickname = document.getElementById('nickname').value
  if (nickname.trim() === '') {
    window.alert('Please enter a nickname.')
  } else {
    createClicked(nickname)
  }
})
