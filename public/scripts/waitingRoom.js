// const { response } = require('express')

document.addEventListener('DOMContentLoaded', async function () {
  const loadingSpinner = document.querySelector('.main-content-footer .spinner-border')
  const waitingText = document.querySelector('.main-content-footer p')
  const settingsView = document.getElementById('settingsView')
  const startGameButton = document.createElement('button')
  const cancelGameButton = document.createElement('button')
  const roundsInput = document.createElement('input')
  const roundsLabel = document.createElement('label')

  // --------------------------------------------------------------------------------------------------
  // Variables for the game
  let numberRounds = 0
  let userIDs = [] // Array to store user IDs

  // Function to shuffle an array using the Fisher-Yates shuffle algorithm
  function shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]] // Swap elements
    }
    return array
  }

  function fillInRoundTable () {
    const roundTable = []

    for (let i = 0; i < numberRounds; i++) {
      let shuffledIDs

      // Check if the shuffled IDs do not match the same column position as the last round
      do {
        shuffledIDs = shuffleArray([...userIDs]) // Create a copy of userIDs and shuffle it

        // Ensure it's not the first round and check for column-wise duplication with the previous round
        if (i > 0 && shuffledIDs.some((id, index) => id === roundTable[i - 1][index])) {
          continue // If duplication is found, reshuffle
        }

        break // If it's the first round or no duplication is found, break the loop
      } while (true)

      roundTable.push(shuffledIDs)
    }

    return roundTable
  }
  // --------------------------------------------------------------------------------------------------

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
    // Container for buttons
    const buttonContainer = document.createElement('div')
    buttonContainer.style.display = 'flex'
    buttonContainer.style.position = 'absolute'
    buttonContainer.style.bottom = '1rem'
    buttonContainer.style.right = '1rem'
    buttonContainer.style.gap = '10px' // Adjust this value as needed for spacing

    // Start Game Button
    startGameButton.textContent = 'Start Game'
    startGameButton.id = 'startGameButton'
    startGameButton.classList.add('btn', 'btn-primary')
    buttonContainer.appendChild(startGameButton) // Append to the container

    // Cancel Game Button
    cancelGameButton.textContent = 'Cancel Game'
    cancelGameButton.id = 'cancelGameButton'
    cancelGameButton.classList.add('btn', 'btn-danger') // Red button
    buttonContainer.appendChild(cancelGameButton) // Append to the container

    // Append the container to the body
    document.body.appendChild(buttonContainer)

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
      // Display a loading screen
      const overlay = document.createElement('div')
      overlay.style.position = 'fixed'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '100%'
      overlay.style.height = '100%'
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      overlay.style.display = 'flex'
      overlay.style.justifyContent = 'center'
      overlay.style.alignItems = 'center'
      overlay.style.zIndex = '1000' // Ensure it is on top of other elements

      const loadingGif = document.createElement('img')
      loadingGif.src = './../images/loading15.gif'
      loadingGif.style.width = '100px'
      loadingGif.style.height = '100px'

      overlay.appendChild(loadingGif)
      document.body.appendChild(overlay)

      const numRounds = roundsInput.value
      const timePerRound = timeLimitSlider.value
      numberRounds = numRounds

      setNumRounds(roomId, numRounds)
      setTimePerRound(roomId, timePerRound)
      const roundIdList = []

      // First, perform the initial POST request to add round objects.
      fetch(`/api/add-round-objects/${roomId}/${numRounds}`, {
        method: 'POST'
      })
        .then(response => {
          if (response.ok) {
            return response.json() // Parsing the JSON response if successful
          } else {
            throw new Error('Failed to add rounds.') // Throw error if response not OK
          }
        })
        .then(() => {
          const fetchPromises = []

          // Generate a list of promises from fetch requests for each round ID.
          for (let i = 1; i <= numRounds; i++) {
            const fetchPromise = fetch(`/api/get-round-id/${roomId}/${i}`)
              .then(response => {
                if (response.ok) {
                  return response.json() // Parse the JSON response if successful
                } else {
                  throw new Error(`Failed to fetch round ID for round ${i}`) // Throw an error if response not OK
                }
              })
              .then(data => {
                if (data.success) {
                  roundIdList.push(data.roundID) // Append the round ID to the list
                } else {
                  console.error('Fetch successful but API returned an error for round:', i)
                }
              })
              .catch(error => {
                console.error('Error fetching round ID for round', i, ':', error)
              })

            fetchPromises.push(fetchPromise) // Store the promise for later processing
          }

          // Wait for all the round ID fetch promises to resolve.
          return Promise.all(fetchPromises)
        })
        .then(() => {
          const kingArthursRoundTable = fillInRoundTable()
          console.log('All round IDs have been retrieved:', roundIdList)
          console.log(userIDs)
          console.log(kingArthursRoundTable)

          fetch('/api/add-all-texts-and-draws', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              kingArthursRoundTable,
              roundIdList,
              userIDs
            })
          })
            .then(response => {
              if (response.ok) {
                return response.json() // Parsing the JSON response if successful
              } else {
                console.log(response.json())
                throw new Error('Failed to add all stuff.') // Throw error if response not OK
              }
            })
            .then(data => {
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
            .catch(error => {
              console.error('Error adding all stuff:', error)
              // Optionally inform the user of the failure to start the game
              window.alert('Failed to all stuff. Please try again.')
            })
        })
        .catch(error => {
          console.error('Error during operations:', error)
          window.alert('Failed to add rounds. Please try again.')
        })
    })

    cancelGameButton.addEventListener('click', async function () {
      try {
        const response = await fetch(`/api/get-room-players?code=${roomCode}`)
        if (!response.ok) {
          throw new Error('Failed to fetch players.')
        }
        const data = await response.json()
        if (data.success && data.players.length > 0) {
          for (const player of data.players) {
            await removePlayer(player.nickname)
          }
          console.log('All players removed successfully')
          // Optionally update the UI or redirect the user
        } else {
          console.error('No players found or failed to fetch players:', data.message)
          window.alert('No players to remove or failed to fetch players.')
        }
      } catch (error) {
        console.error('Error in cancelling game:', error)
        window.alert('Error occurred while cancelling the game. Please try again.')
      }
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
          const round = 1
          window.location.href = `/description?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(userId)}&round=${encodeURIComponent(round)}`
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
    userIDs = []
    const playersList = document.getElementById('membersListContainer')
    const list = players
      .map((player, index) => {
        userIDs.push(player.id)
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
  setInterval(fetchPlayers, 400)
  setInterval(async () => {
    await checkIfRoomHasStarted(roomId)
  }, 400)

  function checkIfUserIsInRoom (userID, roomID) {
    const interval = 400 // Interval in milliseconds, e.g., 5000ms = 5 seconds

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
