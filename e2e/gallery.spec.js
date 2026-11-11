import { Buffer } from 'node:buffer'
import { expect, test } from '@playwright/test'

const emptyState = {
  categories: [],
  npcs: [],
  sceneCurrent: { participants: [], currentTurnIndex: 0, round: 1, isMinimized: false },
  sceneSaved: [],
  notes: [],
  settings: {},
  gallery: [],
  galleryCategories: [],
}

async function mockLoggedInGm(page) {
  await page.route('**/api/auth/me', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      user: { id: 'gm-e2e', email: 'narradora@example.com', displayName: 'Narradora E2E' },
      state: emptyState,
    }),
  }))
  await page.route('**/api/state', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ state: emptyState }),
  }))
}

test('salva uma imagem na galeria pelo backend legado quando ele está ativo', async ({ page }) => {
  await mockLoggedInGm(page)
  let uploadedImage = false
  await page.route('**/api/images/**', async (route) => {
    if (route.request().method() === 'PUT') {
      uploadedImage = true
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
      return
    }
    await route.fulfill({ status: 404, contentType: 'application/json', body: '{}' })
  })
  await page.goto('/')

  await page.getByRole('button', { name: 'Galeria' }).click()
  await page.getByRole('button', { name: 'Adicionar Imagem' }).click()
  await page.locator('input[type="file"]').setInputFiles({
    name: 'elísio.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64',
    ),
  })
  await page.getByPlaceholder('Ex: Mapa de Seattle').fill('Elísio')
  await page.getByRole('main').getByRole('button', { name: 'Salvar', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Elísio' })).toBeVisible()
  expect(uploadedImage).toBe(true)
})
