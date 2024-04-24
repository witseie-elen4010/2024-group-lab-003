import { test, expect } from '@playwright/test'

test('Landing page appears and can route to create and join', async ({ page }) => {
  // Navigate to the home page
  await page.goto('http://localhost:3000/')
  // Wait for the 'Create' button to be visible and clickable
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
  await page.getByRole('button', { name: 'Create' }).click()

  // Navigate back to the home page
  await page.goto('http://localhost:3000/')
  // Wait for the 'Join' button to be visible and clickable
  await expect(page.getByRole('button', { name: 'Join' })).toBeVisible()
  await page.getByRole('button', { name: 'Join' }).click()

  // Check if the heading on the join page is visible
  await expect(page.getByRole('heading', { name: 'Join Game' })).toBeVisible()
})
