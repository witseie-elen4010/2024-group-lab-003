document.addEventListener('DOMContentLoaded', function () {
  async function populateUserActionsTable () {
    try {
      const response = await fetch('/api/get-all-roomplayers') // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error('Failed to load user actions.')
      }
      const data = await response.json()
      console.log(data.players)
      const table = document.getElementById('logsTable').getElementsByTagName('tbody')[0]

      data.players.forEach(log => {
        const row = table.insertRow()
        let action = 'No action' // Default action

        if (log.isAdmin === true) {
          action = 'Created a Game' // Only change action if isAdmin is true
        } else {
          action = 'Joined a Game' // Only change action if isAdmin is false
        }
        row.insertCell(0).textContent = 'temp date' // Ensure you replace 'temp date' with actual data if available
        row.insertCell(1).textContent = action
        row.insertCell(2).textContent = log.email || 'No email provided' // Updated to provide a default email message
      })
    } catch (error) {
      console.error('Error loading user actions:', error)
    }
  }

  populateUserActionsTable()
})
