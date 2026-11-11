import { expect, test } from '@playwright/test'
import { Buffer } from 'node:buffer'

function npc(name, id = name.toLowerCase().replaceAll(' ', '-')) {
  return {
    id,
    name,
    type: 'vampire',
    attributes: { strength: 2, dexterity: 2, stamina: 2 },
  }
}

function appState(npcs = []) {
  return {
    categories: [],
    npcs,
    sceneCurrent: { participants: [], currentTurnIndex: 0, round: 1, isMinimized: false },
    sceneSaved: [],
    notes: [],
    settings: {},
    gallery: [],
    galleryCategories: [],
  }
}

async function mockLoggedInGm(page, initialNpcs = []) {
  const state = appState(initialNpcs)

  await page.route('**/api/auth/me', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      user: { id: 'gm-e2e', email: 'narradora@example.com', displayName: 'Narradora E2E' },
      state,
    }),
  }))
  await page.route('**/api/state', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ state }),
  }))
}

test('importa vários arquivos e coleções de NPCs no mesmo lote', async ({ page }) => {
  await mockLoggedInGm(page)
  await page.goto('/')

  await page.getByRole('button', { name: 'Importar', exact: true }).click()
  await page.getByRole('button', { name: /Importar lote de fichas/ }).click()

  await page.locator('input[type="file"][multiple]').setInputFiles([
    {
      name: 'individual.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({ npc: npc('Alice') })),
    },
    {
      name: 'colecao.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({ npcs: [npc('Bruno'), npc('Carla')] })),
    },
  ])

  await expect(page.getByRole('heading', { name: 'Alice' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bruno' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Carla' })).toBeVisible()
  await expect(page.getByText('3 NPCs importados.')).toBeVisible()
})

test('exclui a ficha mesmo quando a limpeza da imagem legada falha', async ({ page }) => {
  await mockLoggedInGm(page, [npc('NPC removível', 'npc-delete')])
  await page.route('**/api/images/**', (route) => route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'Armazenamento legado indisponível.' }),
  }))
  await page.goto('/')

  page.on('dialog', (dialog) => dialog.accept())
  await page.locator('button[aria-label="Abrir menu do NPC"]').click()
  await page.getByRole('button', { name: 'Deletar', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'NPC removível' })).toHaveCount(0)
  await expect(page.getByText('NPC removido da biblioteca.')).toBeVisible()
})
