import { test, expect } from '@playwright/test'

test('All elements on landing page is visable', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByLabel('Email address*').click()
  await page.getByLabel('Email address*').fill('dsad@gmail.com')
  await page.getByLabel('Password*').click()
  await page.getByLabel('Password*').fill('sdfdJJH!!222')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Join' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'View Logs' })).toBeVisible()
  await expect(page.locator('#createButton')).toContainText('Create')
  await expect(page.locator('#joinButton')).toContainText('Join')
  await expect(page.locator('#log-button')).toContainText('View Logs')
})
