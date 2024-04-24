import { test, expect } from '@playwright/test'

test('drawing page appears and user can draw', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  // Ensure the canvas is ready and interactable before starting to draw
  await expect(page.locator('#drawingCanvas')).toBeVisible()

  // Click to draw on the canvas at different positions
  await page.locator('#drawingCanvas').click({ position: { x: 180, y: 130 } })
  await page.locator('#drawingCanvas').click({ position: { x: 187, y: 137 } })
  await page.locator('#drawingCanvas').click({ position: { x: 276, y: 211 } })
  await page.locator('#drawingCanvas').click({ position: { x: 275, y: 202 } })

  // Example check: You could add assertions here to verify changes in the canvas
  // For instance, check if the canvas has the expected color or pixel data at a click position
})
