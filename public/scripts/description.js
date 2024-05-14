document.addEventListener('DOMContentLoaded', function () {
  // Function to retrieve URL parameters
  function getQueryParam (param) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
  }

  // Retrieve the specific URL parameters
  const roomId = getQueryParam('roomId')
  const userId = getQueryParam('userId')
  let round = getQueryParam('round')

  let roundId
  let totalRounds
  let timeLimit

  // if not the first round then get room metadata from thr URL
  if (round > 1) {
    totalRounds = getQueryParam('totalRounds')
    timeLimit = getQueryParam('timeLimit')
  }

  const defaultDescriptions = ['Stephen Levitt riding a turtle', 'Stephen Levitt is a turtle', 'Stephen Levitt']

  // Log the parameters to console (you can remove this in production)
  console.log(`Room ID: ${roomId}, User ID: ${userId}, Round: ${round}`)

  function setupRoundTimer (duration) {
    const startTime = Date.now() // Record the start time
    const endTime = startTime + duration * 1000 // Calculate end time in milliseconds

    const timerInterval = setInterval(function () {
      const now = Date.now()
      const remaining = endTime - now
      const width = Math.max(0, (remaining / (duration * 1000)) * 100) // Calculate the width percentage

      document.getElementById('timerBar').style.width = width + '%' // Update the width of the timer bar

      if (remaining <= 0) {
        clearInterval(timerInterval) // Clear interval when time is up
        document.getElementById('endRoundButton').click() // Simulate the end round button click
        console.log('Timer completed, round ending.')
      }
    }, 1000) // Update every second
  }

  // Check if the round has started
  // Function to check if all players are ready
  function checkRoundIsReady () {
    console.log('checking if room has started...')
    fetch(`/api/round-is-ready/${roomId}/${round}`)
      .then(response => {
        if (response.ok) {
          return response.json() // Parse the JSON response if successful
        } else {
          throw new Error(`Failed to fetch ready ${round}`) // Throw an error if response not OK
        }
      })
      .then(data => {
        if (data.success) {
          const ready = data.allReady // Set the round ID
          console.log(ready)
          console.log(`Room Ready Bool: ${ready || round === '1'}`)
          console.log(`round = ${round}`)
          if (ready || round === '1') {
            console.log(ready)
            clearInterval(checkInterval) // Stop the polling
            // fetch room metadata
            if (round === '1') {
              fetch(`/api/get-room-data/${roomId}`)
                .then(response => {
                  if (response.ok) {
                    return response.json() // Parse the JSON response if successful
                  } else {
                    throw new Error('Failed to fetch reroom metadata') // Throw an error if response not OK
                  }
                })
                .then(data => {
                  if (data.success) {
                    totalRounds = data.totalRounds // Set the round ID
                    timeLimit = data.timeLimit
                    console.log(`total round: ${totalRounds}`)
                    console.log(`time limit: ${timeLimit}`)
                    // once you have the room metadata start the round
                    startRound()
                  } else {
                    console.error('Fetch successful but API returned an error for round:', round)
                  }
                })
            } else {
              startRound()
            }
          }
        } else {
          console.error('Fetch successful but API returned an error for round:', round)
        }
      })
      .catch(error => {
        console.error('Error fetching ready', round, ':', error)
      })
  }

  // Start polling every 5 seconds to check if the round is ready
  const checkInterval = setInterval(checkRoundIsReady, 4000)

  // Function to initiate the round when all players are ready
  function startRound () {
    console.log('Round is starting...')

    fetch(`/api/get-round-id/${roomId}/${round}`)
      .then(response => {
        if (response.ok) {
          return response.json() // Parse the JSON response if successful
        } else {
          throw new Error(`Failed to fetch round ID for round ${round}`) // Throw an error if response not OK
        }
      })
      .then(data => {
        if (data.success) {
          roundId = data.roundID // Set the round ID
          let bookUserId
          console.log(`user id: ${userId}`)
          console.log(`round id: ${roundId}`)

          if (round > 1) {
            console.log(`Got into the if with round: ${round}`)
            fetch(`/api/get-user-book-id-from-text/${roundId}/${userId}`)
              .then(response => {
                if (response.ok) {
                  return response.json() // Parse the JSON response if successful
                } else {
                  throw new Error(`Failed to fetch user book ID for round ${round}`) // Throw an error if response not OK
                }
              })
              .then(data => {
                if (data.success) {
                  bookUserId = data.bookUser // Set the round ID

                  // get prevRoundId
                  fetch(`/api/get-round-id/${roomId}/${round - 1}`)
                    .then(response => {
                      if (response.ok) {
                        return response.json() // Parse the JSON response if successful
                      } else {
                        throw new Error(`Failed to fetch round ID for round ${round}`) // Throw an error if response not OK
                      }
                    })
                    .then(data => {
                      if (data.success) {
                        const preRoundId = data.roundID // Set the round ID

                        // Fetching the previous drawing
                        fetch(`/api/get-drawing/${preRoundId}/${bookUserId}`)
                          .then(response => {
                            if (response.ok) {
                              return response.json() // Parse the JSON response if successful
                            } else {
                              throw new Error('Failed to fetch image') // Throw an error if response not OK
                            }
                          })
                          .then(data => {
                            if (data.success) {
                              const base64Image = data.imageData // Get the Base64 string
                              console.log(`Image Base64: ${base64Image}`) // Log the Base64 string for debugging
                              const imageElement = document.getElementById('imageBox')
                              if (imageElement) {
                                // Set the source of the image
                                imageElement.src = 'data:image/png;base64,' + base64Image
                                imageElement.className = 'card-img-top mt-2' // Assign class names for styling
                                imageElement.alt = 'Loaded Image' // Alt text for accessibility
                                imageElement.style.width = '400px' // Set the width to 400 pixels
                                imageElement.style.height = 'auto' // Set the height to scale automatically
                              } else {
                                console.error('No element with ID drawingCanvas found.')
                              }
                              setupRoundTimer(timeLimit)
                            } else {
                              console.error('Fetch successful but API returned an error for round:', round - 1)
                            }
                          })
                          .catch(error => {
                            console.error('Error fetching round ID for round', round - 1, ':', error)
                          })
                      } else {
                        console.error('Fetch successful but API returned an error for round:', round)
                      }
                    })
                    .catch(error => {
                      console.error('Error fetching round ID for round', round, ':', error)
                    })
                } else {
                  console.error('Fetch successful but API returned an error for round:', round - 1)
                }
              })
              .catch(error => {
                console.error('Error fetching round ID for round', round - 1, ':', error)
              })
          } else {
            setupRoundTimer(timeLimit)
          }
        } else {
          console.error('Fetch successful but API returned an error for round:', round)
        }
      })
      .catch(error => {
        console.error('Error fetching round ID for round', round, ':', error)
      })

    // Find the form and attach a submit event listener
    const form = document.querySelector('form')
    form.addEventListener('submit', function (event) {
      event.preventDefault() // Prevent the form from submitting normally

      // You can add actions here, like sending data to a server or updating the interface
      let inputText = document.getElementById('inputText').value
      console.log('Submitted text:', inputText)
      let roundId

      fetch(`/api/get-round-id/${roomId}/${round}`)
        .then(response => {
          if (response.ok) {
            return response.json() // Parse the JSON response if successful
          } else {
            throw new Error(`Failed to fetch round ID for round ${round}`) // Throw an error if response not OK
          }
        })
        .then(data => {
          if (data.success) {
            roundId = data.roundID

            if (!inputText) {
              const randomIndex = Math.floor(Math.random() * defaultDescriptions.length)
              inputText = defaultDescriptions[randomIndex]
            }

            // First, perform the initial POST request to add description.
            fetch(`/api/add-description/${userId}/${roundId}/${inputText}`, {
              method: 'POST'
            })
              .then(response => {
                if (response.ok) {
                  return response.json() // Parsing the JSON response if successful
                } else {
                  throw new Error('Failed to add description.') // Throw error if response not OK
                }
              })
              .then(() => {
                console.log(`attempting to check if last round with current round: ${round}, and totRounds: ${totalRounds}, equality check: ${round === totalRounds}`)
                if (round === totalRounds) {
                  window.location.href = `/gameOver?roomId=${encodeURIComponent(roomId)}`
                  return
                }
                round = Number(round) + 1
                // if the last round end the game
                console.log(`Round Description is incrementing: ${round}`)
                // increment round players
                fetch(`/api/increment-round-players/${roomId}/${round}`, {
                  method: 'POST'
                })
                  .then(response => {
                    if (response.ok) {
                      return response.json() // Parsing the JSON response if successful
                    } else {
                      throw new Error('Failed to add players to ready.') // Throw error if response not OK
                    }
                  })
                  .then(() => {
                    window.location.href = `/drawing?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(userId)}&round=${encodeURIComponent(round)}&totalRounds=${encodeURIComponent(totalRounds)}&timeLimit=${encodeURIComponent(timeLimit)}`
                  })
              })
          } else {
            console.error('Fetch successful but API returned an error for round:', round)
          }
        })
        .catch(error => {
          console.error('Error fetching round ID for round', round, ':', error)
        })
    })
  }
})
