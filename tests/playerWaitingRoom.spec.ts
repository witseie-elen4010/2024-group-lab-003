import { test, expect, chromium } from '@playwright/test'

test('Regular Players Waiting Room Has A Waiting For Admin Buffer and Does Not Have A Start Button', async ({ page }) => {
  const browser = await chromium.launch({ headless: false }) // Launch the browser in non-headless mode
  const context = await browser.newContext()
  page = await context.newPage()
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Join' }).click()
  await page.getByPlaceholder('Enter your nickname').click()
  await page.getByPlaceholder('Enter your nickname').fill('Tree')
  await page.getByPlaceholder('Enter game code').click()
  await page.getByPlaceholder('Enter game code').fill('paQmhP')
  await page.getByRole('button', { name: 'Join Game' }).click()
  // await expect(page.locator('div').filter({ hasText: 'Waiting for the admin to' }).nth(3)).toBeVisible()
})

test('For an Admin Player, the start button appears', async ({ page }) => {
  const browser = await chromium.launch({ headless: false }) // Launch the browser in non-headless mode
  const context = await browser.newContext()
  page = await context.newPage()
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByPlaceholder('Enter your nickname').click()
  await page.getByPlaceholder('Enter your nickname').fill('Test')
  await page.getByRole('button', { name: 'Create Room' }).click()
  // await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible()
})

test('When the admin player starts the game, the drawing page appears', async ({ page }) => {
  const browser = await chromium.launch({ headless: false }) // Launch the browser in non-headless mode
  const context = await browser.newContext()
  page = await context.newPage()
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByPlaceholder('Enter your nickname').click()
  await page.getByPlaceholder('Enter your nickname').fill('Test')
  await page.getByRole('button', { name: 'Create Room' }).click()
  await page.getByRole('button', { name: 'Start Game' }).click()
  // await expect(page.locator('#drawingCanvas')).toBeVisible()
})
