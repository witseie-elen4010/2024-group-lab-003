const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')

// Set up the default pen color and width
let penColor = '#000000'
const penWidth = 5 // Default line width
let painting = false // This should be defined to keep track of painting state

canvas.addEventListener('mousedown', (e) => {
  painting = true
  ctx.beginPath() // Begin a new path to start drawing in a new color immediately
  draw(e)
})

window.addEventListener('mouseup', () => {
  painting = false
  ctx.beginPath()
})

canvas.addEventListener('mousemove', draw)

canvas.addEventListener('mouseout', () => {
  painting = false
  ctx.beginPath()
})

function draw (e) {
  if (!painting) return

  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left - 5
  const y = e.clientY - rect.top - 5

  // Set stroke properties before drawing
  ctx.lineWidth = penWidth
  ctx.lineCap = 'round'
  ctx.strokeStyle = penColor

  // Draw
  ctx.lineTo(x, y)
  ctx.stroke()
  ctx.beginPath() // Start a new path after drawing the line
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

document.getElementById('save').addEventListener('click', function () {
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = 'my-drawing.png'
  link.href = dataUrl
  link.click()
})

window.addEventListener('resize', resizeCanvas)

function resizeCanvas () {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  canvas.width = width
  canvas.height = height
  ctx.beginPath() // Reset the context to prevent continuous lines
}

resizeCanvas()
