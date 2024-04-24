import { test, expect, chromium } from '@playwright/test'

test('Admin Player who creates a room appears in the room players', async ({ page }) => {
  const browser = await chromium.launch({ headless: false }) // Launch the browser in non-headless mode
  const context = await browser.newContext()
  page = await context.newPage()
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByPlaceholder('Enter your nickname').click()
  await page.getByPlaceholder('Enter your nickname').fill('Stephen')
  await page.getByRole('button', { name: 'Create Room' }).click()
  await expect(page.getByRole('link', { name: 'Stephen' })).toBeVisible()
})
