import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeAppState, normalizeScene } from '../src/utils/appState.js'
import { normalizeNPC, applyNPCUpdates, DAMAGE_STATES } from '../src/utils/npcUtils.js'
import { normalizeAppState as normalizeServerState } from '../server/appState.js'

test('rastreador mantém participantes válidos e limita turno e rodada', () => {
  const participants = [{ id: 'alice' }, { id: 'bruno' }]
  assert.deepEqual(normalizeScene({ participants, currentTurnIndex: 9, round: -3 }), {
    participants,
    currentTurnIndex: 1,
    round: 1,
    isMinimized: false,
  })
  assert.equal(normalizeScene({ participants: [], currentTurnIndex: 3 }).currentTurnIndex, 0)
})

test('estado preserva cenas do rastreador e descarta dados da bancada removida', () => {
  const state = normalizeAppState({
    sceneCurrent: { participants: [{ id: 'alice' }], currentTurnIndex: 0, round: 2 },
    sceneSaved: [{ id: 'scene-one', name: 'Encontro' }],
    vtt: { scenes: [{ id: 'old-map' }] },
  })
  assert.equal(state.sceneCurrent.participants[0].id, 'alice')
  assert.equal(state.sceneSaved[0].name, 'Encontro')
  assert.equal(Object.hasOwn(state, 'vtt'), false)
  assert.equal(Object.hasOwn(normalizeServerState({ ...state, vtt: { scenes: [] } }), 'vtt'), false)
})

test('ficha antiga de NPC conserva dano e não volta a salvar campo da bancada', () => {
  const npc = normalizeNPC({
    id: 'npc-one',
    type: 'vampire',
    name: 'Helena',
    attributes: { stamina: 2, composure: 2, resolve: 2 },
    vttConditions: { superficialDamage: 1, aggravatedDamage: 0, hunger: 2 },
  })
  assert.equal(npc.healthBoxes[0], DAMAGE_STATES.superficial)
  assert.equal(npc.hunger, 2)
  assert.equal(Object.hasOwn(npc, 'vttConditions'), false)

  const updated = applyNPCUpdates(npc, { healthBoxes: [DAMAGE_STATES.aggravated, ...npc.healthBoxes.slice(1)] })
  assert.equal(updated.healthBoxes[0], DAMAGE_STATES.aggravated)
  assert.equal(Object.hasOwn(updated, 'vttConditions'), false)
})
