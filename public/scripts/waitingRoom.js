document.addEventListener('DOMContentLoaded', async function () {
  const loadingSpinner = document.querySelector('.main-content-footer .spinner-border')
  const waitingText = document.querySelector('.main-content-footer p')
  const settingsView = document.getElementById('settingsView')
  const startGameButton = document.createElement('button')
  const roundsInput = document.createElement('input')
  const roundsLabel = document.createElement('label')

  // Create slider elements
  const timeLimitSlider = document.createElement('input')
  const timeLimitLabel = document.createElement('label')
  const selectedTimeLabel = document.createElement('span')

  // Function to hide spinner and text
  function hideLoadingElements () {
    loadingSpinner.style.display = 'none'
    waitingText.style.display = 'none'
  }

  // Function to update rounds input based on the number of players
  function updateRoundsInput (players) {
    roundsInput.min = players.length
    // If current value of roundsInput is less than number of players, update it
    if (parseInt(roundsInput.value, 10) < players.length) {
      roundsInput.value = players.length
    }
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
    const leaveRoomButton = document.getElementById('leaveRoomButton')
    leaveRoomButton.addEventListener('click', function () {
      fetch(`/api/remove-player-from-room-by-user-id/${userId}/${roomId}`, {
        method: 'POST'
      })
        .then(response => {
          if (response.ok) {
            return response.json() // Parsing the JSON response if successful
          } else {
            throw new Error('Failed to leave game') // Throw error if response not OK
          }
        })
        .then(data => {
          window.location.href = '/'
        })
        .catch(error => {
          console.error('Error leaving game:', error)
          // Optionally inform the user of the failure to start the game
          window.alert('Failed to leave the game. Please try again.')
        })
    })
  } else {
    // Hide leave button
    const leaveRoomButton = document.getElementById('leaveRoomButton')
    leaveRoomButton.style.display = 'none'
    hideLoadingElements()
    // Admin setup
    startGameButton.textContent = 'Start Game'
    startGameButton.id = 'startGameButton'
    startGameButton.classList.add('btn', 'btn-primary')
    startGameButton.style.position = 'absolute'
    startGameButton.style.top = '1rem'
    startGameButton.style.right = '1rem'
    document.body.appendChild(startGameButton)

    // Admin can set the number of rounds
    roundsLabel.textContent = 'Number of Rounds:'
    roundsLabel.setAttribute('for', 'roundsInput')
    roundsInput.id = 'roundsInput'
    roundsInput.type = 'number'
    roundsInput.classList.add('form-control')
    roundsInput.value = 3 // default value

    // Admin can set time limit
    timeLimitLabel.textContent = 'Time Limit (seconds):'
    timeLimitLabel.setAttribute('for', 'timeLimitSlider')
    timeLimitSlider.id = 'timeLimitSlider'
    timeLimitSlider.type = 'range'
    timeLimitSlider.classList.add('form-range')
    timeLimitSlider.min = 10
    timeLimitSlider.max = 60
    timeLimitSlider.value = 10
    timeLimitSlider.oninput = () => {
      selectedTimeLabel.textContent = timeLimitSlider.value + ' seconds'
    }
    selectedTimeLabel.textContent = timeLimitSlider.value + ' seconds'

    // Append the elements to the settings view
    settingsView.appendChild(roundsLabel)
    settingsView.appendChild(roundsInput)
    settingsView.appendChild(timeLimitLabel)
    settingsView.appendChild(timeLimitSlider)
    settingsView.appendChild(selectedTimeLabel)

    startGameButton.addEventListener('click', function () {
      const numRounds = roundsInput.value
      const timePerRound = timeLimitSlider.value

      setNumRounds(roomId, numRounds)
      setTimePerRound(roomId, timePerRound)

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
        updateRoundsInput(data.players)
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
          clearInterval(checkRoomInterval) // Stop checking if the room has started

          // Randomly choose between /drawing and /description
          const nextPage = Math.random() < 0.5 ? '/drawing' : '/description'
          window.location.href = nextPage
        }
      } else {
        console.error('Failed to get room started status:', data.message)
      }
    } catch (error) {
      console.error('Error while checking if the room has started:', error)
    }
  }

  async function removePlayer (nickname) {
    console.log(`Attempting to remove player with nickname: ${nickname}`)
    fetch(`/api/remove-player-from-room-by-user-nickname/${nickname}/${roomId}`, {
      method: 'POST'
    })
      .then(response => {
        console.log(`Response status: ${response.status}`)
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Failed to remove player')
        }
      })
      .then(data => {
        console.log('Player removed successfully:', data)
        // fetchPlayers() // Re-fetch players to update the list
      })
      .catch(error => {
        console.error('Error removing player:', error)
        window.alert('Failed to remove player. Please try again.')
      })
  }

  async function setNumRounds (roomId, numRounds) {
    try {
      const response = await fetch(`/api/set-num-rounds/${roomId}/${numRounds}`, {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error('Failed to set number of rounds.')
      }
      const data = await response.json()
      console.log('Number of rounds set successfully:', data)
    } catch (error) {
      console.error('Error setting number of rounds:', error)
      // Optionally inform the user of the failure to set number of rounds
      window.alert('Failed to set number of rounds. Please try again.')
    }
  }
  async function setTimePerRound (roomId, timePerRound) {
    try {
      const response = await fetch(`/api/set-time-per-round/${roomId}/${timePerRound}`, {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error('Failed to set time per round.')
      }
      const data = await response.json()
      console.log('Time per round set successfully:', data)
    } catch (error) {
      console.error('Error setting time per round:', error)
      // Optionally inform the user of the failure to set time per round
      window.alert('Failed to set time per round. Please try again.')
    }
  }

  function addClickEventToPlayers () {
    document.querySelectorAll('#membersListContainer .list-group-item-action').forEach(item => {
      item.addEventListener('click', function (event) {
        event.preventDefault()
        const nicknameToRemove = this.getAttribute('data-nickname')
        removePlayer(nicknameToRemove)
      })
    })
  }

  function updatePlayersList (players) {
    const playersList = document.getElementById('membersListContainer')
    const list = players
      .map((player, index) => {
        if (index === 0) { // Check if it's the first player in the list, assumed to be the admin
          return `<span class="list-group-item">${player.nickname} (Admin)</span>`
        } else {
          return `<a href="#" class="list-group-item list-group-item-action" data-nickname="${player.nickname}">${player.nickname}</a>`
        }
      })
      .join('')
    playersList.innerHTML = `<div class="list-group">${list}</div>`
    if (isAdmin) { // Add click event only if the user is an admin
      addClickEventToPlayers()
    }
  }
  // Initial fetch of players
  fetchPlayers()
  // Periodically update player list every 0.3 seconds
  setInterval(fetchPlayers, 500)
  setInterval(async () => {
    await checkIfRoomHasStarted(roomId)
  }, 500)

  function checkIfUserIsInRoom (userID, roomID) {
    const interval = 5000 // Interval in milliseconds, e.g., 5000ms = 5 seconds

    setInterval(async () => {
      try {
        const response = await fetch(`/api/user-is-in-room/${roomID}/${userID}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        if (data.success) {
          // Additional actions can be taken here based on whether the user is in the room or not
          if (!data.inRoom) {
            console.log('User not found in the room. Handling accordingly...')
            window.location.href = '/'
          }
        } else {
          console.log(data.message) // Handle error message from the server
        }
      } catch (error) {
        console.error('Error fetching user status:', error)
      }
    }, interval)
  }
  checkIfUserIsInRoom(userId, roomId)
})
