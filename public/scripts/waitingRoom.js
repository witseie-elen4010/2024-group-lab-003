document.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const roomCode = urlParams.get('roomCode') || 'defaultCode'; // Fallback added for testing purposes
  const userId = urlParams.get('userId');
  document.getElementById('roomCode').textContent = roomCode;
  const playersList = document.getElementById('membersListContainer');

  async function fetchRoomId() {
    try {
      const response = await fetch(`/api/get-room-id/${roomCode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch room ID.');
      }
      const data = await response.json();
      if (data.success) {
        return data.roomId;
      } else {
        console.error('Failed to fetch room ID:', data.message);
        return null;  // return null if not successful
      }
    } catch (error) {
      console.error('Error fetching room ID:', error);
      return null;
    }
  }

  async function isUserAdmin(roomId) {
    try {
      const response = await fetch(`/api/is-user-admin/${roomId}/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to check if user is admin.');
      }
      const data = await response.json();
      if (data.success) {
        console.log('User is admin:', data.isAdmin);
        return data.isAdmin;
      } else {
        console.error('Failed to check if user is admin:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error checking if user is admin:', error);
      return false;
    }
  }

  function updatePlayersList(players) {
    const list = players.map(player =>
      `<a href="#" class="list-group-item list-group-item-action">${player.nickname}</a>`
    ).join('');
    playersList.innerHTML = `<div class="list-group">${list}</div>`;
  }

  async function fetchPlayers() {
    try {
      const response = await fetch(`/api/get-room-players?code=${roomCode}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      if (data.success) {
        updatePlayersList(data.players);
      } else {
        console.error('Failed to fetch players:', data.message);
      }
    } catch (error) {
      console.error('Error fetching player list:', error);
    }
  }

  // Initial fetch
  let roomId = await fetchRoomId(); // Wait to get roomId
  let admin = await isUserAdmin(roomId); // Use roomId to check admin status
  fetchPlayers(); // Fetch players independently of admin status

  // Set up a timer to fetch player list every 3 seconds
  setInterval(fetchPlayers, 3000);
});
