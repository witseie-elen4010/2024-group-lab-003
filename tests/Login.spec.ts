import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('localhost:3000/')
  await page.getByLabel('Email address*').click()
  await page.getByLabel('Email address*').fill('akivalevitt8@gmail.com')
  await page.getByLabel('Password*').click()
})
