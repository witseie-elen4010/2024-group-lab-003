import { test, expect } from '@playwright/test'

test('Create Room Page - Verify Heading Visibility', async ({ page }) => {
  await page.goto('http://localhost:3000/create')
  await expect(page.getByRole('heading', { name: 'Create A Room!' })).toBeVisible()
})

test('Create Room Page - Verify Nickname Label Visibility', async ({ page }) => {
  await page.goto('http://localhost:3000/create')
  await expect(page.getByText('Nickname:')).toBeVisible()
})

test('Create Room Page - Verify Nickname Input Visibility', async ({ page }) => {
  await page.goto('http://localhost:3000/create')
  await expect(page.getByPlaceholder('Enter your nickname')).toBeVisible()
})

test('Create Room Page - Verify Create Room Button Visibility', async ({ page }) => {
  await page.goto('http://localhost:3000/create')
  await expect(page.getByRole('button', { name: 'Create Room' })).toBeVisible()
})
