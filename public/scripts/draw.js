// Extracting URL parameters
const queryParams = new URLSearchParams(window.location.search)
const roomId = queryParams.get('roomId')
const userId = queryParams.get('userId')
let round = queryParams.get('round')

let roundId
let text

const totalRounds = queryParams.get('totalRounds')
const timeLimit = queryParams.get('timeLimit')

console.log(roomId)
console.log(round)
console.log('waiting...')

function setupRoundTimer (duration) {
  setTimeout(function () {
    // Assuming you have a button to end the round that can be identified by an ID
    document.getElementById('submitDrawing').click()
    console.log('Timer completed, round ending.')
  }, duration * 1000) // Convert timeLimit to milliseconds
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
        throw new Error(`Failed to fetch ready ${round - 1}`) // Throw an error if response not OK
      }
    })
    .then(data => {
      if (data.success) {
        const ready = data.allReady // Set the round ID
        if (ready) {
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
        console.log(`RoundID: ${roundId}`)
        let bookUserId

        // get BookUserId
        fetch(`/api/get-user-book-id-from-draw/${roundId}/${userId}`)
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

                    // get the prev Text
                    fetch(`/api/get-text/${preRoundId}/${bookUserId}`)
                      .then(response => {
                        if (response.ok) {
                          return response.json() // Parse the JSON response if successful
                        } else {
                          throw new Error(`Failed to fetch round ID for round ${round - 1}`) // Throw an error if response not OK
                        }
                      })
                      .then(data => {
                        if (data.success) {
                          text = data.textData // Set the round ID
                          console.log(text)
                          document.getElementById('drawingTitle').textContent = text // Update the heading text
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
        console.error('Fetch successful but API returned an error for round:', round)
      }
    })
    .catch(error => {
      console.error('Error fetching round ID for round', round, ':', error)
    })

  document.getElementById('submitDrawing').addEventListener('click', function () {
    console.log('Submit button clicked')
    const canvas = document.getElementById('drawingCanvas')
    const dataUrl = canvas.toDataURL('image/png')
    console.log('image to URL')

    // Convert DataURL to Blob
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const formData = new FormData()
        formData.append('image', blob, 'my-drawing.png') // Append the blob as 'my-drawing.png'
        console.log('appended the image as a blob')

        // Add additional parameters if needed
        formData.append('userId', userId) // Ensure the userId is correctly assigned
        formData.append('roundId', roundId) // Ensure the roundId is correctly assigned

        // Send the formData with the file to your server endpoint
        fetch('/api/addImageToDrawing', {
          method: 'POST',
          body: formData
        })
          .then(response => {
            if (response.ok) {
              return response.json() // Parsing the JSON response if successful
            } else {
              throw new Error('Failed to add image.') // Throw error if response not OK
            }
          })
          .then(() => {
            // if the last round end the game
            if (round === totalRounds) {
              window.location.href = `/gameOver?roomId=${encodeURIComponent(roomId)}`
              return
            }
            // increment round
            round = Number(round) + 1
            // Increment round players
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
                window.location.href = `/description?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(userId)}&round=${encodeURIComponent(round)}&totalRounds=${encodeURIComponent(totalRounds)}&timeLimit=${encodeURIComponent(timeLimit)}`
              })
          })
          .catch(error => console.error('Error:', error)) // Log or handle errors appropriately
      })
  })

  const canvas = document.getElementById('drawingCanvas')
  const ctx = canvas.getContext('2d')

  // Set up the default pen color and width
  let penColor = '#0000FF'
  let penWidth = 5
  let painting = false
  let undoStack = []
  let redoStack = []

  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mouseup', finishDrawing)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseout', stopPainting)

  function startDrawing (e) {
    painting = true
    ctx.beginPath()
    draw(e)
  }

  function finishDrawing () {
    if (painting) {
      painting = false
      ctx.beginPath() // Start a new path to not connect lines
      undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
      redoStack = []
    }
  }

  function stopPainting () {
    if (painting) {
      finishDrawing()
    }
  }

  function draw (e) {
    if (!painting) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Set stroke properties
    ctx.lineWidth = penWidth
    ctx.lineCap = 'round'
    ctx.strokeStyle = penColor

    // Draw the line
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function changeColor (color) {
    penColor = color
  }
  // Color picker change event
  const colorPicker = document.getElementById('colorPicker')
  colorPicker.addEventListener('change', function () {
    changeColor(this.value)
  })

  document.querySelector('.small').addEventListener('click', function () {
    penWidth = this.dataset.value
  })
  document.querySelector('.medium').addEventListener('click', function () {
    penWidth = this.dataset.value
  })
  document.querySelector('.large').addEventListener('click', function () {
    penWidth = this.dataset.value
  })
  document.getElementById('save').addEventListener('click', saveDrawing)
  document.getElementById('undo').addEventListener('click', undoDrawing)
  document.getElementById('redo').addEventListener('click', redoDrawing)
  document.getElementById('clear').addEventListener('click', clearCanvas)

  function saveDrawing () {
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'my-drawing.png'
    link.href = dataUrl
    link.click()
  }

  function undoDrawing () {
    if (undoStack.length > 1) {
      redoStack.push(undoStack.pop())
      ctx.putImageData(undoStack[undoStack.length - 1], 0, 0)
    }
  }

  function redoDrawing () {
    if (redoStack.length > 0) {
      undoStack.push(redoStack.pop())
      ctx.putImageData(undoStack[undoStack.length - 1], 0, 0)
    }
  }

  function clearCanvas () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    undoStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)]
    redoStack = []
  }

  window.addEventListener('resize', resizeCanvas)

  function resizeCanvas () {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (canvas.width !== width || canvas.height !== height) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      canvas.width = width
      canvas.height = height
      ctx.putImageData(imgData, 0, 0)
    }
    ctx.beginPath() // Reset the context to prevent continuous lines
  }
  resizeCanvas()
  // Initialize the canvas with an empty state in the undo stack
  clearCanvas()
}
