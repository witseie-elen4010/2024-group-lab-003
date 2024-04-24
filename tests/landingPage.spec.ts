import { test, expect, chromium } from '@playwright/test'

test('Landing page appears and can route to create and join', async ({ page }) => {
  const browser = await chromium.launch({ headless: false }) // Launch the browser in non-headless mode
  const context = await browser.newContext()
  page = await context.newPage()
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Create' }).click()
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Join' }).click()
  // await expect(page.getByRole('heading', { name: 'Join Game' })).toBeVisible()
})
