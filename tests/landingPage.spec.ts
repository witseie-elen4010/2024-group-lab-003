import { test, expect } from '@playwright/test'

test('Landing page appears and can route to create and join', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Create' }).click()
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Join' }).click()
  // await expect(page.getByRole('heading', { name: 'Join Game' })).toBeVisible()
})
