document.addEventListener('DOMContentLoaded', async function () {
  const bookList = document.getElementById('book-list')
  // const roomId = '66433cead761ace586048254' // You will need to set this according to your application's context
  const params = new URLSearchParams(window.location.search)
  const roomId = params.get('roomId') // Ensure this parameter is passed in the URL

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
      if (data.success && data.roundIds.length) {
        console.log('Rounds data:', data.roundIds)

        for (const [index, round] of data.roundIds.entries()) {
          // Check if the round number is odd: (index + 1) because index is 0-based
          if ((index + 1) % 2 !== 0) {
            console.log(`Fetching text for Round ID ${round} and Book User ID ${bookId}`)
            await fetchText(round, bookId) // call the fetchText function
          } else {
            console.log(`Fetching drawing for Round ID ${round} and Book User ID ${bookId}`)
            await fetchImage(round, bookId) // Fetch drawing data
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
      const response = await fetch(`/api/get-final-text/${roundId}/${bookUserId}`)
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        const textBlock = document.createElement('div')
        textBlock.className = 'card mt-2'
        // Include the nickname in the textBlock
        textBlock.innerHTML = `<div class="card-body"><strong>${data.nickname} wrote:</strong><br>${data.textData}</div>`
        document.getElementById('right-panel').appendChild(textBlock)
      } else {
        console.error('Fetch successful but API returned an error:', data.message)
      }
    } catch (error) {
      console.error(`Error fetching text for Round ${roundId} and Book User ${bookUserId}:`, error)
    }
  }

  async function fetchImage (roundId, bookUserId) {
    try {
      const response = await fetch(`/api/get-image-data/${roundId}/${bookUserId}`)
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`)
      }
      const data = await response.json()
      console.log(`Image Data ${data.imageData}`) // Log the image data

      if (data.success) {
        // Create a text element to display "nickname drew:"
        const nicknameLabel = document.createElement('div')
        nicknameLabel.className = 'card-header' // Assign class for styling
        nicknameLabel.innerText = `${data.nickname} drew:` // Set the text
        nicknameLabel.style.fontWeight = 'bold' // Make the text bold

        // Create an img element using document.createElement
        const image = document.createElement('img')
        image.src = 'data:image/png;base64,' + data.imageData // Set the source of the image
        image.className = 'card-img-top mt-2' // Assign class names for styling
        image.alt = 'Loaded Image' // Alt text for accessibility

        // Set the size of the image
        image.style.width = '100%' // Set the width to 100% of its container
        image.style.height = 'auto' // Set the height to scale automatically

        // Create a container div element for the image and text
        const imageCard = document.createElement('div')
        imageCard.className = 'card' // Style the card container
        imageCard.appendChild(nicknameLabel) // Append the nickname label to the card
        imageCard.appendChild(image) // Append the image to the card

        // Append the entire card to a container in your HTML
        document.getElementById('right-panel').appendChild(imageCard)
      } else {
        console.error('Fetch successful but API returned an error:', data.message)
      }
    } catch (error) {
      console.error(`Error fetching image for Round ${roundId} and Book User ${bookUserId}:`, error)
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

      // Clear existing content in the right-panel before fetching new rounds
      const rightPanel = document.getElementById('right-panel')
      rightPanel.innerHTML = '' // This line clears the right-panel

      // Check if a book is selected before fetching rounds
      if (selectedBook) {
        fetchRoomRounds(selectedBook.value)
      } else {
        // Optionally handle the case where no book is selected
        const errorMessage = document.createElement('p')
        errorMessage.textContent = 'Please select a book to show its review.'
        errorMessage.classList.add('alert', 'alert-warning')
        rightPanel.appendChild(errorMessage)
      }
    })
  }

  await fetchPlayers() // Call async function to fetch players
})
