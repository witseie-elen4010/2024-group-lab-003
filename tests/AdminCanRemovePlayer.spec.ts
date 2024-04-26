import { test, expect } from '@playwright/test'

test('test user can be added', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Join' }).click()
  await page.getByPlaceholder('Enter your nickname').click()
  await page.getByPlaceholder('Enter your nickname').fill('Akiva')
  await page.getByPlaceholder('Enter game code').click()
  await page.getByPlaceholder('Enter game code').fill('4b9TsP')
  await page.getByRole('button', { name: 'Join Game' }).click()
  await expect(page.getByRole('link', { name: 'Akiva' })).toBeVisible()
})

test('test admin can remove player', async ({ page }) => {
  await page.goto('http://localhost:3000/waitingRoom?roomCode=4b9TsP&userId=662b895d8e24fec2f2962dcb')

  await page.waitForTimeout(10000)

  // Ensure the player 'Akiva' is visible
  const playerLink = page.locator('text=Akiva')
  let akiva = 0
  try {
    await expect(playerLink).toBeVisible()
    akiva = 1
  } catch {
    akiva = 0
  }
  await expect(akiva).toBe(1)

  // Click to simulate removing 'Akiva'
  await playerLink.click()

  await page.waitForTimeout(2000)
  try {
    await expect(playerLink).toBeVisible()
    akiva = 1
  } catch {
    akiva = 0
  }
  await expect(akiva).toBe(0)
})
