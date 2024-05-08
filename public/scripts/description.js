document.addEventListener('DOMContentLoaded', function () {
  // Function to retrieve URL parameters
  function getQueryParam (param) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
  }

  // Retrieve the specific URL parameters
  const roomId = getQueryParam('roomId')
  const userId = getQueryParam('userId')
  let round = getQueryParam('round')

  // Log the parameters to console (you can remove this in production)
  console.log(`Room ID: ${roomId}, User ID: ${userId}, Round: ${round}`)

  // Find the form and attach a submit event listener
  const form = document.querySelector('form')
  form.addEventListener('submit', function (event) {
    event.preventDefault() // Prevent the form from submitting normally

    // You can add actions here, like sending data to a server or updating the interface
    const inputText = document.getElementById('inputText').value
    console.log('Submitted text:', inputText)
    let roundId

    fetch(`/api/get-round-id/${roomId}/${round}`)
      .then(response => {
        if (response.ok) {
          return response.json() // Parse the JSON response if successful
        } else {
          throw new Error(`Failed to fetch round ID for round ${round}`) // Throw an error if response not OK
        }
      })
      .then(data => {
        if (data.success) {
          roundId = data.roundID

          // First, perform the initial POST request to add round objects.
          fetch(`/api/add-description/${userId}/${roundId}/${inputText}`, {
            method: 'POST'
          })
            .then(response => {
              if (response.ok) {
                return response.json() // Parsing the JSON response if successful
              } else {
                throw new Error('Failed to add rounds.') // Throw error if response not OK
              }
            })
            .then(() => {
              round = Number(round) + 1
              // increment round players
              fetch(`/api/increment-round-players/${roomId}/${round}`, {
                method: 'POST'
              })
                .then(response => {
                  if (response.ok) {
                    return response.json() // Parsing the JSON response if successful
                  } else {
                    throw new Error('Failed to add rounds.') // Throw error if response not OK
                  }
                })
                .then(() => {
                  window.location.href = `/drawing?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(userId)}&round=${encodeURIComponent(round)}`
                })
            })
        } else {
          console.error('Fetch successful but API returned an error for round:', round)
        }
      })
      .catch(error => {
        console.error('Error fetching round ID for round', round, ':', error)
      })
  })
})
