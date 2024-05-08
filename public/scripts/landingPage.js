// Hashed password generated using bcrypt
const hashedPassword = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'

// Define an async function for the click event
async function handleClick () {
  const password = prompt('Enter password:')
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  if (hashedInput === hashedPassword) {
    window.location.href = '/logs'
  } else {
    alert('Incorrect password!')
  }
}

// Add event listener to the button click event
document.getElementById('log-button').addEventListener('click', handleClick)