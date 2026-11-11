import { expect, test } from '@playwright/test'

const emptyState = {
  categories: [],
  npcs: [],
  sceneCurrent: {
    participants: [],
    currentTurnIndex: 0,
    round: 1,
    isMinimized: false,
  },
  sceneSaved: [],
  notes: [],
  settings: {},
  gallery: [],
  galleryCategories: [],
}

async function mockLoggedOut(page) {
  await page.context().route('**/api/auth/me', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Sessao ausente.' }),
    }),
  )
}

async function mockLoggedInGm(page) {
  await page.context().route('**/api/auth/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'gm-e2e',
          email: 'narradora@example.com',
          displayName: 'Narradora E2E',
        },
        state: emptyState,
      }),
    }),
  )

  await page.context().route('**/api/state', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ state: emptyState }),
    }),
  )

  await page.context().route('**/api/images/**', (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Imagem de teste ausente.' }),
    }),
  )
}

test('visitante encontra as opcoes de entrar e criar conta', async ({ page }) => {
  await mockLoggedOut(page)
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'V5' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Entrar', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Criar conta' })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Senha')).toBeVisible()
})

test('mestre autenticado abre o dossie e o formulario de NPC', async ({ page }) => {
  await mockLoggedInGm(page)
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Biblioteca do Narrador' }),
  ).toBeVisible()
  await expect(page.getByText('Narradora E2E')).toBeVisible()

  await page.getByRole('button', { name: 'Criar NPC' }).click()

  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible()
})

test('rastreador preserva o turno ao remover e recupera uma cena salva', async ({ page }) => {
  await mockLoggedInGm(page)
  await page.goto('/')

  await expect(page.getByRole('button', { name: /Bancada VTT/ })).toHaveCount(0)
  const tracker = page.getByRole('complementary', { name: 'Rastreador de turnos' })

  for (const name of ['Alice', 'Bruno']) {
    await tracker.getByRole('button', { name: 'Adicionar PC' }).click()
    const form = tracker.locator('form')
    await form.getByLabel('Nome').fill(name)
    await form.getByRole('button', { name: 'Adicionar', exact: true }).click()
  }

  const alice = tracker.locator('article').filter({ hasText: 'Alice' })
  const bruno = tracker.locator('article').filter({ hasText: 'Bruno' })
  await expect(alice).toHaveAttribute('aria-current', 'step')
  await tracker.getByRole('button', { name: 'Proximo Turno' }).click()
  await expect(bruno).toHaveAttribute('aria-current', 'step')
  await alice.getByRole('button', { name: 'Remover' }).click()
  await expect(bruno).toHaveAttribute('aria-current', 'step')

  await tracker.getByLabel('Nome da cena').fill('Encontro')
  await tracker.getByRole('button', { name: 'Salvar' }).click()
  page.once('dialog', (dialog) => dialog.accept())
  await tracker.getByRole('button', { name: 'Limpar' }).click()
  await expect(bruno).toHaveCount(0)
  await tracker.getByLabel('Cenas salvas').selectOption({ label: 'Encontro' })
  await expect(bruno).toBeVisible()
  await expect(bruno).toHaveAttribute('aria-current', 'step')
})
