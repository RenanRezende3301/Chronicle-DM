import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Download,
  LoaderCircle,
  Minus,
  Plus,
  Save,
  Upload,
  X,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { updateCharacter } from '../../services/supabaseChronicle2.js'
import { vtmV5System } from '../../systems/vtm-v5'
import {
  applyAttributeDistribution,
  applyClan,
  applyGeneration,
  applyInitialDisciplines,
  applyInitialMeritsAndFlaws,
  applyInitialRites,
  applyPredatorType,
  applySkillDistribution,
  applyTouchstones,
  getInitialMeritUsage,
  getGenerationBonusExperience,
  SKILL_DISTRIBUTIONS,
} from './characterCreationRules.js'
import styles from './CharacterCreator.module.css'

const STEPS = [
  { id: 'clan', label: 'Clã' },
  { id: 'attributes', label: 'Atributos' },
  { id: 'skills', label: 'Habilidades' },
  { id: 'generation', label: 'Geração' },
  { id: 'predator', label: 'Predador' },
  { id: 'basics', label: 'Identidade' },
  { id: 'disciplines', label: 'Disciplinas' },
  { id: 'rites', label: 'Ritos' },
  { id: 'touchstones', label: 'Pilares' },
  { id: 'merits', label: 'Vantagens' },
]

const ATTRIBUTE_GROUPS = [
  { label: 'Físicos', keys: ['strength', 'dexterity', 'stamina'] },
  { label: 'Sociais', keys: ['charisma', 'manipulation', 'composure'] },
  { label: 'Mentais', keys: ['intelligence', 'wits', 'resolve'] },
]
const GENERATIONS = Array.from({ length: 12 }, (_, index) => 14 - index)
const SKILL_GROUPS = [
  { label: 'Físicas', keys: vtmV5System.catalogs.skills.keys.slice(0, 9) },
  { label: 'Sociais', keys: vtmV5System.catalogs.skills.keys.slice(9, 18) },
  { label: 'Mentais', keys: vtmV5System.catalogs.skills.keys.slice(18, 27) },
]

function assignmentPrompt(attributeSelection) {
  if (!attributeSelection.strongest) return 'Escolha seu atributo mais forte (4 pontos)'
  if (!attributeSelection.weakest) return 'Escolha seu atributo mais fraco (1 ponto)'
  return `Escolha ${3 - attributeSelection.medium.length} atributo(s) médio(s) (3 pontos)`
}

function getAttributeLevel(key, selection) {
  if (selection.strongest === key) return 4
  if (selection.weakest === key) return 1
  if (selection.medium.includes(key)) return 3
  return 2
}

function getSkillPhase(distributionName, pickedSkills) {
  const distribution = SKILL_DISTRIBUTIONS[distributionName]
  if (!distribution) return null
  for (const level of [4, 3, 2, 1]) {
    const picked = Object.values(pickedSkills).filter((value) => value === level).length
    if (picked < distribution[level]) {
      return { level, remaining: distribution[level] - picked }
    }
  }
  return null
}

