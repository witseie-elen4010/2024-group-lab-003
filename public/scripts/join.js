function joinClicked(username, gamecode) {
    // Simple validation check
    if (username.trim() === '' || gamecode.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Make a request to your server to join the room with the given code
    fetch('/api/join-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, roomCode: gamecode })
    })
    .then(response => response.json())
    .then(data => {
        
        // Check if the join was successful
        if (data.success) {
            // Redirect to the waiting_room page upon successful joining
            window.location.href = '/waitingRoom';
        } else {
            // Display an error message if joining was not successful
            alert(data.message);
        }
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch request
        console.error('Error:', error);
    });
}

// Event listener for the join game button click
document.getElementById('joinGame').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const gamecode = document.getElementById('gamecode').value;
    joinClicked(username, gamecode);
});
