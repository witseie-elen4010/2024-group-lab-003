// Hashed password generated using bcrypt
const hashedPassword = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'

// Get the user email
const email = document.getElementById('userEmail').textContent
console.log(email)

// Function to check if the user exists or create a new user
async function findOrCreateUser (email) {
  try {
    const response = await fetch('/api/find-or-add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error finding or creating user:', error)
    window.alert('Error finding or creating user. Please try again later.')
    throw error // Rethrow to stop further actions if needed
  }
}

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
    window.alert('Incorrect password!')
  }
}

async function goToCreate () {
  console.log('create clicked')
  try {
    await findOrCreateUser(email) // Ensure user is created or exists
    window.location.href = `/create?userEmail=${encodeURIComponent(email)}`
  } catch (error) {
    // Handle error if necessary
  }
}

async function goToJoin () {
  console.log('join clicked')
  try {
    await findOrCreateUser(email) // Ensure user is created or exists
    window.location.href = `/join?userEmail=${encodeURIComponent(email)}`
  } catch (error) {
    // Handle error if necessary
  }
}

// Add event listener to the button click event
document.getElementById('log-button').addEventListener('click', handleClick)
document.getElementById('createButton').addEventListener('click', goToCreate)
document.getElementById('joinButton').addEventListener('click', goToJoin)
