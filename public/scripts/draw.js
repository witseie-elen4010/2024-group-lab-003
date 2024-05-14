// Extracting URL parameters
const queryParams = new URLSearchParams(window.location.search)
const roomId = queryParams.get('roomId')
const userId = queryParams.get('userId')
let round = queryParams.get('round')

let roundId
let text

const totalRounds = queryParams.get('totalRounds')
const timeLimit = queryParams.get('timeLimit')
document.getElementById('submitDrawing').style.visibility = 'hidden'

console.log(roomId)
console.log(round)
console.log('waiting...')

let overlay

function createWaitingOverlay () {
  overlay = document.createElement('div')
  overlay.setAttribute('id', 'waitingOverlay')
  overlay.style.position = 'fixed'
  overlay.style.top = '0'
  overlay.style.left = '0'
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.backgroundColor = 'rgba(0, 0, 140, 1)' // Blue semi-transparent background
  overlay.style.color = 'white'
  overlay.style.display = 'flex'
  overlay.style.flexDirection = 'column'
  overlay.style.justifyContent = 'center'
  overlay.style.alignItems = 'center'
  overlay.style.zIndex = '1500' // Ensure it is on top of other elements

  const loadingGif = document.createElement('img')
  loadingGif.src = './../images/roundLoader.gif'
  loadingGif.alt = 'Loading...'
  loadingGif.style.width = '80px'
  loadingGif.style.height = '80px'
  loadingGif.style.marginBottom = '20px'

  const loadingText = document.createElement('div')
  loadingText.textContent = 'Waiting For Round To Begin...'
  loadingText.style.fontSize = '20px'
  loadingText.style.fontWeight = 'bold'

  overlay.appendChild(loadingGif)
  overlay.appendChild(loadingText)
  document.body.appendChild(overlay)
}
createWaitingOverlay()

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
      document.getElementById('submitDrawing').click() // Simulate the end round button click
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
        console.log(`user ID: ${userId}`)
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
                          // remove loading overlay
                          const overlayElement = document.getElementById('waitingOverlay')
                          if (overlayElement) {
                            overlayElement.remove()
                          } else {
                            console.error('Overlay not found')
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

  // Set up the default pen color, width, and shape
  let penColor = '#0000FF'
  let penWidth = 5
  let painting = false
  let shape = ''
  let startX; let startY; let isDrawing = false
  let undoStack = []
  let redoStack = []
  // Button listeners for shapes
  document.getElementById('drawSquare').addEventListener('click', function () {
    shape = 'square'
    painting = false // Temporarily disable free drawing mode
  })

  document.getElementById('drawCircle').addEventListener('click', function () {
    shape = 'circle'
    painting = false // Temporarily disable free drawing mode
  })

  let imageData // To store the canvas state

  // Drawing events
  canvas.addEventListener('mousedown', function (e) {
    startX = e.offsetX
    startY = e.offsetY
    isDrawing = true
    if (shape) {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height) // Store the canvas state when a shape is to be drawn
    } else {
      startDrawing(e) // Start free drawing if no shape is selected
    }
  })

  canvas.addEventListener('mousemove', function (e) {
    if (isDrawing) {
      if (shape) {
        ctx.putImageData(imageData, 0, 0) // Restore the canvas to its initial state
        drawShape(ctx, startX, startY, e.offsetX, e.offsetY) // Draw the new shape position
      } else if (painting) {
        draw(e) // Continue free drawing
      }
    }
  })

  canvas.addEventListener('mouseup', function (e) {
    if (isDrawing) {
      if (shape) {
        ctx.putImageData(imageData, 0, 0) // Restore the canvas to its initial state
        drawShape(ctx, startX, startY, e.offsetX, e.offsetY) // Draw the final shape
        shape = '' // Reset the shape, revert to default pen mode
        painting = true // Re-enable free drawing mode
      }
      isDrawing = false
      if (!shape) finishDrawing()
    }
  })

  canvas.addEventListener('mouseout', stopPainting)

  function drawShape (ctx, x1, y1, x2, y2) {
    const width = x2 - x1
    const height = y2 - y1
    ctx.beginPath() // Begin a new path to draw the shape
    if (shape === 'square') {
      ctx.strokeRect(x1, y1, width, height)
    } else if (shape === 'circle') {
      const radius = Math.sqrt(width * width + height * height)
      ctx.arc(x1, y1, radius, 0, Math.PI * 2, true)
      ctx.stroke()
    }
    ctx.closePath() // Close the path
  }

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
