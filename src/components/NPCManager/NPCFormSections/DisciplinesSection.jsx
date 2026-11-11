import { nanoid } from 'nanoid'
import { Plus, Trash2 } from 'lucide-react'
import { disciplines } from '../../../data/disciplines.js'
import { vtmV5System } from '../../../systems/vtm-v5'
import { normalizeDisciplinePowers } from '../../../utils/npcUtils.js'
import DotRating from '../../common/DotRating.jsx'
import styles from '../NPCManager.module.css'

const catalogKeysByNpcDiscipline = {
  Animalismo: 'animalism',
  Auspicios: 'auspex',
  Celeridade: 'celerity',
  Dominacao: 'dominate',
  Fortaleza: 'fortitude',
  Ofuscacao: 'obfuscate',
  Potencia: 'potence',
  Presenca: 'presence',
  Proteismo: 'protean',
  'Feiticaria de Sangue': 'blood sorcery',
  Oblivion: 'oblivion',
}

function DisciplinesSection({ formData, onChange }) {
  function updateDisciplines(nextDisciplines) {
    onChange({ disciplines: nextDisciplines })
  }

  function addDiscipline() {
    updateDisciplines([
      ...formData.disciplines,
      { id: nanoid(), name: disciplines[0]?.name ?? '', level: 1, powers: [], notes: '' },
    ])
  }

  function updateDiscipline(id, updates) {
    updateDisciplines(
      formData.disciplines.map((discipline) =>
        discipline.id === id ? { ...discipline, ...updates } : discipline,
      ),
    )
  }

  function addPower(discipline) {
    updateDiscipline(discipline.id, {
      powers: [
        ...normalizeDisciplinePowers(discipline.powers, { keepEmpty: true }),
        { id: nanoid(), name: '', mechanics: '' },
      ],
    })
  }

  function updatePower(discipline, powerId, updates) {
    updateDiscipline(discipline.id, {
      powers: normalizeDisciplinePowers(discipline.powers, { keepEmpty: true }).map((power) =>
        power.id === powerId ? { ...power, ...updates } : power,
      ),
    })
  }

  function getCatalogPowers(disciplineName) {
    const catalogKey = catalogKeysByNpcDiscipline[disciplineName]
    return catalogKey ? vtmV5System.catalogs.disciplines[catalogKey]?.powers ?? [] : []
  }

  function removePower(discipline, powerId) {
    updateDiscipline(discipline.id, {
      powers: normalizeDisciplinePowers(discipline.powers, { keepEmpty: true }).filter(
        (power) => power.id !== powerId,
      ),
    })
  }

  return (
    <section className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <h3>Disciplinas</h3>
        <button type="button" onClick={addDiscipline}>
          <Plus size={16} />
          Adicionar Disciplina
        </button>
      </div>
      <div className={styles.dynamicList}>
        {formData.disciplines.map((discipline) => {
          const powers = normalizeDisciplinePowers(discipline.powers, { keepEmpty: true })
          const catalogPowers = getCatalogPowers(discipline.name)

          return (
            <article className={styles.disciplineCard} key={discipline.id}>
              <label>
                Disciplina
                <select
                  value={discipline.name}
                  onChange={(event) =>
                    updateDiscipline(discipline.id, { name: event.target.value })
                  }
                >
                  {disciplines.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                  <option value="Outra">Outra</option>
                </select>
              </label>
              <DotRating
                label="Nivel"
                min={1}
                max={10}
                value={discipline.level}
                onChange={(value) => updateDiscipline(discipline.id, { level: value })}
              />
              <button
                type="button"
                onClick={() =>
                  updateDisciplines(
                    formData.disciplines.filter((item) => item.id !== discipline.id),
                  )
                }
              >
                <Trash2 size={16} />
                Remover Disciplina
              </button>

              <div className={styles.disciplinePowers}>
                <div className={styles.powerHeader}>
                  <h4>Poderes conhecidos</h4>
                  <button type="button" onClick={() => addPower(discipline)}>
                    <Plus size={15} />
                    Adicionar Poder
                  </button>
                </div>

                {powers.length ? (
                  <div className={styles.powerListEditor}>
                    {powers.map((power) => (
                      <article className={styles.powerEditorCard} key={power.id}>
                        <label>
                          Nome do poder
                          <input
                            value={power.name}
                            list={`npc-power-options-${discipline.id}`}
                            onChange={(event) => {
                              const selected = catalogPowers.find((candidate) => candidate.name === event.target.value)
                              updatePower(discipline, power.id, {
                                name: event.target.value,
                                mechanics: selected && !power.mechanics
                                  ? `${selected.summary}${selected.legacy ? ` [Legado: ${selected.legacy}]` : ''}`
                                  : power.mechanics,
                              })
                            }}
                          />
                          <datalist id={`npc-power-options-${discipline.id}`}>
                            {catalogPowers.map((candidate) => (
                              <option key={candidate.name} value={candidate.name}>
                                {candidate.legacy ? `${candidate.legacy} · nível ${candidate.level}` : `Nível ${candidate.level}`}
                              </option>
                            ))}
                          </datalist>
                        </label>
                        <label>
                          Mecanica, teste ou efeito
                          <textarea
                            value={power.mechanics}
                            onChange={(event) =>
                              updatePower(discipline, power.id, {
                                mechanics: event.target.value,
                              })
                            }
                            placeholder="Ex.: Raciocinio + Auspex vs Compostura + Subterfugio. Em sucesso, revela..."
                          />
                        </label>
                        <button
                          type="button"
                          aria-label={`Remover poder ${power.name || 'sem nome'}`}
                          onClick={() => removePower(discipline, power.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className={styles.powerEmpty}>
                    Nenhum poder registrado para esta disciplina.
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default DisciplinesSection
