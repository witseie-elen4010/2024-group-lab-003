import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/description')
  await expect(page.getByPlaceholder('Give your discription here')).toBeVisible()
  await page.getByPlaceholder('Give your discription here').click()
  await page.getByPlaceholder('Give your discription here').fill('a bird in a plane')
  await page.getByRole('button', { name: 'Submit' }).click()
})