function CharacterCreator({ storedCharacter, onExit, onSaved, onComplete }) {
  const initial = useMemo(
    () => vtmV5System.character.parse(storedCharacter.character_data),
    [storedCharacter.character_data],
  )
  const [character, setCharacter] = useState(() => structuredClone(initial))
  const [serverCharacter, setServerCharacter] = useState(storedCharacter)
  const [stepIndex, setStepIndex] = useState(() =>
    Math.min(Math.max(Number(storedCharacter.creation_step) || 0, 0), STEPS.length - 1),
  )
  const [isSaving, setIsSaving] = useState(false)
  const [notice, setNotice] = useState(null)
  const [selectedClan, setSelectedClan] = useState(initial.clan)
  const [attributeSelection, setAttributeSelection] = useState({
    strongest: null,
    weakest: null,
    medium: [],
  })
  const [skillDistribution, setSkillDistribution] = useState(null)
  const [pickedSkills, setPickedSkills] = useState({})
  const [specialty, setSpecialty] = useState({ skill: '', name: '' })
  const [generation, setGeneration] = useState(
    initial.clan === 'Thin-blood' ? 14 : initial.generation || 13,
  )
  const [scaleExperience, setScaleExperience] = useState(initial.experience)
  const [selectedPredator, setSelectedPredator] = useState(initial.predatorType.name)
  const [predatorSpecialtyKey, setPredatorSpecialtyKey] = useState('')
  const [predatorSpecialtyText, setPredatorSpecialtyText] = useState('')
  const [predatorDiscipline, setPredatorDiscipline] = useState('')
  const [predatorAllocations, setPredatorAllocations] = useState([])
  const [clanPowers, setClanPowers] = useState([])
  const [predatorPower, setPredatorPower] = useState(null)
  const [ritualName, setRitualName] = useState('')
  const [ceremonyName, setCeremonyName] = useState('')
  const [touchstones, setTouchstones] = useState(
    initial.touchstones.length
      ? structuredClone(initial.touchstones)
      : [{ name: '', conviction: '', description: '' }],
  )
  const [pickedMerits, setPickedMerits] = useState([
    ...structuredClone(initial.merits),
    ...structuredClone(initial.flaws),
  ])
  const [meritTab, setMeritTab] = useState('merit')
  const [meritSearch, setMeritSearch] = useState('')
  const importInputRef = useRef(null)

  const step = STEPS[stepIndex]
  const selectedPredatorData = selectedPredator
    ? vtmV5System.catalogs.predatorTypes[selectedPredator]
    : null
  const scaleModel = vtmV5System.catalogs.generationScales.find((model) =>
    model.generations.includes(Number(generation)),
  )

  async function persist(nextCharacter, nextStepIndex) {
    setIsSaving(true)
    setNotice(null)

    try {
      const validated = vtmV5System.character.parse(nextCharacter)
      const saved = await updateCharacter({
        characterId: serverCharacter.id,
        expectedVersion: serverCharacter.version,
        name: validated.name,
        schemaVersion: vtmV5System.character.currentSchemaVersion,
        characterData: validated,
        portraitPath: serverCharacter.portrait_path,
        creationStatus: nextStepIndex >= STEPS.length ? 'complete' : 'draft',
        creationStep: Math.min(nextStepIndex, STEPS.length),
      })
      setCharacter(structuredClone(validated))
      setServerCharacter(saved)
      onSaved(saved)

      if (nextStepIndex >= STEPS.length) {
        onComplete(saved)
      } else {
        setStepIndex(nextStepIndex)
        setNotice({ type: 'success', text: 'Progresso salvo.' })
      }
    } catch (error) {
      setNotice({ type: 'error', text: error?.message || 'Não foi possível salvar.' })
    } finally {
      setIsSaving(false)
    }
  }

  function downloadCharacterJson(sourceCharacter) {
    const validated = vtmV5System.character.parse(sourceCharacter)
    const blob = new Blob([JSON.stringify(validated, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    const safeName = (validated.name || 'personagem')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
    anchor.href = url
    anchor.download = `${safeName || 'personagem'}-chronicle.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function handleExport() {
    try {
      downloadCharacterJson(character)
      setNotice({ type: 'success', text: 'Cópia JSON exportada.' })
    } catch (error) {
      setNotice({ type: 'error', text: error?.message || 'Não foi possível exportar esta ficha.' })
    }
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      setNotice({ type: 'error', text: 'Escolha um arquivo JSON de ficha.' })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setNotice({ type: 'error', text: 'O arquivo de ficha é muito grande. O limite é 2 MB.' })
      return
    }

    setIsSaving(true)
    setNotice(null)
    try {
      const raw = JSON.parse(await file.text())
      const imported = vtmV5System.character.parse(raw)
      if (!imported.name.trim()) {
        const importedName = window.prompt(
          'Esta ficha não possui nome. Informe um nome para salvá-la no Chronicle:',
          '',
        )?.trim()
        if (!importedName) {
          throw new Error('A importação foi cancelada: a ficha precisa de um nome.')
        }
        if (importedName.length > 120) {
          throw new Error('O nome do personagem pode ter no máximo 120 caracteres.')
        }
        imported.name = importedName
      }
      const saved = await updateCharacter({
        characterId: serverCharacter.id,
        expectedVersion: serverCharacter.version,
        name: imported.name,
        schemaVersion: vtmV5System.character.currentSchemaVersion,
        characterData: imported,
        portraitPath: serverCharacter.portrait_path,
        creationStatus: 'complete',
        creationStep: STEPS.length,
      })

      setCharacter(structuredClone(imported))
      setServerCharacter(saved)
      onSaved(saved)
      setNotice({ type: 'success', text: 'Ficha importada com sucesso.' })
      onComplete(saved)
    } catch (error) {
      setNotice({
        type: 'error',
        text: error instanceof SyntaxError
          ? 'O arquivo não contém um JSON válido.'
          : error?.message || 'Não foi possível importar esta ficha.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  function chooseAttribute(key) {
    const alreadyPicked =
      attributeSelection.strongest === key ||
      attributeSelection.weakest === key ||
      attributeSelection.medium.includes(key)
    if (alreadyPicked) {
      setAttributeSelection((current) => ({
        strongest: current.strongest === key ? null : current.strongest,
        weakest: current.weakest === key ? null : current.weakest,
        medium: current.medium.filter((candidate) => candidate !== key),
      }))
      return
    }

    setAttributeSelection((current) => {
      if (!current.strongest) return { ...current, strongest: key }
      if (!current.weakest) return { ...current, weakest: key }
      if (current.medium.length < 3) {
        return { ...current, medium: [...current.medium, key] }
      }
      return current
    })
  }

  function chooseSkill(key) {
    if (pickedSkills[key]) {
      setPickedSkills((current) => {
        const next = { ...current }
        delete next[key]
        return next
      })
      return
    }
    const phase = getSkillPhase(skillDistribution, pickedSkills)
    if (!phase) return
    setPickedSkills((current) => ({ ...current, [key]: phase.level }))
  }

  function selectPredator(name) {
    const predator = vtmV5System.catalogs.predatorTypes[name]
    setSelectedPredator(name)
    setPredatorSpecialtyKey(
      predator.specialtyOptions[0]
        ? `${predator.specialtyOptions[0].skill}::${predator.specialtyOptions[0].name}`
        : '',
    )
    setPredatorSpecialtyText('')
    setPredatorDiscipline(predator.disciplineOptions[0]?.name || '')
    setPredatorAllocations(
      predator.selectableMeritsAndFlaws.map((group) =>
        group.options.map(() => 0),
      ),
    )
  }

  function changeAllocation(groupIndex, optionIndex, value) {
    setPredatorAllocations((current) => {
      const next = current.map((group) => [...group])
      const group = selectedPredatorData.selectableMeritsAndFlaws[groupIndex]
      if (group.exclusive) {
        next[groupIndex] = group.options.map((_, index) =>
          index === optionIndex ? group.totalPoints : 0,
        )
      } else {
        next[groupIndex][optionIndex] = value
      }
      return next
    })
  }

  function continueCurrentStep() {
    try {
      let next = character
      if (step.id === 'clan') {
        next = applyClan(character, selectedClan)
        if (selectedClan === 'Thin-blood') {
          setGeneration(14)
          setScaleExperience(0)
        }
      }
      if (step.id === 'attributes') {
        next = applyAttributeDistribution(character, attributeSelection)
      }
      if (step.id === 'skills') {
        next = applySkillDistribution(
          character,
          skillDistribution,
          pickedSkills,
          specialty,
        )
      }
      if (step.id === 'generation') {
        next = applyGeneration(character, generation, scaleExperience)
      }
      if (step.id === 'predator') {
        if (character.clan === 'Thin-blood') {
          next = character
        } else {
          const option = selectedPredatorData?.specialtyOptions.find(
            (candidate) => `${candidate.skill}::${candidate.name}` === predatorSpecialtyKey,
          )
          next = applyPredatorType(
            character,
            selectedPredator,
            option
              ? {
                  skill: option.skill,
                  name: predatorSpecialtyText.trim() || option.name,
                }
              : null,
            predatorDiscipline,
            predatorAllocations,
          )
        }
      }
      if (step.id === 'basics') {
        if (!character.name.trim()) throw new Error('Informe o nome do personagem.')
      }
      if (step.id === 'disciplines') {
        next = applyInitialDisciplines(character, clanPowers, predatorPower)
      }
      if (step.id === 'rites') {
        next = applyInitialRites(
          character,
          vtmV5System.catalogs.rituals.find((ritual) => ritual.name === ritualName),
          vtmV5System.catalogs.ceremonies.find((ceremony) => ceremony.name === ceremonyName),
        )
      }
      if (step.id === 'touchstones') {
        next = applyTouchstones(character, touchstones)
      }
      if (step.id === 'merits') {
        next = applyInitialMeritsAndFlaws(character, pickedMerits)
      }

      persist(next, stepIndex + 1)
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    }
  }

  function renderClanStep() {
    return (
      <div className={styles.cardGrid}>
        {Object.entries(vtmV5System.catalogs.clans)
          .filter(([key]) => key)
          .map(([key, clan]) => (
            <button
              type="button"
              className={selectedClan === key ? styles.selectedCard : styles.choiceCard}
              key={key}
              onClick={() => setSelectedClan(key)}
            >
              <img src={clan.logo} alt="" />
              <strong>{clan.displayName || clan.name}</strong>
              <span>{clan.description}</span>
              <small>
                {clan.nativeDisciplines
                  .map(vtmV5System.rules.translations.translateDiscipline)
                  .join(' · ') || 'Sem disciplinas de clã'}
              </small>
            </button>
          ))}
      </div>
    )
  }

  function renderAttributesStep() {
    return (
      <>
        <div className={styles.prompt}>{assignmentPrompt(attributeSelection)}</div>
        <div className={styles.traitChoices}>
          {ATTRIBUTE_GROUPS.map((group) => (
            <section key={group.label}>
              <h3>{group.label}</h3>
              {group.keys.map((key) => {
                const isPicked = getAttributeLevel(key, attributeSelection) !== 2
                return (
                  <button
                    type="button"
                    className={isPicked ? styles.selectedTrait : undefined}
                    key={key}
                    onClick={() => chooseAttribute(key)}
                  >
                    <span>
                      <strong>{vtmV5System.catalogs.attributes.names[key]}</strong>
                      <small>{vtmV5System.catalogs.attributes.descriptions[key]}</small>
                    </span>
                    <b>{getAttributeLevel(key, attributeSelection)}</b>
                  </button>
                )
              })}
            </section>
          ))}
        </div>
      </>
    )
  }

  function renderSkillsStep() {
    const phase = getSkillPhase(skillDistribution, pickedSkills)
    const complete = skillDistribution && !phase
    return (
      <>
        <div className={styles.distributionGrid}>
          {Object.entries(SKILL_DISTRIBUTIONS).map(([name, distribution]) => (
            <button
              type="button"
              className={skillDistribution === name ? styles.selectedDistribution : undefined}
              key={name}
              onClick={() => {
                setSkillDistribution(name)
                setPickedSkills({})
                setSpecialty({ skill: '', name: '' })
              }}
            >
              <strong>{name}</strong>
              <span>
                {distribution[4] ? `${distribution[4]}×4 · ` : ''}
                {distribution[3]}×3 · {distribution[2]}×2 · {distribution[1]}×1
              </span>
            </button>
          ))}
        </div>
        <div className={styles.prompt}>
          {!skillDistribution
            ? 'Escolha uma distribuição'
            : phase
              ? `Escolha ${phase.remaining} habilidade(s) de nível ${phase.level}`
              : 'Distribuição completa — defina uma especialidade'}
        </div>
        <div className={styles.skillsGrid}>
          {SKILL_GROUPS.map((group) => (
            <div key={group.label}>
              <h3>{group.label}</h3>
              {group.keys.map((key) => (
                <button
                  type="button"
                  className={pickedSkills[key] ? styles.selectedSkill : undefined}
                  disabled={!skillDistribution}
                  key={key}
                  onClick={() => chooseSkill(key)}
                >
                  <span>{vtmV5System.catalogs.skills.names[key]}</span>
                  <b>{pickedSkills[key] || 0}</b>
                </button>
              ))}
            </div>
          ))}
        </div>
        {complete ? (
          <div className={styles.specialtyFields}>
            <label>
              Habilidade da especialidade
              <select
                value={specialty.skill}
                onChange={(event) =>
                  setSpecialty((current) => ({ ...current, skill: event.target.value }))
                }
              >
                <option value="">Escolha...</option>
                {Object.keys(pickedSkills).map((key) => (
                  <option key={key} value={key}>
                    {vtmV5System.catalogs.skills.names[key]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nome da especialidade
              <input
                placeholder="Ex.: Arrombamento, Espadas, Política local..."
                value={specialty.name}
                onChange={(event) =>
                  setSpecialty((current) => ({ ...current, name: event.target.value }))
                }
              />
            </label>
          </div>
        ) : null}
      </>
    )
  }

  function renderGenerationStep() {
    const bonus = getGenerationBonusExperience(Number(generation))
    const potency =
      vtmV5System.catalogs.bloodPotency.limitsByGeneration[Number(generation)]?.min ?? 0
    return (
      <div className={styles.generationLayout}>
        <label>
          Geração inicial
          <select
            value={generation}
            disabled={character.clan === 'Thin-blood'}
            onChange={(event) => {
              const value = Number(event.target.value)
              setGeneration(value)
              const model = vtmV5System.catalogs.generationScales.find((candidate) =>
                candidate.generations.includes(value),
              )
              setScaleExperience(model?.xpRange?.[0] ?? getGenerationBonusExperience(value))
            }}
          >
            {GENERATIONS.filter(
              (value) => character.clan !== 'Thin-blood' || value === 14,
            ).map((value) => (
              <option key={value} value={value}>{`${value}ª geração`}</option>
            ))}
          </select>
        </label>
        <div className={styles.generationSummary}>
          <small>Resumo</small>
          <strong>{generation}ª geração</strong>
          <span>Potência de Sangue inicial: {potency}</span>
          <span>
            Teto de traços: {vtmV5System.rules.generation.maxTraitByGeneration(Number(generation))}
          </span>
          {bonus ? <span>XP bônus: {bonus}</span> : null}
          {scaleModel ? (
            <>
              <span>Modelo: {scaleModel.label}</span>
              <span>Idade típica: {scaleModel.ageRange}</span>
              <label>
                XP inicial
                <input
                  type="number"
                  min={scaleModel.xpRange?.[0] ?? 0}
                  max={scaleModel.xpRange?.[1]}
                  value={scaleExperience}
                  onChange={(event) => setScaleExperience(Number(event.target.value))}
                />
              </label>
              {scaleModel.warning ? <p>{scaleModel.warning}</p> : null}
            </>
          ) : null}
        </div>
      </div>
    )
  }

  function renderPredatorStep() {
    if (character.clan === 'Thin-blood') {
      return <div className={styles.prompt}>Sangue-Ralos não possuem tipo de predador inicial.</div>
    }

    return (
      <>
        <div className={styles.predatorGrid}>
          {Object.entries(vtmV5System.catalogs.predatorTypes)
            .filter(([key]) => key)
            .map(([key, predator]) => {
              const excluded =
                vtmV5System.catalogs.clans[character.clan]?.excludedPredatorTypes?.includes(key)
              return (
                <button
                  type="button"
                  className={selectedPredator === key ? styles.selectedPredator : undefined}
                  disabled={excluded}
                  key={key}
                  onClick={() => selectPredator(key)}
                >
                  <strong>{predator.name}</strong>
                  <span>{predator.summary}</span>
                  <small>
                    {predator.disciplineOptions
                      .map((option) =>
                        vtmV5System.rules.translations.translateDiscipline(option.name),
                      )
                      .join(' ou ')}
                  </small>
                  {excluded ? <em>Incompatível com seu clã</em> : null}
                </button>
              )
            })}
        </div>
        {selectedPredatorData ? (
          <section className={styles.predatorDetails}>
            <h3>{selectedPredatorData.name}</h3>
            <div className={styles.specialtyFields}>
              <label>
                Especialidade concedida
                <select
                  value={predatorSpecialtyKey}
                  onChange={(event) => {
                    setPredatorSpecialtyKey(event.target.value)
                    setPredatorSpecialtyText('')
                  }}
                >
                  {selectedPredatorData.specialtyOptions.map((option) => (
                    <option
                      key={`${option.skill}::${option.name}`}
                      value={`${option.skill}::${option.name}`}
                    >
                      {vtmV5System.catalogs.skills.names[option.skill]}: {option.name}
                    </option>
                  ))}
                </select>
              </label>
              {selectedPredatorData.specialtyOptions.find(
                (option) => `${option.skill}::${option.name}` === predatorSpecialtyKey,
              )?.customInput ? (
                <label>
                  Especifique
                  <input
                    value={predatorSpecialtyText}
                    onChange={(event) => setPredatorSpecialtyText(event.target.value)}
                  />
                </label>
              ) : null}
              <label>
                Disciplina bônus
                <select
                  value={predatorDiscipline}
                  onChange={(event) => setPredatorDiscipline(event.target.value)}
                >
                  {selectedPredatorData.disciplineOptions.map((option) => (
                    <option key={option.name} value={option.name}>
                      {vtmV5System.rules.translations.translateDiscipline(option.name)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {[...selectedPredatorData.meritsAndFlaws].map((item) => (
              <p className={styles.fixedBenefit} key={`${item.type}-${item.name}`}>
                <b>{item.level}</b> {item.name} <span>({item.type === 'merit' ? 'vantagem' : 'defeito'})</span>
              </p>
            ))}
            {selectedPredatorData.selectableMeritsAndFlaws.map((group, groupIndex) => {
              const spent = (predatorAllocations[groupIndex] || []).reduce(
                (total, value) => total + value,
                0,
              )
              return (
                <div className={styles.allocationGroup} key={groupIndex}>
                  <header>
                    <strong>{group.exclusive ? 'Escolha uma opção' : 'Distribua os pontos'}</strong>
                    <span>{spent}/{group.totalPoints}</span>
                  </header>
                  {group.options.map((option, optionIndex) => {
                    const value = predatorAllocations[groupIndex]?.[optionIndex] || 0
                    return (
                      <div key={`${option.name}-${optionIndex}`}>
                        <span>
                          <strong>{option.name}</strong>
                          <small>{option.summary}</small>
                        </span>
                        <button
                          type="button"
                          disabled={!value}
                          onClick={() => changeAllocation(groupIndex, optionIndex, value - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <output>{value}</output>
                        <button
                          type="button"
                          disabled={
                            value >= option.maxLevel || (!group.exclusive && spent >= group.totalPoints)
                          }
                          onClick={() => changeAllocation(groupIndex, optionIndex, value + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </section>
        ) : null}
      </>
    )
  }

  function renderBasicsStep() {
    const fields = [
      ['name', 'Nome completo'],
      ['sire', 'Senhor(a)'],
      ['ambition', 'Ambição de longo prazo'],
      ['desire', 'Desejo de curto prazo'],
    ]
    return (
      <div className={styles.basicsForm}>
        {fields.map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              value={character[key]}
              onChange={(event) =>
                setCharacter((current) => ({ ...current, [key]: event.target.value }))
              }
            />
          </label>
        ))}
        <label>
          Descrição e aparência
          <textarea
            rows="7"
            value={character.description}
            onChange={(event) =>
              setCharacter((current) => ({ ...current, description: event.target.value }))
            }
          />
        </label>
      </div>
    )
  }

  function powerPrerequisitesMet(power, allPowers) {
    const disciplineLevel = allPowers.filter(
      (candidate) => candidate.discipline === power.discipline,
    ).length
    if (disciplineLevel < power.level - 1) return false
    if ((power.minimumHumanity || 0) > character.humanity) return false
    const ownsRequiredPowers = (power.requiredPowerNames || []).every((name) =>
      allPowers.some((candidate) => candidate.name === name),
    )
    const meetsAlternativeRequirements = (power.amalgamPrerequisiteOptions || []).every((options) =>
      options.some(
        (prerequisite) =>
          allPowers.filter((candidate) => candidate.discipline === prerequisite.discipline)
            .length >= prerequisite.level,
      ),
    )
    return ownsRequiredPowers && meetsAlternativeRequirements && power.amalgamPrerequisites.every(
      (prerequisite) =>
        allPowers.filter((candidate) => candidate.discipline === prerequisite.discipline)
          .length >= prerequisite.level,
    )
  }

  function toggleClanPower(power) {
    if (clanPowers.some((candidate) => candidate.name === power.name)) {
      setClanPowers((current) => current.filter((candidate) => candidate.name !== power.name))
      return
    }
    const allPowers = predatorPower ? [...clanPowers, predatorPower] : clanPowers
    const disciplineCount = clanPowers.filter(
      (candidate) => candidate.discipline === power.discipline,
    ).length
    const distinct = new Set(clanPowers.map((candidate) => candidate.discipline))
    if (
      clanPowers.length >= 3 ||
      disciplineCount >= 2 ||
      (distinct.size >= 2 && !distinct.has(power.discipline)) ||
      !powerPrerequisitesMet(power, allPowers)
    ) return
    setClanPowers((current) => [...current, power])
  }

  function togglePredatorPower(power) {
    if (predatorPower?.name === power.name) {
      setPredatorPower(null)
      return
    }
    const allPowers = [...clanPowers]
    if (
      predatorPower ||
      clanPowers.some((candidate) => candidate.name === power.name) ||
      !powerPrerequisitesMet(power, allPowers)
    ) return
    setPredatorPower(power)
  }

  function renderPowerCard(power, source) {
    const selected =
      source === 'clan'
        ? clanPowers.some((candidate) => candidate.name === power.name)
        : predatorPower?.name === power.name
    const allPowers = predatorPower ? [...clanPowers, predatorPower] : clanPowers
    const prerequisiteReady = selected || powerPrerequisitesMet(power, allPowers)
    return (
      <button
        type="button"
        className={selected ? styles.selectedPower : styles.powerCard}
        disabled={!selected && !prerequisiteReady}
        key={`${source}-${power.discipline}-${power.name}`}
        onClick={() =>
          source === 'clan' ? toggleClanPower(power) : togglePredatorPower(power)
        }
      >
        <span>
          <strong>{power.name}</strong>
          <b>Nível {power.level}</b>
        </span>
        <p>{power.summary}</p>
        {power.legacy ? <small>Legado de Sangue: {power.legacy}</small> : null}
        {power.minimumHumanity ? <small>Requer Humanidade {power.minimumHumanity}+</small> : null}
        {power.amalgamPrerequisites.length ? (
          <small>
            Requer:{' '}
            {power.amalgamPrerequisites
              .map(
                (prerequisite) =>
                  `${vtmV5System.rules.translations.translateDiscipline(prerequisite.discipline)} ${prerequisite.level}`,
              )
              .join(', ')}
          </small>
        ) : null}
      </button>
    )
  }

  function renderDisciplineStep() {
    if (character.clan === 'Thin-blood') {
      return (
        <div className={styles.prompt}>
          Sangue-Ralos não escolhem Disciplinas iniciais; eles as obtêm por ressonância sanguínea.
        </div>
      )
    }
    const nativeNames = character.availableDisciplineNames
    const predatorDisciplineName = character.predatorType.pickedDiscipline
    return (
      <div className={styles.disciplineLayout}>
        <div className={styles.selectionSummary}>
          <span>Poderes do clã: <b>{clanPowers.length}/3</b></span>
          <span>Poder do predador: <b>{predatorPower ? '1/1' : '0/1'}</b></span>
          <small>Distribua os três poderes do clã em duas Disciplinas, no máximo dois em cada uma.</small>
        </div>
        <h3>Disciplinas do clã</h3>
        {nativeNames.map((disciplineName) => {
          const discipline = vtmV5System.catalogs.disciplines[disciplineName]
          if (!discipline) return null
          const maximumLevel = disciplineName === predatorDisciplineName ? 3 : 2
          return (
            <section className={styles.disciplineGroup} key={`clan-${disciplineName}`}>
              <header>
                <img src={discipline.logo} alt="" />
                <strong>{vtmV5System.rules.translations.translateDiscipline(disciplineName)}</strong>
                <span>{discipline.summary}</span>
              </header>
              <div>
                {discipline.powers
                  .filter((power) => power.level <= maximumLevel)
                  .map((power) => renderPowerCard(power, 'clan'))}
              </div>
            </section>
          )
        })}
        <h3>Disciplina bônus do tipo de predador</h3>
        {predatorDisciplineName && vtmV5System.catalogs.disciplines[predatorDisciplineName] ? (
          <section className={styles.disciplineGroup}>
            <header>
              <img src={vtmV5System.catalogs.disciplines[predatorDisciplineName].logo} alt="" />
              <strong>{vtmV5System.rules.translations.translateDiscipline(predatorDisciplineName)}</strong>
              <span>Escolha um poder adicional.</span>
            </header>
            <div>
              {vtmV5System.catalogs.disciplines[predatorDisciplineName].powers
                .filter((power) => power.level <= (nativeNames.includes(predatorDisciplineName) ? 3 : 2))
                .map((power) => renderPowerCard(power, 'predator'))}
            </div>
          </section>
        ) : null}
      </div>
    )
  }

  function renderRitesStep() {
    const hasBloodSorcery = vtmV5System.rules.character.containsBloodSorcery(
      character.disciplines,
    )
    const hasOblivion = vtmV5System.rules.character.containsOblivion(character.disciplines)
    const rituals = vtmV5System.catalogs.rituals.filter((ritual) => ritual.level === 1)
    const ceremonies = vtmV5System.catalogs.ceremonies.filter(
      (ceremony) =>
        ceremony.level === 1 &&
        vtmV5System.rules.ceremonies.characterHasCeremonyPrerequisite(character, ceremony),
    )
    if (!hasBloodSorcery && !hasOblivion) {
      return (
        <div className={styles.prompt}>
          Suas Disciplinas não concedem um Ritual ou uma Cerimônia inicial. Você pode continuar.
        </div>
      )
    }
    const renderRite = (rite, selectedName, select) => (
      <button
        type="button"
        className={selectedName === rite.name ? styles.selectedRite : styles.riteCard}
        key={rite.name}
        onClick={() => select(rite.name)}
      >
        <span><strong>{rite.name}</strong><b>Nível {rite.level}</b></span>
        <p>{rite.summary}</p>
        <small>{rite.requiredTime} · {rite.dicePool}</small>
      </button>
    )
    return (
      <div className={styles.ritesLayout}>
        {hasBloodSorcery ? (
          <section>
            <h3>Primeiro Ritual</h3>
            <p>Feiticeiros do Sangue começam com um Ritual de nível 1 gratuito.</p>
            <div>{rituals.map((ritual) => renderRite(ritual, ritualName, setRitualName))}</div>
          </section>
        ) : null}
        {hasOblivion ? (
          <section>
            <h3>Primeira Cerimônia</h3>
            <p>Somente Cerimônias cujos poderes requisitos você conhece aparecem aqui.</p>
            {ceremonies.length ? (
              <div>{ceremonies.map((ceremony) => renderRite(ceremony, ceremonyName, setCeremonyName))}</div>
            ) : (
              <div className={styles.prompt}>Nenhuma Cerimônia de nível 1 é compatível com seus poderes.</div>
            )}
          </section>
        ) : null}
      </div>
    )
  }

  function updateTouchstone(index, field, value) {
    setTouchstones((current) =>
      current.map((touchstone, candidateIndex) =>
        candidateIndex === index ? { ...touchstone, [field]: value } : touchstone,
      ),
    )
  }

  function renderTouchstonesStep() {
    return (
      <div className={styles.touchstonesLayout}>
        {touchstones.map((touchstone, index) => (
          <section key={index}>
            <header>
              <strong>Pilar {index + 1}</strong>
              <button
                type="button"
                aria-label={`Remover pilar ${index + 1}`}
                onClick={() =>
                  setTouchstones((current) =>
                    current.filter((_, candidateIndex) => candidateIndex !== index),
                  )
                }
              >
                <X size={15} />
              </button>
            </header>
            <div>
              <label>
                Nome do Pilar
                <input
                  placeholder="Uma pessoa que ancora sua Humanidade"
                  value={touchstone.name}
                  onChange={(event) => updateTouchstone(index, 'name', event.target.value)}
                />
              </label>
              <label>
                Convicção
                <input
                  placeholder="Nunca traia seus amigos"
                  value={touchstone.conviction}
                  onChange={(event) => updateTouchstone(index, 'conviction', event.target.value)}
                />
              </label>
              <label>
                Relação e descrição
                <textarea
                  rows="4"
                  value={touchstone.description}
                  onChange={(event) => updateTouchstone(index, 'description', event.target.value)}
                />
              </label>
            </div>
          </section>
        ))}
        <button
          type="button"
          className={styles.addTouchstone}
          onClick={() =>
            setTouchstones((current) => [
              ...current,
              { name: '', conviction: '', description: '' },
            ])
          }
        >
          <Plus size={16} />
          Adicionar Pilar e Convicção
        </button>
      </div>
    )
  }

  function selectMerit(item, type, level) {
    setPickedMerits((current) => [
      ...current.filter((candidate) => candidate.name !== item.name),
      {
        name: item.name,
        level,
        type,
        summary: item.summary,
        excludes: item.excludes,
      },
    ])
  }

  function renderMeritsStep() {
    const regularItems = vtmV5System.catalogs.meritsAndFlaws.flatMap((category) => [
      ...category.merits.map((item) => ({ item, type: 'merit', source: category.title })),
      ...category.flaws.map((item) => ({ item, type: 'flaw', source: category.title })),
    ])
    const thinbloodItems = character.clan === 'Thin-blood'
      ? [
          ...vtmV5System.catalogs.thinbloodMeritsAndFlaws.merits.map((item) => ({
            item,
            type: 'merit',
            source: 'Sangue-Ralo',
          })),
          ...vtmV5System.catalogs.thinbloodMeritsAndFlaws.flaws.map((item) => ({
            item,
            type: 'flaw',
            source: 'Sangue-Ralo',
          })),
        ]
      : []
    const loreItems = vtmV5System.catalogs.loresheets.flatMap((sheet) =>
      sheet.merits.map((item) => ({ item, type: 'merit', source: sheet.title, sheet })),
    )
    const allItems = meritTab === 'lore'
      ? loreItems
      : [...regularItems, ...thinbloodItems].filter(({ type }) => type === meritTab)
    const uniqueItems = Array.from(
      new Map(allItems.map((entry) => [`${entry.type}:${entry.item.name}`, entry])).values(),
    )
    const search = meritSearch.trim().toLocaleLowerCase('pt-BR')
    const visibleItems = uniqueItems.filter(({ item, source }) =>
      !search || `${item.name} ${item.summary} ${source}`.toLocaleLowerCase('pt-BR').includes(search),
    )
    const usage = getInitialMeritUsage(character, pickedMerits)
    const predatorItems =
      vtmV5System.rules.meritsAndFlaws.getPredatorTypeMeritsByName(character)
    const clanExclusions = new Set(
      vtmV5System.catalogs.clans[character.clan]?.excludedMeritsAndFlaws ?? [],
    )

    return (
      <div className={styles.meritsLayout}>
        <div className={styles.budgetCards}>
          <span>Vantagens <b>{usage.merits}/{usage.meritBudget}</b></span>
          <span>Defeitos <b>{usage.flaws}/{usage.flawBudget}</b></span>
          {character.clan === 'Thin-blood' ? (
            <span>Balanço Sangue-Ralo <b>{usage.thinbloodBalance}</b></span>
          ) : null}
        </div>
        <div className={styles.meritToolbar}>
          <div>
            <button type="button" className={meritTab === 'merit' ? styles.activeMeritTab : undefined} onClick={() => setMeritTab('merit')}>Vantagens</button>
            <button type="button" className={meritTab === 'flaw' ? styles.activeMeritTab : undefined} onClick={() => setMeritTab('flaw')}>Defeitos</button>
            <button type="button" className={meritTab === 'lore' ? styles.activeMeritTab : undefined} onClick={() => setMeritTab('lore')}>Folhas de Conhecimento</button>
          </div>
          <input
            type="search"
            placeholder="Pesquisar por nome, efeito ou categoria..."
            value={meritSearch}
            onChange={(event) => setMeritSearch(event.target.value)}
          />
        </div>
        {pickedMerits.length ? (
          <div className={styles.selectedMerits}>
            {pickedMerits.map((item) => (
              <button
                type="button"
                key={`${item.type}-${item.name}`}
                title="Remover escolha"
                onClick={() =>
                  setPickedMerits((current) =>
                    current.filter((candidate) => candidate.name !== item.name),
                  )
                }
              >
                {item.name} · {item.level} <X size={12} />
              </button>
            ))}
          </div>
        ) : null}
        <div className={styles.meritCatalog}>
          {visibleItems.map(({ item, type, source, sheet }) => {
            const selected = pickedMerits.find((candidate) => candidate.name === item.name)
            const predatorLevel = predatorItems.get(item.name)?.level ?? 0
            const excludedByPicked = pickedMerits.some(
              (candidate) =>
                candidate.excludes.includes(item.name) || item.excludes.includes(candidate.name),
            )
            const requirementsMet = !sheet || sheet.requirementFunctions.every((rule) => rule(character))
            const disabled = clanExclusions.has(item.name) || excludedByPicked || !requirementsMet
            return (
              <article className={selected ? styles.selectedMeritCard : undefined} key={`${type}-${item.name}`}>
                <header>
                  <strong>{item.name}</strong>
                  <small>{source}</small>
                </header>
                <p>{item.summary}</p>
                {predatorLevel ? <em>Seu Predador já concede {predatorLevel} ponto(s).</em> : null}
                {disabled ? <em>Indisponível por requisito ou incompatibilidade.</em> : null}
                <div>
                  {item.cost.map((level) => (
                    <button
                      type="button"
                      className={selected?.level === level ? styles.chosenLevel : undefined}
                      disabled={disabled || selected?.level === level || predatorLevel >= level}
                      key={level}
                      onClick={() => selectMerit(item, type, level)}
                    >
                      {level}
                    </button>
                  ))}
                  {selected ? (
                    <button
                      type="button"
                      onClick={() =>
                        setPickedMerits((current) =>
                          current.filter((candidate) => candidate.name !== item.name),
                        )
                      }
                    >
                      Remover
                    </button>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <button type="button" onClick={onExit}>
          <X size={18} />
          Voltar aos personagens
        </button>
        <div>
          <small>Criação guiada · VTM V5</small>
          <strong>{character.name || 'Novo personagem'}</strong>
        </div>
        <span>
          Etapa {stepIndex + 1} de {STEPS.length}
        </span>
        <div className={styles.transferActions}>
          <button type="button" onClick={() => importInputRef.current?.click()} disabled={isSaving}>
            <Upload size={16} />
            Importar JSON
          </button>
          <input
            ref={importInputRef}
            className={styles.hiddenInput}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
          />
          <button type="button" onClick={handleExport} disabled={isSaving}>
            <Download size={16} />
            Exportar JSON
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.dossier}>
          <header>
            <small>Dossiê</small>
            <strong>{character.name || 'Personagem em criação'}</strong>
            <span>{Math.round(((stepIndex + 1) / STEPS.length) * 100)}% do protocolo</span>
          </header>

          <dl>
            <div>
              <dt>Clã</dt>
              <dd>{selectedClan || character.clan || 'Não definido'}</dd>
            </div>
            <div>
              <dt>Geração</dt>
              <dd>{generation ? `${generation}ª` : 'Não definida'}</dd>
            </div>
            <div>
              <dt>Predador</dt>
              <dd>{selectedPredator || character.predatorType.name || 'Não definido'}</dd>
            </div>
            <div>
              <dt>Disciplinas</dt>
              <dd>{clanPowers.length + (predatorPower ? 1 : 0)} poder(es)</dd>
            </div>
            <div>
              <dt>Vantagens</dt>
              <dd>{pickedMerits.filter((item) => item.type !== 'flaw').length}</dd>
            </div>
            <div>
              <dt>Defeitos</dt>
              <dd>{pickedMerits.filter((item) => item.type === 'flaw').length}</dd>
            </div>
          </dl>

          <p>
            Suas escolhas são salvas no Chronicle ao avançar. Você pode retomar esta
            ficha depois sem perder o progresso.
          </p>
        </aside>

        <section className={styles.stage}>
          <header>
            <small>{step.label}</small>
            <h1>
              {step.id === 'clan' ? 'Escolha sua linhagem' : null}
              {step.id === 'attributes' ? 'Distribua seus atributos' : null}
              {step.id === 'skills' ? 'Defina suas habilidades' : null}
              {step.id === 'generation' ? 'Escolha sua geração' : null}
              {step.id === 'predator' ? 'Como você caça?' : null}
              {step.id === 'basics' ? 'Dê vida ao personagem' : null}
              {step.id === 'disciplines' ? 'Desperte seu Sangue' : null}
              {step.id === 'rites' ? 'Escolha seus primeiros ritos' : null}
              {step.id === 'touchstones' ? 'Proteja sua Humanidade' : null}
              {step.id === 'merits' ? 'Molde vantagens e defeitos' : null}
            </h1>
            <p>
              {step.id === 'clan' ? 'O clã define herança, maldição e disciplinas naturais.' : null}
              {step.id === 'attributes' ? 'Um atributo em 4, um em 1, três em 3 e os demais em 2.' : null}
              {step.id === 'skills' ? 'A distribuição escolhida determina seus pontos iniciais.' : null}
              {step.id === 'generation' ? 'A geração define Potência de Sangue, XP e os limites do personagem.' : null}
              {step.id === 'predator' ? 'Seu método de alimentação concede especialidade, disciplina e antecedentes.' : null}
              {step.id === 'basics' ? 'Você poderá aprofundar e revisar tudo depois na ficha completa.' : null}
              {step.id === 'disciplines' ? 'Escolha três poderes do clã e o poder concedido pelo seu modo de caça.' : null}
              {step.id === 'rites' ? 'Feitiçaria de Sangue e Oblívio podem conceder conhecimento ritual inicial.' : null}
              {step.id === 'touchstones' ? 'Pilares são humanos que sustentam suas Convicções e sua ligação com a Humanidade.' : null}
              {step.id === 'merits' ? 'Escolha antecedentes, qualidades, complicações e Folhas de Conhecimento.' : null}
            </p>
          </header>

          {notice ? (
            <div className={notice.type === 'error' ? styles.error : styles.success}>
              {notice.type === 'error' ? <CircleAlert size={17} /> : <Save size={17} />}
              {notice.text}
            </div>
          ) : null}

          <div className={styles.stepContent}>
            {step.id === 'clan' ? renderClanStep() : null}
            {step.id === 'attributes' ? renderAttributesStep() : null}
            {step.id === 'skills' ? renderSkillsStep() : null}
            {step.id === 'generation' ? renderGenerationStep() : null}
            {step.id === 'predator' ? renderPredatorStep() : null}
            {step.id === 'basics' ? renderBasicsStep() : null}
            {step.id === 'disciplines' ? renderDisciplineStep() : null}
            {step.id === 'rites' ? renderRitesStep() : null}
            {step.id === 'touchstones' ? renderTouchstonesStep() : null}
            {step.id === 'merits' ? renderMeritsStep() : null}
          </div>

          <footer>
            <button
              type="button"
              disabled={stepIndex === 0 || isSaving}
              onClick={() => {
                setNotice(null)
                setStepIndex((current) => Math.max(0, current - 1))
              }}
            >
              <ArrowLeft size={17} />
              Voltar
            </button>
            <button type="button" disabled={isSaving} onClick={continueCurrentStep}>
              {isSaving ? <LoaderCircle className={styles.spin} size={17} /> : null}
              {stepIndex === STEPS.length - 1 ? 'Concluir base da ficha' : 'Salvar e continuar'}
              {stepIndex < STEPS.length - 1 ? <ArrowRight size={17} /> : <Check size={17} />}
            </button>
          </footer>
        </section>

        <ol className={styles.progress}>
          {STEPS.map((candidate, index) => (
            <li
              className={index === stepIndex ? styles.currentStep : index < stepIndex ? styles.doneStep : undefined}
              key={candidate.id}
            >
              <i>{index < stepIndex ? <Check size={12} /> : index + 1}</i>
              <span>{candidate.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </main>
  )
}

export default CharacterCreator
