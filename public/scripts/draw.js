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
