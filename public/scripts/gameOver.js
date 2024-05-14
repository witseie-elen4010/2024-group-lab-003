document.addEventListener('DOMContentLoaded', async function () {
  const bookList = document.getElementById('book-list')
  const roomId = '663bdd832da68ff685cd071a' // You will need to set this according to your application's context

  async function fetchPlayers () {
    try {
      const response = await fetch(`/api/get-users-by-room-id/${roomId}`)
      const data = await response.json()

      if (data.success && data.players.length) {
        bookList.innerHTML = '' // Clear existing books
        data.players.forEach(player => {
          const bookItem = document.createElement('a')
          bookItem.href = '#'
          bookItem.className = 'list-group-item list-group-item-action'
          bookItem.textContent = `${player.nickname}'s Book`
          bookItem.value = player.userId
          bookList.appendChild(bookItem)
        })
        attachEventListeners() // Call after dynamically adding elements
      } else {
        console.error('Failed to load players or no players in room')
      }
    } catch (error) {
      console.error('Error fetching players:', error)
    }
  }

  async function fetchRoomRounds (bookId) {
    console.log('Fetching rounds for Room ID:', roomId)
    try {
      const response = await fetch(`/api/get-room-rounds-by-room-id/${roomId}`)
      const data = await response.json()
      if (data.success && data.rounds.length) {
        console.log('Rounds data:', data.rounds)

        for (const [index, round] of data.rounds.entries()) {
          // Check if the round number is odd: (index + 1) because index is 0-based
          if ((index + 1) % 2 !== 0) {
            console.log(`Fetching text for Round ID ${round.id} and Book User ID ${bookId}`)
          }
        }
      } else {
        console.error('Failed to load rounds or no rounds available for the room')
      }
    } catch (error) {
      console.error('Error fetching rounds:', error)
    }
  }

  async function fetchText (roundId, bookUserId) {
    try {
      const response = await fetch(`/api/get-final-test/${roundId}/${bookUserId}`)
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        console.log(`Text data for Round ${roundId} and Book User ${bookUserId}:`, data.textData)
      } else {
        console.error('Fetch successful but API returned an error:', data.message)
      }
    } catch (error) {
      console.error(`Error fetching text for Round ${roundId} and Book User ${bookUserId}:`, error)
    }
  }

  function attachEventListeners () {
    const bookListItems = document.querySelectorAll('#book-list a')
    bookListItems.forEach(book => {
      book.addEventListener('click', function (event) {
        event.preventDefault()
        // Remove active class from all books
        bookListItems.forEach(b => b.classList.remove('active'))
        // Add active class to clicked book
        book.classList.add('active')
      })
    })

    const showBookButton = document.getElementById('showBookButton')
    showBookButton.addEventListener('click', function () {
      const selectedBook = document.querySelector('#book-list .active')
      console.log(selectedBook ? selectedBook.value : 'No book selected')
      fetchRoomRounds(selectedBook.value)
    })
  }

  await fetchPlayers() // Call async function to fetch players
})
