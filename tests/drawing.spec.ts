import { test, expect } from '@playwright/test'

test('Drawing Page - Verify Canvas Load', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await expect(page.locator('#drawingCanvas')).toBeVisible()
})

test('Drawing Page - Draw Initial Point', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await page.locator('#drawingCanvas').click({
    position: {
      x: 180,
      y: 130
    }
  })
  // Verify drawing initiation at this point, if possible.
})

test('Drawing Page - Draw Line Slightly Up and Right', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await page.locator('#drawingCanvas').click({
    position: {
      x: 187,
      y: 137
    }
  })
  // Check for a line segment that extends slightly up and to the right.
})

test('Drawing Page - Draw Line Down and Right', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await page.locator('#drawingCanvas').click({
    position: {
      x: 276,
      y: 211
    }
  })
  // Confirm the line extends downward and to the right, indicating a larger move.
})

test('Drawing Page - Draw Line Slightly Up', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await page.locator('#drawingCanvas').click({
    position: {
      x: 275,
      y: 202
    }
  })
  // Verify a subtle upward stroke completes this segment.
})

test('Drawing Page - Save Image', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await expect(page.getByRole('button', { name: 'Save Drawing' })).toBeVisible()
  await page.locator('#drawingCanvas').click({
    position: {
      x: 478,
      y: 135
    }
  })
})

test('Drawing Page - Submit image', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await expect(page.getByRole('heading', { name: 'Begin your book by drawing' })).toBeVisible()
  await page.locator('#drawingCanvas').click({
    position: {
      x: 287,
      y: 237
    }
  })
  await page.locator('#drawingCanvas').click({
    position: {
      x: 351,
      y: 241
    }
  })
  await page.locator('#drawingCanvas').click({
    position: {
      x: 328,
      y: 341
    }
  })
  await page.locator('#drawingCanvas').click({
    position: {
      x: 246,
      y: 331
    }
  })
  await page.getByRole('button', { name: 'Submit Drawing' }).click()
  await page.locator('body').click()
})

test('Drawing Page - Undo, Redo and clear buttons', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Redo' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible()
  await page.locator('#drawingCanvas').click({
    position: {
      x: 271,
      y: 143
    }
  })
  await expect(page.locator('#drawingCanvas')).toBeVisible()
  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(page.locator('#drawingCanvas')).toBeVisible()
})

test('Drawing Page - Testing Color Palette', async ({ page }) => {
  await page.goto('http://localhost:3000/drawing')
  await expect(page.locator('#colorPicker')).toBeVisible()
  await page.locator('#colorPicker').click()
  await page.locator('#colorPicker').fill('#000000')
  await page.locator('#drawingCanvas').click({
    position: {
      x: 91,
      y: 137
    }
  })
  await expect(page.locator('#colorPicker')).toHaveValue('#000000')
  await page.locator('#colorPicker').click()
})
