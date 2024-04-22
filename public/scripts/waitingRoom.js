document.addEventListener('DOMContentLoaded', async function () {
  const loadingSpinner = document.querySelector('.main-content-footer .spinner-border')
  const waitingText = document.querySelector('.main-content-footer p')
  const startGameButton = document.createElement('button')

  // Function to hide spinner and text
  function hideLoadingElements () {
    loadingSpinner.style.display = 'none'
    waitingText.style.display = 'none'
  }

  const urlParams = new URLSearchParams(window.location.search)
  const roomCode = urlParams.get('roomCode') || 'defaultCode'
  const userId = urlParams.get('userId')

  // Setting the correct Room Code
  document.getElementById('roomCode').textContent = roomCode

  let checkRoomInterval

  async function fetchRoomId () {
    try {
      const response = await fetch(`/api/get-room-id/${roomCode}`)
      if (!response.ok) {
        throw new Error('Failed to fetch room ID.')
      }
      const data = await response.json()
      if (data.success) {
        return data.roomId
      } else {
        console.error('Failed to fetch room ID:', data.message)
        return null
      }
    } catch (error) {
      console.error('Error fetching room ID:', error)
      return null
    }
  }

  async function isUserAdmin (roomId) {
    try {
      const response = await fetch(`/api/is-user-admin/${roomId}/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to check if user is admin.')
      }
      const data = await response.json()
      if (data.success) {
        return data.isAdmin
      } else {
        console.error('Failed to check if user is admin:', data.message)
        return false
      }
    } catch (error) {
      console.error('Error checking if user is admin:', error)
      return false
    }
  }

  const roomId = await fetchRoomId()
  const isAdmin = await isUserAdmin(roomId)

  if (!isAdmin) {
    // Non Admin setup
  } else {
    hideLoadingElements()
    // Admin setup
    startGameButton.textContent = 'Start Game'
    startGameButton.id = 'startGameButton'
    startGameButton.classList.add('btn', 'btn-primary')
    startGameButton.style.position = 'absolute'
    startGameButton.style.top = '1rem'
    startGameButton.style.right = '1rem'
    document.body.appendChild(startGameButton)

    startGameButton.addEventListener('click', function () {
      fetch(`/api/start-room/${roomId}`, {
        method: 'POST'
      })
        .then(response => {
          if (response.ok) {
            return response.json() // Parsing the JSON response if successful
          } else {
            throw new Error('Failed to start the game.') // Throw error if response not OK
          }
        })
        .then(data => {
          // console.log('Game started successfully:', data);
        })
        .catch(error => {
          console.error('Error starting game:', error)
          // Optionally inform the user of the failure to start the game
          window.alert('Failed to start the game. Please try again.')
        })
    })
  }

  async function fetchPlayers () {
    try {
      const response = await fetch(`/api/get-room-players?code=${roomCode}`)
      if (!response.ok) {
        throw new Error('Network response was not ok.')
      }
      const data = await response.json()
      if (data.success) {
        updatePlayersList(data.players)
      } else {
        console.error('Failed to fetch players:', data.message)
      }
    } catch (error) {
      console.error('Error fetching player list:', error)
    }
  }

  async function checkIfRoomHasStarted (roomId) {
    try {
      const response = await fetch(`/api/check-room-started/${roomId}`)
      if (!response.ok) {
        throw new Error('Failed to check if the room has started.')
      }
      const data = await response.json()
      if (data.success) {
        if (data.hasStarted) {
          // Optionally, do something when the room starts, e.g., redirect or update the UI
          clearInterval(checkRoomInterval) // Stop checking if the room has started
          // You might want to redirect the user or enable game functionality
          // window.location.href = `/drawing`; // Example redirect
          window.location.href = '/drawing' // Example redirect
        }
      } else {
        console.error('Failed to get room started status:', data.message)
      }
    } catch (error) {
      console.error('Error while checking if the room has started:', error)
    }
  }

  function updatePlayersList (players) {
    const playersList = document.getElementById('membersListContainer')
    const list = players
      .map(player => `<a href="#" class="list-group-item list-group-item-action">${player.nickname}</a>`)
      .join('')
    playersList.innerHTML = `<div class="list-group">${list}</div>`
  }

  // Initial fetch of players
  fetchPlayers()
  // Periodically update player list every 3 seconds
  setInterval(fetchPlayers, 3000)
  setInterval(async () => {
    await checkIfRoomHasStarted(roomId)
  }, 3000)
})
