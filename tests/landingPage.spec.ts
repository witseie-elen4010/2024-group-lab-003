import { test, expect } from '@playwright/test'

test('Landing Page - Verify Navigation to Landing Page', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible() // Assuming there is a heading on the landing page that says "Welcome"
})

// test('Landing Page - Navigate to Create Room and Verify', async ({ page }) => {
//   await page.goto('http://localhost:3000/')
//   await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
//   await page.getByRole('button', { name: 'Create' }).click()
//   await expect(page.getByRole('heading', { name: 'Create A Room!' })).toBeVisible() // Assuming the heading on the create room page says "Create A Room!"
// })

// test('Landing Page - Navigate to Join Room and Verify', async ({ page }) => {
//   await page.goto('http://localhost:3000/')
//   await expect(page.getByRole('button', { name: 'Join' })).toBeVisible()
//   await page.getByRole('button', { name: 'Join' }).click()
//   await expect(page.getByRole('heading', { name: 'Join Game' })).toBeVisible() // Verifying the heading on the join game page
// })
