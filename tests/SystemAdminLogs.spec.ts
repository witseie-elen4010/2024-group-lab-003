import { test, expect } from '@playwright/test'

test('A system admin can log in, and enter the password and view the log page', async ({ page }) => {
  await page.goto('localhost:3000')
  await page.getByLabel('Email address*').click()
  await page.getByLabel('Email address*').fill('akivalevitt8@gmail.com')
  await page.getByLabel('Password*').click()
  await page.getByLabel('Password*').fill('5wQdJZqA4XiUMFm')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.goto('http://localhost:3000/logs')
  await expect(page.getByRole('heading', { name: 'User Action Logs' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Date and Time' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Nature of the Action' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'User Email' })).toBeVisible()
  await expect(page.locator('thead')).toContainText('Date and Time')
  await expect(page.locator('thead')).toContainText('Nature of the Action')
  await expect(page.getByText('Doodles All The Way Down Home')).toBeVisible()
})
