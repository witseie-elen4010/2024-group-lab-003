document.addEventListener('DOMContentLoaded', function () {
  async function populateUserActionsTable () {
    try {
      const response = await fetch('/api/get-all-roomplayers') // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error('Failed to load user actions.')
      }
      const data = await response.json()
      // console.log(data.players)
      const table = document.getElementById('logsTable').getElementsByTagName('tbody')[0]

      data.players.forEach(log => {
        const row = table.insertRow()

        // Create a hidden input to store the raw createTime
        const hiddenInput = document.createElement('input')
        hiddenInput.type = 'hidden'
        hiddenInput.value = log.createTime // Store raw createTime

        let action = 'No action' // Default action

        if (log.isAdmin === true) {
          action = 'Created a Game' // Only change action if isAdmin is true
        } else {
          action = 'Joined a Game' // Only change action if isAdmin is false
        }
        // Assuming log.createTime is in ISO 8600 format from Date.now()
        const utcDate = new Date(log.createTime) // Converts the string to a Date object
        const options = {
          timeZone: 'Africa/Johannesburg', // Sets the timezone to South African Time
          year: 'numeric',
          month: 'long', // Example: 'May'
          day: 'numeric',
          hour: '2-digit', // 24-hour format
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Specify whether to use 12-hour time or 24-hour time
        }

        // Format the date and time according to the specified options
        const formattedDate = new Intl.DateTimeFormat('en-ZA', options).format(utcDate)

        // Insert the formatted date into the table cell
        row.insertCell(0).textContent = formattedDate
        row.insertCell(1).textContent = action
        row.insertCell(2).textContent = log.email || 'No email provided' // Updated to provide a default email message
      })
    } catch (error) {
      console.error('Error loading user actions:', error)
    }
  }

  async function loadDrawings () {
    try {
      const response = await fetch('/api/get-all-drawings') // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error('Failed to load drawings.')
      }
      const data = await response.json()

      const table = document.getElementById('logsTable').getElementsByTagName('tbody')[0]
      if (!table) {
        throw new Error('Table not found in the DOM.')
      }

      data.drawings.forEach(drawing => {
        // Check if createTime is valid
        if (!drawing.createTime) {
          console.error('Invalid createTime:', drawing.createTime)
          return // Skip this iteration if createTime is null or undefined
        }

        // Create a hidden input to store the raw createTime
        const hiddenInput = document.createElement('input')
        hiddenInput.type = 'hidden'
        hiddenInput.value = drawing.createTime // Store raw createTime

        const utcDate = new Date(drawing.createTime) // Converts the string to a Date object
        if (isNaN(utcDate.getTime())) {
          console.error('Invalid date:', drawing.createTime)
          return // Skip this iteration if the date is invalid
        }

        const options = {
          timeZone: 'Africa/Johannesburg', // Sets the timezone to South African Time
          year: 'numeric',
          month: 'long', // Example: 'May'
          day: 'numeric',
          hour: '2-digit', // 24-hour format
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Specify whether to use 12-hour time or 24-hour time
        }

        // Format the date and time according to the specified options
        const formattedDate = new Intl.DateTimeFormat('en-ZA', options).format(utcDate)

        const row = table.insertRow()
        row.insertCell(0).textContent = formattedDate
        row.insertCell(1).textContent = 'Drew an Image'
        row.insertCell(2).textContent = drawing.email || 'No email provided' // Updated to provide a default email message
      })
    } catch (error) {
      console.error('Error loading drawings:', error)
    }
  }

  async function loadUsers () {
    try {
      const response = await fetch('/api/get-all-users') // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error('Failed to load users.')
      }
      const data = await response.json()

      const table = document.getElementById('logsTable').getElementsByTagName('tbody')[0]
      if (!table) {
        throw new Error('Table not found in the DOM.')
      }

      data.users.forEach(user => {
        // Check if createTime is valid
        if (!user.createTime) {
          console.error('Invalid createTime:', user.createTime)
          return // Skip this iteration if createTime is null or undefined
        }

        // Create a hidden input to store the raw createTime
        const hiddenInput = document.createElement('input')
        hiddenInput.type = 'hidden'
        hiddenInput.value = user.createTime // Store raw createTime

        const utcDate = new Date(user.createTime) // Converts the string to a Date object
        if (isNaN(utcDate.getTime())) {
          console.error('Invalid date:', user.createTime)
          return // Skip this iteration if the date is invalid
        }

        const options = {
          timeZone: 'Africa/Johannesburg', // Sets the timezone to South African Time
          year: 'numeric',
          month: 'long', // Example: 'May'
          day: 'numeric',
          hour: '2-digit', // 24-hour format
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Specify whether to use 12-hour time or 24-hour time
        }

        // Format the date and time according to the specified options
        const formattedDate = new Intl.DateTimeFormat('en-ZA', options).format(utcDate)

        const row = table.insertRow()
        row.insertCell(0).textContent = formattedDate
        row.insertCell(1).textContent = 'User Account Created'
        row.insertCell(2).textContent = user.email || 'No email provided' // Provide a default email message if none is available
      })
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  async function loadTextings () {
    try {
      const response = await fetch('/api/get-all-textings') // Adjust the API endpoint as needed
      if (!response.ok) {
        throw new Error('Failed to load textings.')
      }
      const data = await response.json()

      const table = document.getElementById('logsTable').getElementsByTagName('tbody')[0]
      if (!table) {
        throw new Error('Table not found in the DOM.')
      }

      data.textings.forEach(texting => {
        // Create a hidden input to store the raw createTime
        const hiddenInput = document.createElement('input')
        hiddenInput.type = 'hidden'
        hiddenInput.value = texting.createTime // Store raw createTime
        // Check if createTime is valid
        if (!texting.createTime) {
          console.error('Invalid createTime:', texting.createTime)
          return // Skip this iteration if createTime is null or undefined
        }

        const utcDate = new Date(texting.createTime) // Converts the string to a Date object
        if (isNaN(utcDate.getTime())) {
          console.error('Invalid date:', texting.createTime)
          return // Skip this iteration if the date is invalid
        }

        const options = {
          timeZone: 'Africa/Johannesburg', // Sets the timezone to South African Time
          year: 'numeric',
          month: 'long', // Example: 'May'
          day: 'numeric',
          hour: '2-digit', // 24-hour format
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Specify whether to use 12-hour time or 24-hour time
        }

        // Format the date and time according to the specified options
        const formattedDate = new Intl.DateTimeFormat('en-ZA', options).format(utcDate)

        const row = table.insertRow()
        row.insertCell(0).textContent = formattedDate
        row.insertCell(1).textContent = 'Wrote A Description'
        row.insertCell(2).textContent = texting.email || 'No email provided' // Updated to provide a default email message
      })

      // sortTableByDate()
    } catch (error) {
      console.error('Error loading textings:', error)
    }
  }
  async function sortTableByDate () {
    const table = document.getElementById('logsTable').getElementsByTagName('tbody')[0]
    const rows = Array.from(table.rows)

    // Sort the rows based on the hidden input's value (raw createTime)
    rows.sort((a, b) => {
      const dateA = a.cells[0].querySelector('input[type="hidden"]').value
      const dateB = b.cells[0].querySelector('input[type="hidden"]').value
      return new Date(dateA) - new Date(dateB)
    })

    // Re-attach rows to the table body in sorted order
    rows.forEach(row => table.appendChild(row))
  }

  populateUserActionsTable()
  loadDrawings()
  loadTextings()
  loadUsers()
  sortTableByDate()
})
