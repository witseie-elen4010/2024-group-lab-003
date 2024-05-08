// Extracting URL parameters
const queryParams = new URLSearchParams(window.location.search)
const roomId = queryParams.get('roomId')
const userId = queryParams.get('userId')
const round = queryParams.get('round')

let roundId
let text

console.log(roomId)
console.log(round)

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
      console.log(`round ID: ${roundId}`)

      // get BookUserId
      fetch(`/api/get-user-book-id-from-draw/${roundId}/${userId}`)
        .then(response => {
          if (response.ok) {
            return response.json() // Parse the JSON response if successful
          } else {
            throw new Error(`Failed to fetch round ID for round ${round - 1}`) // Throw an error if response not OK
          }
        })
        .then(data => {
          if (data.success) {
            bookUserId = data.bookUser // Set the round ID
            console.log(bookUserId)

            console.log(roundId)
            console.log(bookUserId)

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

const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')

// Set up the default pen color and width
let penColor = '#000000'
const penWidth = 5
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
