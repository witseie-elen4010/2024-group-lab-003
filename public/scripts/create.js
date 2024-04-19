// Function to handle the room creation logic when the "Create" button is clicked
function createClicked (username) {
  const isAdmin = false // Set based on your application's logic for identifying admin users

  // Make a POST request to the server to create a room
  fetch('/api/create-room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, isAdmin })
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      if (data.roomCode) {
        window.alert(`Room created successfully! Code: ${data.roomCode}`)
      } else {
        window.alert('Failed to create room.')
      }
    })
    .catch(error => {
      console.error('Error creating room:', error)
      window.alert('Error creating room. Please try again.')
    })
}

// Add event listener to the "Create" button
document.getElementById('create').addEventListener('click', () => {
  const username = document.getElementById('username').value
  if (username.trim() === '') {
    window.alert('Please enter a username.')
  } else {
    createClicked(username)
  }
})
