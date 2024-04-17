const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight  // Adjust height for toolbar

// Set up the default pen color and width
let penColor = '#000000';
let penWidth = 5;  // Default line width
let painting = false;  // This should be defined to keep track of painting state

canvas.addEventListener('mousedown', (e) => {
  painting = true;
  ctx.beginPath(); // Begin a new path to start drawing in a new color immediately
  draw(e);
});

window.addEventListener('mouseup', () => {
  painting = false;
  ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseout', () => {
  painting = false;
  ctx.beginPath();
});

function draw(e) {
  if (!painting) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Set stroke properties before drawing
  ctx.lineWidth = penWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = penColor;

  // Draw
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();  // Start a new path after drawing the line
  ctx.moveTo(x, y);
}

function changeColor (color) {
    penColor = color
  }

// Function to clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(); // Clear any remaining paths
}

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.beginPath(); // Avoid graphical glitches when resizing
}

// Color picker change event
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('change', function() {
    changeColor(this.value);
});

document.getElementById('clear').addEventListener('click', clearCanvas);

document.getElementById('save').addEventListener('click', function() {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'my-drawing.png';
  link.href = dataUrl;
  link.click();
});

resizeCanvas();
