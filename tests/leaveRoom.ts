import { test, expect } from '@playwright/test'

test('Verify Leave Room button is visible and correctly labeled in the Waiting Room', async ({ page }) => {
  await page.goto('http://localhost:3000/waitingRoom?roomCode=i0lWtE&userId=662aa9676bec78a0ed29fd15')
  await expect(page.locator('#leaveRoomButton')).toContainText('Leave Room')
  await expect(page.getByRole('button', { name: 'Leave Room' })).toBeVisible()
})
