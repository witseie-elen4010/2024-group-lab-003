document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search)
  const roomCode = urlParams.get('roomCode') || 'defaultCode' // Fallback added for testing
  document.getElementById('roomCode').textContent = roomCode
  const playersList = document.getElementById('membersListContainer')

  function fetchPlayers () {
    fetch(`/api/get-room-players?code=${roomCode}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.')
        }
        return response.json()
      })
      .then(data => {
        if (data.success) {
          updatePlayersList(data.players)
        } else {
          console.error('Failed to fetch players:', data.message)
        }
      })
      .catch(error => console.error('Error fetching player list:', error))
  }

  function updatePlayersList (players) {
    const list = players.map(player =>
        `<a href="#" class="list-group-item list-group-item-action">${player.nickname}</a>`
    ).join('')
    playersList.innerHTML = `<div class="list-group">${list}</div>`
  }

  // Initial fetch
  fetchPlayers()
  // Set up a timer to fetch player list every 3s seconds
  setInterval(fetchPlayers, 3000)
})
