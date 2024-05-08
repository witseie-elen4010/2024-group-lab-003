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

  // Log the parameters to console (you can remove this in production)
  console.log(`Room ID: ${roomId}, User ID: ${userId}, Round: ${round}`)

  function displayImageFromBlob (data, imageElementId) {
    const img = document.getElementById(imageElementId)
    if (!img) {
      console.error('Image element not found')
      return
    }

    try {
      if (data && data.length > 0) {
        // Assuming data is an array of byte values
        const blob = new Blob([new Uint8Array(data)], { type: 'image/png' })
        const url = URL.createObjectURL(blob)
        img.src = url
        img.onload = () => URL.revokeObjectURL(url) // Clean up after load
      } else {
        // No data received, set image to a black placeholder
        img.src = createBlackImageDataURL()
        console.log('No valid image data received, displaying black placeholder.')
      }
    } catch (error) {
      console.error('Error displaying image:', error)
      img.src = createBlackImageDataURL() // Fallback to black image on error
    }
  }

  function createBlackImageDataURL () {
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
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
            startRound() // Function to proceed with the game
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

          if (round > 1) {
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

                        // get the prev drawing
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
                              const imageBlob = data.imageData // Set the round ID
                              console.log(imageBlob)
                              displayImageFromBlob(imageBlob, 'imageBox')
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
      const inputText = document.getElementById('inputText').value
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

            // First, perform the initial POST request to add round objects.
            fetch(`/api/add-description/${userId}/${roundId}/${inputText}`, {
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
                round = Number(round) + 1
                console.log(`Round Description is incrementing: ${round}`)
                // increment round players
                fetch(`/api/increment-round-players/${roomId}/${round}`, {
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
                    window.location.href = `/drawing?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(userId)}&round=${encodeURIComponent(round)}`
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
