import { test, expect } from '@playwright/test'

test('Regular Players Waiting Room Has A Waiting For Admin Buffer and Does Not Have A Start Button', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.getByRole('button', { name: 'Join' })).toBeVisible()
  await page.getByRole('button', { name: 'Join' }).click()

  await expect(page.getByPlaceholder('Enter your nickname')).toBeVisible()
  await page.getByPlaceholder('Enter your nickname').fill('Tree')

  await expect(page.getByPlaceholder('Enter game code')).toBeVisible()
  await page.getByPlaceholder('Enter game code').fill('paQmhP')

  await page.getByRole('button', { name: 'Join Game' }).click()

  // Check for the buffer message visibility and absence of the 'Start Game' button
  await expect(page.locator('div', { hasText: 'Waiting for the admin to' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start Game' })).not.toBeVisible()
})

test('For an Admin Player, the start button appears', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
  await page.getByRole('button', { name: 'Create' }).click()

  await expect(page.getByPlaceholder('Enter your nickname')).toBeVisible()
  await page.getByPlaceholder('Enter your nickname').fill('Test')

  await page.getByRole('button', { name: 'Create Room' }).click()

  // Confirm the visibility of the 'Start Game' button
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible()
})

test('When the admin player starts the game, the drawing page appears', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
  await page.getByRole('button', { name: 'Create' }).click()

  await expect(page.getByPlaceholder('Enter your nickname')).toBeVisible()
  await page.getByPlaceholder('Enter your nickname').fill('Test')

  await page.getByRole('button', { name: 'Create Room' }).click()

  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible()
  await page.getByRole('button', { name: 'Start Game' }).click()

  // Check if the drawing canvas is visible after starting the game
  await expect(page.locator('#drawingCanvas')).toBeVisible()
})
