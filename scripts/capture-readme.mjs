import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'
import { createServer } from 'vite'
import { defaultCategories, defaultGalleryCategories } from '../src/utils/appState.js'
import { createDefaultNPC, createParticipantFromNPC } from '../src/utils/npcUtils.js'

const projectRoot = resolve(import.meta.dirname, '..')
const outputDir = resolve(projectRoot, 'docs/screenshots')
const now = '2026-11-11T20:00:00.000Z'

const npcs = [
  createDefaultNPC({ id: 'demo-helena', name: 'Helena Azevedo', clan: 'Ventrue', concept: 'Regente da noite', categoryId: 'cat-camarilla', description: 'Diplomata e guardiã de segredos.' }),
  createDefaultNPC({ id: 'demo-caio', name: 'Caio Brandão', clan: 'Brujah', concept: 'Agitador', categoryId: 'cat-anarchs', description: 'Voz das ruas.' }),
  createDefaultNPC({ id: 'demo-iris', name: 'Íris Nogueira', clan: 'Toreador', concept: 'Curadora de arte', categoryId: 'cat-camarilla', description: 'Coleciona histórias esquecidas.' }),
]

const state = {
  categories: defaultCategories,
  npcs,
  sceneCurrent: {
    participants: [
      createParticipantFromNPC(npcs[0]),
    ],
    currentTurnIndex: 0,
    round: 2,
    isMinimized: false,
  },
  sceneSaved: [],
  notes: [{
    id: 'demo-note',
    title: 'Sessão 04 · O convite',
    content: 'A corte se reúne à meia-noite.\n\n• Quem enviou o convite anônimo?\n• Helena conhece a origem do selo.\n• Caio espera uma resposta antes do amanhecer.',
    createdAt: now,
    updatedAt: now,
  }],
  settings: {},
  gallery: [],
  galleryCategories: defaultGalleryCategories,
}

process.env.VITE_AUTH_BACKEND = 'legacy'
process.env.VITE_DATA_BACKEND = 'legacy'

await mkdir(outputDir, { recursive: true })
const vite = await createServer({
  root: projectRoot,
  server: { host: '127.0.0.1', port: 4182, strictPort: true },
})
let browser

try {
  await vite.listen()
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
    locale: 'pt-BR',
  })
  await context.route('**/api/auth/me', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      user: { id: 'demo-narrador', email: 'demo@example.org', displayName: 'Narrador Demo' },
      state,
    }),
  }))
  await context.route('**/api/state', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ state }),
  }))
  await context.route('**/api/images/**', (route) => route.fulfill({ status: 404 }))

  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4182/', { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Biblioteca do Narrador' }).waitFor()
  await page.screenshot({ path: resolve(outputDir, 'biblioteca-e-turnos.png') })

  const nav = page.getByRole('navigation')
  await nav.getByRole('button', { name: /Referencia/ }).click()
  await page.getByRole('heading', { name: 'Arquivo de Regras V5' }).waitFor()
  await page.screenshot({ path: resolve(outputDir, 'referencia-rapida.png') })

  await nav.getByRole('button', { name: /Notas/ }).click()
  await page.getByRole('heading', { name: 'Registro de Sessao' }).waitFor()
  await page.screenshot({ path: resolve(outputDir, 'notas-de-sessao.png') })
} finally {
  await browser?.close()
  await vite.close()
}
