// import { test, expect } from '@playwright/test'

// test('Waiting Room Page - Verify Navigation and URL Parameters', async ({ page }) => {
//   await page.goto('http://localhost:3000/waitingRoom?roomCode=h7D8fT&userId=6629642d4aa81461da6042fe')
//   await expect(page.url()).toContain('roomCode=h7D8fT')
//   await expect(page.url()).toContain('userId=6629642d4aa81461da6042fe')
// })

// test('Waiting Room Page - Verify Room Code Visibility', async ({ page }) => {
//   await page.goto('http://localhost:3000/waitingRoom?roomCode=h7D8fT&userId=6629642d4aa81461da6042fe')
//   await expect(page.getByRole('heading', { name: 'Room Code: h7D8fT' })).toBeVisible()
// })

// test('Waiting Room Page - Verify Players Heading Visibility', async ({ page }) => {
//   await page.goto('http://localhost:3000/waitingRoom?roomCode=h7D8fT&userId=6629642d4aa81461da6042fe')
//   await expect(page.getByRole('heading', { name: 'Players' })).toBeVisible()
// })
