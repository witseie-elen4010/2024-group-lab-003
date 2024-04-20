import { test } from '@playwright/test'

test('drawing page appears and user can draw', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await page.locator('#drawingCanvas').click({
    position: {
      x: 180,
      y: 130
    }
  })
  await page.locator('#drawingCanvas').click({
    position: {
      x: 187,
      y: 137
    }
  })
  await page.locator('#drawingCanvas').click({
    position: {
      x: 276,
      y: 211
    }
  })
  await page.locator('#drawingCanvas').click({
    position: {
      x: 275,
      y: 202
    }
  })
})
