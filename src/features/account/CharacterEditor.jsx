import {
  ArrowLeft,
  BookHeart,
  Check,
  CircleAlert,
  Download,
  ImageOff,
  ImageUp,
  LoaderCircle,
  Plus,
  RotateCcw,
  Save,
  Search,
  Share2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  listAvailableChronicles,
  listCharacterChronicleLinks,
  listCharacterXpEvents,
  setCharacterShareArchived,
  setGmCharacterEditPermission,
  shareCharacterWithChronicle,
  spendCharacterXp,
  refundCharacterXpPurchase,
  updateCharacter,
  subscribeToCharacter,
  getCharacterPortraitUrl,
  removeLibraryPortrait,
  removeLibraryPortraitIfUnused,
  uploadCharacterPortrait,
} from '../../services/supabaseChronicle2.js'
import { vtmV5System } from '../../systems/vtm-v5'
import { recalculateCharacter } from './characterCreationRules.js'
import styles from './CharacterEditor.module.css'

const SHEET_MODES = [
  { id: 'session', label: 'Jogo' },
  { id: 'evolution', label: 'XP' },
  { id: 'sheet', label: 'Livre' },
  { id: 'chronicles', label: 'Crônicas' },
]

const SKILL_GROUPS = [
  { label: 'Físicas', keys: vtmV5System.catalogs.skills.keys.slice(0, 9) },
  { label: 'Sociais', keys: vtmV5System.catalogs.skills.keys.slice(9, 18) },
  { label: 'Mentais', keys: vtmV5System.catalogs.skills.keys.slice(18, 27) },
]

const ATTRIBUTE_GROUPS = [
  { label: 'Físico', keys: ['strength', 'dexterity', 'stamina'] },
  { label: 'Social', keys: ['charisma', 'manipulation', 'composure'] },
  { label: 'Mental', keys: ['intelligence', 'wits', 'resolve'] },
]

function cloneCharacter(character) {
  return structuredClone(character)
}

const SESSION_FIELDS = [
  'hunger',
  'humanityStains',
  'superficialDamage',
  'aggravatedDamage',
  'superficialWillpowerDamage',
  'aggravatedWillpowerDamage',
]

function sessionStateWithDefaults(sessionState, character) {
  return Object.fromEntries(
    SESSION_FIELDS.map((field) => [
      field,
      Math.max(
        0,
        Number.isFinite(Number(sessionState?.[field]))
          ? Number(sessionState[field])
          : Number(character.ephemeral[field]) || 0,
      ),
    ]),
  )
}

function RoundPips({
  label,
  value,
  min = 0,
  max,
  onChange,
  disabled = false,
  canSelect,
  getTitle,
  getDisabledTitle,
}) {
  const safeValue = Math.min(Math.max(Number(value) || 0, min), max)
  const [tooltipIndex, setTooltipIndex] = useState(null)

  return (
    <span className={styles.dotsWithTooltip}>
      <span className={styles.dots} role="group" aria-label={label}>
        {Array.from({ length: max }, (_, index) => {
          const clickedValue = index + 1
          const isSelectable = !canSelect || canSelect(clickedValue)
          const keepsDisabledHover = !isSelectable && Boolean(getDisabledTitle)
          const isDisabled = disabled || (!isSelectable && !keepsDisabledHover)
          const title = isSelectable
            ? getTitle?.(clickedValue)
            : getDisabledTitle?.(clickedValue)
          return (
            <button
              type="button"
              className={`${index < safeValue ? styles.dotFilled : ''} ${!isSelectable ? styles.dotUnavailable : ''}`}
              aria-label={`${label}: ${clickedValue}`}
              aria-disabled={isDisabled || !isSelectable}
              aria-pressed={index < safeValue}
              disabled={isDisabled}
              key={index}
              tabIndex={!isSelectable ? -1 : undefined}
              onBlur={() => setTooltipIndex(null)}
              onFocus={() => setTooltipIndex(title ? index : null)}
              onMouseEnter={() => setTooltipIndex(title ? index : null)}
              onMouseLeave={() => setTooltipIndex(null)}
              onClick={() => {
                if (!isSelectable) return
                onChange(clickedValue === safeValue ? Math.max(min, index) : clickedValue)
              }}
            >
              {tooltipIndex === index && title ? (
                <span className={styles.xpPipTooltip} role="tooltip">{title}</span>
              ) : null}
            </button>
          )
        })}
      </span>
    </span>
  )
}

function SquarePips({ label, value, max, onChange, groupSize, disabled = false }) {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), max)

  return (
    <span className={styles.squarePips} role="group" aria-label={label}>
      {Array.from({ length: max }, (_, index) => (
        <button
          type="button"
          className={index < safeValue ? styles.squarePipFilled : undefined}
          aria-label={`${label}: ${index + 1}`}
          aria-pressed={index < safeValue}
          disabled={disabled}
          key={index}
          onClick={() => onChange(index + 1 === safeValue ? index : index + 1)}
          style={groupSize && (index + 1) % groupSize === 0 && index < max - 1
            ? { marginRight: 8 }
            : undefined}
        />
      ))}
    </span>
  )
}

function DamagePips({ label, max, superficial, aggravated, onChange, disabled = false }) {
  const safeSuperficial = Math.min(
    Math.max(Number(superficial) || 0, Number(aggravated) || 0),
    max,
  )
  const safeAggravated = Math.min(
    Math.max(Number(aggravated) || 0, 0),
    safeSuperficial,
  )

  const handlePipClick = (index) => {
    const pipNumber = index + 1
    let nextSuperficial = safeSuperficial
    let nextAggravated = safeAggravated

    if (pipNumber === safeSuperficial + 1) {
      nextSuperficial += 1
    } else if (pipNumber === safeSuperficial) {
      if (safeAggravated === safeSuperficial) {
        nextAggravated -= 1
        nextSuperficial -= 1
      } else if (safeAggravated === pipNumber - 1) {
        nextAggravated += 1
      } else {
        nextSuperficial -= 1
      }
    } else if (pipNumber === safeAggravated + 1) {
      nextAggravated += 1
    } else if (pipNumber === safeAggravated) {
      nextAggravated -= 1
    }

    onChange(nextSuperficial, nextAggravated)
  }

  return (
    <span className={styles.squarePips} role="group" aria-label={label}>
      {Array.from({ length: max }, (_, index) => {
        const pipNumber = index + 1
        const damageState = pipNumber <= safeAggravated
          ? 'aggravated'
          : pipNumber <= safeSuperficial
            ? 'superficial'
            : 'none'
        return (
          <button
            type="button"
            className={`${styles.damagePip} ${styles[damageState]}`}
            aria-label={`${label}: caixa ${pipNumber}, ${damageState === 'none' ? 'vazia' : damageState}`}
            disabled={disabled}
            key={index}
            onClick={() => handlePipClick(index)}
            style={(index + 1) % 5 === 0 && index < max - 1 ? { marginRight: 8 } : undefined}
          />
        )
      })}
    </span>
  )
}

function StainPips({ value, max, onChange, disabled = false }) {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), max)

  return (
    <span className={`${styles.squarePips} ${styles.stainPips}`} role="group" aria-label="Manchas">
      {Array.from({ length: max }, (_, index) => {
        const reversedIndex = max - 1 - index
        const filled = reversedIndex < safeValue
        return (
          <button
            type="button"
            className={`${styles.damagePip} ${filled ? styles.superficial : styles.none}`}
            aria-label={`Manchas: ${reversedIndex + 1}`}
            aria-pressed={filled}
            disabled={disabled}
            key={index}
            onClick={() => onChange(filled ? reversedIndex : reversedIndex + 1)}
          />
        )
      })}
    </span>
  )
}

function TraitControl({
  label,
  description,
  value,
  min,
  max,
  onChange,
  disabled = false,
  canSelect,
  getTitle,
  specialties = [],
  canAddSpecialty = false,
  onAddSpecialty,
}) {
  return (
    <div className={styles.trait} title={description}>
      <span>
        <span className={styles.traitNameLine}>
          <strong>{label}</strong>
          {specialties.map((specialty, index) => (
            <b className={styles.specialtyBadge} key={`${specialty.name}-${index}`}>
              {specialty.name}
            </b>
          ))}
          {canAddSpecialty ? (
            <button
              type="button"
              className={styles.inlineAddButton}
              aria-label={`Adicionar especialidade em ${label}`}
              onClick={onAddSpecialty}
            >
              +
            </button>
          ) : null}
        </span>
        <small>{description}</small>
      </span>
      <RoundPips
        label={label}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        disabled={disabled}
        canSelect={canSelect}
        getTitle={getTitle}
      />
    </div>
  )
}

function CharacterEditor({
  storedCharacter,
  onBack,
  onSaved,
  accessMode = 'owner',
  chronicleLink = null,
}) {
  const initialCharacter = useMemo(
    () => vtmV5System.character.parse(storedCharacter.character_data),
    [storedCharacter.character_data],
  )
  const [character, setCharacter] = useState(() => cloneCharacter(initialCharacter))
  const [serverCharacter, setServerCharacter] = useState(storedCharacter)
  const [activeTab, setActiveTab] = useState('session')
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [notice, setNotice] = useState(null)
  const [xpEvents, setXpEvents] = useState([])
  const [isLoadingXp, setIsLoadingXp] = useState(true)
  const [isSpendingXp, setIsSpendingXp] = useState(false)
  const [chronicles, setChronicles] = useState([])
  const [chronicleLinks, setChronicleLinks] = useState(() =>
    chronicleLink ? [chronicleLink] : [],
  )
  const [isLoadingShares, setIsLoadingShares] = useState(accessMode === 'owner')
  const [busyShareId, setBusyShareId] = useState('')
  const [newSpecialty, setNewSpecialty] = useState({ skill: '', name: '' })
  const [evolutionMeritSearch, setEvolutionMeritSearch] = useState('')
  const [sheetPicker, setSheetPicker] = useState(null)
  const [sheetPickerSearch, setSheetPickerSearch] = useState('')
  const [touchstoneDraft, setTouchstoneDraft] = useState({
    name: '',
    conviction: '',
    description: '',
  })
  const [portraitUrl, setPortraitUrl] = useState('')
  const [isUploadingPortrait, setIsUploadingPortrait] = useState(false)
  const isOwnerView = accessMode === 'owner'
  const isReadOnly = accessMode === 'gm-readonly'
  const visibleTabs = isOwnerView
    ? SHEET_MODES
    : SHEET_MODES.filter((tab) => !['evolution', 'chronicles'].includes(tab.id))

  const clanEntries = Object.entries(vtmV5System.catalogs.clans).filter(
    ([key]) => key,
  )
  const predatorEntries = Object.entries(
    vtmV5System.catalogs.predatorTypes,
  ).filter(([key]) => key)
  const traitMaximum = vtmV5System.rules.generation.maxTraitByGeneration(
    character.generation,
  )
  const availableExperience = vtmV5System.rules.xp.getAvailableXP(character)

  useEffect(() => {
    if (!isOwnerView) {
      return undefined
    }
    let isActive = true
    listCharacterXpEvents(storedCharacter.id)
      .then((events) => {
        if (isActive) setXpEvents(events)
      })
      .catch(() => {
        if (isActive) setXpEvents([])
      })
      .finally(() => {
        if (isActive) setIsLoadingXp(false)
      })

    return () => {
      isActive = false
    }
  }, [isOwnerView, storedCharacter.id])

  useEffect(() => {
    if (!isOwnerView) return undefined
    return subscribeToCharacter({
      characterId: storedCharacter.id,
      onChange: (payload) => {
        const saved = payload.new
        if (!saved?.character_data) return
        if (isDirty) {
          setNotice({ type: 'info', text: 'Esta ficha foi atualizada em outra janela. Salve ou descarte suas edições locais antes de recarregá-la.' })
          return
        }
        try {
          const next = vtmV5System.character.parse(saved.character_data)
          setCharacter(cloneCharacter(next))
          setServerCharacter(saved)
          setNotice({ type: 'success', text: 'Ficha atualizada.' })
        } catch {
          // Uma ficha inválida jamais deve substituir o rascunho aberto.
        }
      },
    })
  }, [isDirty, isOwnerView, storedCharacter.id])

  useEffect(() => {
    let isActive = true
    if (!serverCharacter.portrait_path) return undefined

    getCharacterPortraitUrl(serverCharacter.portrait_path)
      .then((url) => {
        if (isActive) setPortraitUrl(url)
      })
      .catch(() => {
        if (isActive) setPortraitUrl('')
      })

    return () => {
      isActive = false
    }
  }, [serverCharacter.portrait_path])

  useEffect(() => {
    if (!isOwnerView) return undefined
    let isActive = true

    Promise.all([
      listAvailableChronicles(),
      listCharacterChronicleLinks(storedCharacter.id),
    ])
      .then(([nextChronicles, nextLinks]) => {
        if (!isActive) return
        setChronicles(nextChronicles)
        setChronicleLinks(nextLinks)
      })
      .catch((error) => {
        if (isActive) {
          setNotice({
            type: 'error',
            text: error?.message || 'Não foi possível carregar as crônicas.',
          })
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingShares(false)
      })

    return () => {
      isActive = false
    }
  }, [isOwnerView, storedCharacter.id])

  function changeCharacter(recipe) {
    if (isReadOnly) return
    setCharacter((current) => {
      const next = cloneCharacter(current)
      recipe(next)
      return next
    })
    setIsDirty(true)
    setNotice(null)
  }

  function changeField(field, value) {
    changeCharacter((next) => {
      next[field] = value
    })
  }

  function changeEphemeral(field, value) {
    changeCharacter((next) => {
      next.ephemeral[field] = value
    })
  }

  function handleBack() {
    if (isDirty && !window.confirm('Sair sem salvar as alterações desta ficha?')) {
      return
    }

    onBack()
  }

  async function handleSave() {
    if (isReadOnly) return
    setIsSaving(true)
    setNotice(null)

    try {
      const validated = vtmV5System.character.parse(character)
      const saved = await updateCharacter({
        characterId: serverCharacter.id,
        expectedVersion: serverCharacter.version,
        name: validated.name,
        schemaVersion: vtmV5System.character.currentSchemaVersion,
        characterData: validated,
        portraitPath: serverCharacter.portrait_path,
      })

      setCharacter(cloneCharacter(validated))
      setServerCharacter(saved)
      setIsDirty(false)
      setNotice({ type: 'success', text: 'Ficha salva com segurança.' })
      onSaved(saved)
    } catch (error) {
      setNotice({
        type: 'error',
        text: error?.message || 'Não foi possível salvar a ficha.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  function handleExport() {
    const validated = vtmV5System.character.parse(character)
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
    setNotice({ type: 'success', text: 'Cópia JSON exportada.' })
  }

  async function handlePortraitFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (isDirty) {
      setNotice({ type: 'error', text: 'Salve as alterações da ficha antes de trocar o retrato.' })
      return
    }

    setIsUploadingPortrait(true)
    setNotice(null)
    let uploadedPath = ''
    let portraitPersisted = false
    try {
      const portraitPath = await uploadCharacterPortrait({
        characterId: serverCharacter.id,
        file,
      })
      uploadedPath = portraitPath
      const previousPortraitPath = serverCharacter.portrait_path
      const saved = await updateCharacter({
        characterId: serverCharacter.id,
        expectedVersion: serverCharacter.version,
        portraitPath,
      })
      portraitPersisted = true
      setServerCharacter(saved)
      setPortraitUrl(await getCharacterPortraitUrl(portraitPath).catch(() => ''))
      onSaved(saved)
      if (previousPortraitPath && previousPortraitPath !== portraitPath) {
        void removeLibraryPortraitIfUnused(previousPortraitPath).catch(() => {})
      }
      setNotice({ type: 'success', text: 'Retrato atualizado.' })
    } catch (error) {
      if (uploadedPath && !portraitPersisted) {
        void removeLibraryPortrait(uploadedPath).catch(() => {})
      }
      setNotice({ type: 'error', text: error?.message || 'Não foi possível enviar o retrato.' })
    } finally {
      setIsUploadingPortrait(false)
    }
  }

  async function handleRemovePortrait() {
    const previousPortraitPath = serverCharacter.portrait_path
    if (!previousPortraitPath || isUploadingPortrait) return
    if (isDirty) {
      setNotice({ type: 'error', text: 'Salve as alterações da ficha antes de remover o retrato.' })
      return
    }

    setIsUploadingPortrait(true)
    setNotice(null)
    try {
      const saved = await updateCharacter({
        characterId: serverCharacter.id,
        expectedVersion: serverCharacter.version,
        portraitPath: null,
      })
      setServerCharacter(saved)
      setPortraitUrl('')
      onSaved(saved)
      void removeLibraryPortraitIfUnused(previousPortraitPath).catch(() => {})
      setNotice({ type: 'success', text: 'Retrato removido.' })
    } catch (error) {
      setNotice({ type: 'error', text: error?.message || 'Não foi possível remover o retrato.' })
    } finally {
      setIsUploadingPortrait(false)
    }
  }

  async function purchaseUpgrade({ label, cost, category, details, mutate }) {
    if (isDirty) {
      setNotice({
        type: 'error',
        text: 'Salve as alterações livres antes de gastar XP.',
      })
      return false
    }
    if (availableExperience < cost) {
      setNotice({ type: 'error', text: `XP insuficiente: esta evolução custa ${cost}.` })
      return false
    }
    setIsSpendingXp(true)
    setNotice(null)
    try {
      const next = cloneCharacter(character)
      mutate(next)
      next.ephemeral.experienceSpent += cost
      const recalculated = recalculateCharacter(next, {
        preserveBloodPotency: true,
        preserveHumanity: true,
      })
      const validated = vtmV5System.character.parse(recalculated)
      const saved = await spendCharacterXp({
        characterId: serverCharacter.id,
        expectedVersion: serverCharacter.version,
        cost,
        reason: label,
        characterData: validated,
        details: { category, label, ...details },
      })

      setCharacter(cloneCharacter(validated))
      setServerCharacter(saved)
      setIsDirty(false)
      setNotice({ type: 'success', text: `${label} adquirido por ${cost} XP.` })
      onSaved(saved)
      setXpEvents(await listCharacterXpEvents(saved.id))
      return true
    } catch (error) {
      setNotice({
        type: 'error',
        text: error?.message || 'Não foi possível concluir a evolução.',
      })
      return false
    } finally {
      setIsSpendingXp(false)
    }
  }

  async function handleRefundPurchase(event) {
    if (isDirty) {
      setNotice({
        type: 'error',
        text: 'Salve as alterações livres antes de estornar uma compra.',
      })
      return
    }

    const reason = window.prompt(
      `Motivo do estorno de “${event.reason || 'compra de XP'}”:`,
      'Compra feita por engano',
    )
    if (reason === null) return

    setIsSpendingXp(true)
    setNotice(null)
    try {
      const saved = await refundCharacterXpPurchase({
        eventId: event.id,
        expectedVersion: serverCharacter.version,
        reason,
      })
      const parsed = vtmV5System.character.parse(saved.character_data)
      setCharacter(cloneCharacter(parsed))
      setServerCharacter(saved)
      setIsDirty(false)
      onSaved(saved)
      setXpEvents(await listCharacterXpEvents(saved.id))
      setNotice({ type: 'success', text: 'Compra estornada e XP devolvido.' })
    } catch (error) {
      setNotice({
        type: 'error',
        text: error?.message || 'Não foi possível estornar a compra.',
      })
    } finally {
      setIsSpendingXp(false)
    }
  }

  async function reloadChronicleLinks() {
    const links = await listCharacterChronicleLinks(serverCharacter.id)
    setChronicleLinks(links)
    return links
  }

  async function handleShare(campaign) {
    setBusyShareId(campaign.id)
    setNotice(null)
    try {
      await shareCharacterWithChronicle({
        characterId: serverCharacter.id,
        campaignId: campaign.id,
      })
      await reloadChronicleLinks()
      setNotice({
        type: 'success',
        text: `${character.name} agora está disponível em ${campaign.name}.`,
      })
    } catch (error) {
      setNotice({ type: 'error', text: error?.message || 'Não foi possível compartilhar.' })
    } finally {
      setBusyShareId('')
    }
  }

  async function handleUnshare(link, campaignName) {
    if (!window.confirm(`Remover esta ficha de “${campaignName}”? O personagem não será apagado.`)) {
      return
    }
    setBusyShareId(link.campaign_id)
    setNotice(null)
    try {
      await setCharacterShareArchived({ linkId: link.id, archived: true })
      await reloadChronicleLinks()
      setNotice({ type: 'success', text: `Ficha removida de ${campaignName}.` })
    } catch (error) {
      setNotice({ type: 'error', text: error?.message || 'Não foi possível remover a ficha.' })
    } finally {
      setBusyShareId('')
    }
  }

  async function handleGmPermission(link, allowed) {
    setBusyShareId(link.campaign_id)
    setNotice(null)
    try {
      await setGmCharacterEditPermission({ linkId: link.id, allowed })
      await reloadChronicleLinks()
      setNotice({
        type: 'success',
        text: allowed
          ? 'O Narrador agora pode editar esta ficha.'
          : 'A edição pelo Narrador foi desativada.',
      })
    } catch (error) {
      setNotice({ type: 'error', text: error?.message || 'Não foi possível alterar a permissão.' })
    } finally {
      setBusyShareId('')
    }
  }

  function renderIdentity(mode) {
    const selectedClan = vtmV5System.catalogs.clans[character.clan]
    const isFreeMode = mode === 'sheet'

    return (
      <section className={styles.progenyIdentity}>
        <div className={styles.identityHero}>
          <label className={styles.identityName}>
            <span>Nome</span>
            <input
              maxLength={120}
              value={character.name}
              disabled={!isFreeMode}
              onChange={(event) => changeField('name', event.target.value)}
              placeholder="Personagem sem nome"
            />
          </label>
          {selectedClan?.logo ? (
            <span
              className={styles.identityClanLogo}
              aria-hidden="true"
              style={{ '--clan-logo': `url(${selectedClan.logo})` }}
            />
          ) : <BookHeart className={styles.identityClanLogo} size={46} />}
        </div>

        <label className={styles.identityDescription}>
          <span>Conceito e descrição</span>
          <textarea
            rows="3"
            value={character.description}
            disabled={!isFreeMode}
            onChange={(event) => changeField('description', event.target.value)}
            placeholder="Descrição do personagem..."
          />
        </label>

        <div className={styles.identityColumns}>
          <div className={styles.sheetPickerCards}>
            <label>
              Clã
              <select disabled={!isFreeMode} value={character.clan} onChange={(event) => changeField('clan', event.target.value)}>
                <option value="">Não definido</option>
                {clanEntries.map(([key, clan]) => <option key={key} value={key}>{clan.displayName || clan.name}</option>)}
              </select>
            </label>
            <label>
              Tipo de predador
              <select
                disabled={!isFreeMode}
                value={character.predatorType.name}
                onChange={(event) => changeCharacter((next) => { next.predatorType.name = event.target.value })}
              >
                <option value="">Não definido</option>
                {predatorEntries.map(([key, predator]) => <option key={key} value={key}>{predator.name}</option>)}
              </select>
            </label>
          </div>

          <div>
            <label>
              Ambição
              <input disabled={!isFreeMode} value={character.ambition} onChange={(event) => changeField('ambition', event.target.value)} />
            </label>
            <label>
              Desejo
              <input disabled={!isFreeMode} value={character.desire} onChange={(event) => changeField('desire', event.target.value)} />
            </label>
            <label>
              Jogador
              <input disabled={!isFreeMode} maxLength={120} value={character.player} onChange={(event) => changeField('player', event.target.value)} />
            </label>
          </div>

          <div>
            <label>
              Geração
              <input disabled={!isFreeMode} type="number" min="0" max="14" value={character.generation} onChange={(event) => changeField('generation', Number(event.target.value))} />
            </label>
            <label>
              Senhor(a)
              <input disabled={!isFreeMode} maxLength={120} value={character.sire} onChange={(event) => changeField('sire', event.target.value)} />
            </label>
          </div>
        </div>
      </section>
    )
  }

  function renderTraits(mode) {
    const isGameMode = mode === 'session'
    const isXpMode = mode === 'evolution'
    const isFreeMode = mode === 'sheet'

    return (
      <div className={styles.traitsPage}>
        <section className={styles.panel}>
          <header>
            <h2>Atributos</h2>
          </header>
          <div className={styles.traitGrid}>
            {ATTRIBUTE_GROUPS.map((group) => (
              <div key={group.label}>
                <h3>{group.label}</h3>
                {group.keys.map((key) => (
                  <TraitControl
                    key={key}
                    label={vtmV5System.catalogs.attributes.names[key]}
                    description={vtmV5System.catalogs.attributes.descriptions[key]}
                    value={character.attributes[key]}
                    min={1}
                    max={traitMaximum}
                    disabled={isGameMode}
                    canSelect={isXpMode
                      ? (value) => value === character.attributes[key] + 1 &&
                        availableExperience >= vtmV5System.rules.xp.getAttributeCost(value)
                      : undefined}
                    getTitle={isXpMode
                      ? (value) => value === character.attributes[key] + 1
                        ? `${vtmV5System.rules.xp.getAttributeCost(value)} XP`
                        : undefined
                      : undefined}
                    onChange={(value) => {
                      if (isXpMode) {
                        const cost = vtmV5System.rules.xp.getAttributeCost(value)
                        purchaseUpgrade({
                          label: `${vtmV5System.catalogs.attributes.names[key]} ${value}`,
                          cost,
                          category: 'attribute',
                          details: { field: key, level: value },
                          mutate: (next) => { next.attributes[key] = value },
                        })
                        return
                      }
                      changeCharacter((next) => {
                        next.attributes[key] = value
                        const recalculated = recalculateCharacter(next, {
                          preserveBloodPotency: true,
                          preserveHumanity: true,
                        })
                        next.maxHealth = recalculated.maxHealth
                        next.willpower = recalculated.willpower
                      })
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <header>
            <h2>Habilidades</h2>
          </header>
          <div className={styles.skillColumns}>
            {SKILL_GROUPS.map((group) => (
              <div key={group.label}>
                <h3>{group.label}</h3>
                {group.keys.map((key) => (
                  <TraitControl
                    key={key}
                    label={vtmV5System.catalogs.skills.names[key]}
                    description={vtmV5System.catalogs.skills.descriptions[key]}
                    value={character.skills[key]}
                    min={0}
                    max={traitMaximum}
                    disabled={isGameMode}
                    canSelect={isXpMode
                      ? (value) => value === character.skills[key] + 1 &&
                        availableExperience >= vtmV5System.rules.xp.getSkillCost(value)
                      : undefined}
                    getTitle={isXpMode
                      ? (value) => value === character.skills[key] + 1
                        ? `${vtmV5System.rules.xp.getSkillCost(value)} XP`
                        : undefined
                      : undefined}
                    specialties={character.skillSpecialties.filter((specialty) => specialty.skill === key)}
                    canAddSpecialty={(isFreeMode || isXpMode) && character.skills[key] > 0}
                    onAddSpecialty={() => {
                      setNewSpecialty({ skill: key, name: '' })
                      setSheetPicker({ type: 'specialty', mode })
                    }}
                    onChange={(value) => {
                      if (isXpMode) {
                        const cost = vtmV5System.rules.xp.getSkillCost(value)
                        purchaseUpgrade({
                          label: `${vtmV5System.catalogs.skills.names[key]} ${value}`,
                          cost,
                          category: 'skill',
                          details: { field: key, level: value },
                          mutate: (next) => { next.skills[key] = value },
                        })
                        return
                      }
                      changeCharacter((next) => { next.skills[key] = value })
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  function renderConditionTracks(sessionState, changeValue, { freeMode = false } = {}) {
    return (
      <div className={styles.sessionTracks}>
        <article>
          <strong>Vitalidade</strong>
          <RoundPips
            label="Vitalidade máxima"
            value={character.maxHealth}
            min={0}
            max={10}
            onChange={(value) => changeField('maxHealth', value)}
            disabled={!freeMode}
          />
          <DamagePips
            label="Dano de Vitalidade"
            max={character.maxHealth}
            superficial={sessionState.superficialDamage}
            aggravated={sessionState.aggravatedDamage}
            onChange={(superficial, aggravated) => {
              changeValue('superficialDamage', superficial)
              changeValue('aggravatedDamage', aggravated)
            }}
          />
        </article>

        <article>
          <strong>Força de Vontade</strong>
          <RoundPips
            label="Força de Vontade máxima"
            value={character.willpower}
            min={0}
            max={10}
            onChange={(value) => changeField('willpower', value)}
            disabled={!freeMode}
          />
          <DamagePips
            label="Dano de Força de Vontade"
            max={character.willpower}
            superficial={sessionState.superficialWillpowerDamage}
            aggravated={sessionState.aggravatedWillpowerDamage}
            onChange={(superficial, aggravated) => {
              changeValue('superficialWillpowerDamage', superficial)
              changeValue('aggravatedWillpowerDamage', aggravated)
            }}
          />
        </article>

        <article>
          <strong>Humanidade</strong>
          <div className={styles.humanityTracks}>
            <SquarePips
              label="Humanidade"
              value={character.humanity}
              max={10}
              groupSize={5}
              onChange={(value) => changeField('humanity', value)}
              disabled={!freeMode}
            />
            {character.humanity < 10 ? (
              <StainPips
                value={sessionState.humanityStains}
                max={10 - character.humanity}
                onChange={(value) => changeValue('humanityStains', value)}
              />
            ) : null}
          </div>
        </article>

        <article>
          <strong>Fome</strong>
          <SquarePips
            label="Fome"
            value={sessionState.hunger}
            max={vtmV5System.rules.hunger.getMaxHunger(character.bloodPotency)}
            onChange={(value) => changeValue('hunger', value)}
          />
        </article>
      </div>
    )
  }

  function getSessionSheetContext() {
    const activeLinks = chronicleLinks.filter((link) => !link.archived_at)
    return {
      activeLinks,
      sessionState: sessionStateWithDefaults(character.ephemeral, character),
      changeSessionValue: changeEphemeral,
    }
  }

  function renderSessionToolbar({ activeLinks }) {
    return (
      <section className={styles.sessionToolbar}>
        <div className={styles.sessionChronicleName}>
          <strong>Condições compartilhadas</strong>
          <small>
            Fome, dano e Máculas pertencem à ficha
            {activeLinks.length ? '.' : ', mesmo antes de compartilhá-la em uma crônica.'}
          </small>
        </div>
      </section>
    )
  }

  function renderBlood(mode) {
    const isGameMode = mode === 'session'
    const isXpMode = mode === 'evolution'
    const isFreeMode = mode === 'sheet'
    const effectLevel = vtmV5System.rules.bloodPotency.getBloodPotencyEffectLevel(
      character.bloodPotency,
    )
    const effects = vtmV5System.catalogs.bloodPotency.effects[effectLevel]
    const clan = vtmV5System.catalogs.clans[character.clan]
    const nextPotency = character.bloodPotency + 1
    const potencyCost = vtmV5System.rules.xp.getBloodPotencyCost(nextPotency)
    const potencyMaximum =
      vtmV5System.catalogs.bloodPotency.limitsByGeneration[character.generation]?.max ?? 10

    return (
      <section className={styles.bloodSection}>
        <h2>O Sangue</h2>
        <div className={styles.bloodPotencyRow}>
          <strong>Potência de Sangue:</strong>
          <RoundPips
            label="Potência de Sangue"
            value={character.bloodPotency}
            min={0}
            max={10}
            disabled={isGameMode}
            canSelect={isXpMode
              ? (value) => value === nextPotency && value <= potencyMaximum && availableExperience >= potencyCost
              : undefined}
            getTitle={isXpMode ? (value) => value === nextPotency ? `${potencyCost} XP` : undefined : undefined}
            getDisabledTitle={isXpMode ? (value) => {
              if (value !== nextPotency) return 'No modo XP, compre um nível por vez.'
              if (value > potencyMaximum) {
                return `Limite da ${character.generation}ª geração: Potência de Sangue ${potencyMaximum}.`
              }
              if (availableExperience < potencyCost) {
                return `XP insuficiente. Precisa de ${potencyCost}, tem ${availableExperience}.`
              }
              return undefined
            } : undefined}
            onChange={(value) => {
              if (isXpMode) {
                purchaseUpgrade({
                  label: `Potência de Sangue ${value}`,
                  cost: potencyCost,
                  category: 'blood-potency',
                  details: { level: value },
                  mutate: (next) => { next.bloodPotency = value },
                })
                return
              }
              changeField('bloodPotency', value)
            }}
          />
        </div>
        <div className={styles.bloodGrid}>
          <article>
            <div className={styles.bloodStatsLine}>
              <strong>Surto de Sangue</strong><b>{effects?.surge ?? 0}</b>
              <i />
              <strong>Gravidade da Perdição</strong><b>{effects?.bane ?? 0}</b>
            </div>
            <div className={styles.xpLine}>
              <strong>XP:</strong>
              {isFreeMode ? (
                <input
                  aria-label="XP gasto"
                  type="number"
                  min="0"
                  value={character.ephemeral.experienceSpent}
                  onChange={(event) => changeEphemeral('experienceSpent', Math.max(0, Number(event.target.value) || 0))}
                />
              ) : <span>{character.ephemeral.experienceSpent}</span>}
              <b>/</b>
              {isFreeMode ? (
                <input
                  aria-label="XP total"
                  type="number"
                  min="0"
                  value={character.experience}
                  onChange={(event) => changeField('experience', Math.max(0, Number(event.target.value) || 0))}
                />
              ) : <span>{character.experience}</span>}
            </div>
            <label className={styles.capitalLine}>
              <strong>Capital Líquido</strong>
              <input
                type="number"
                min="0"
                max="999"
                value={character.capitalLiquido}
                disabled={isGameMode}
                onChange={(event) => changeField('capitalLiquido', Math.max(0, Number(event.target.value) || 0))}
              />
              <small>Recursos {vtmV5System.rules.capital.getResourcesLevel(character)}</small>
            </label>
            <p>{vtmV5System.rules.capital.getCapitalLiquidoReading(character.capitalLiquido)}</p>
          </article>
          <article>
            <p><strong>Bônus de Poder:</strong> {effects?.discBonus || '—'}</p>
            <p><strong>Quantidade de Cura:</strong> {effects?.mend || '—'}</p>
          </article>
          <article>
            <h3>Penalidade de Alimentação</h3>
            <p>{effects?.penalty || '—'}</p>
          </article>
          <article>
            <h3>Características do Clã</h3>
            <p><strong>Perdição do Clã:</strong> {clan?.bane || '—'}</p>
            <p><strong>Compulsão do Clã:</strong> {clan?.compulsion || '—'}</p>
          </article>
        </div>
      </section>
    )
  }

  function renderNotes(mode) {
    return (
      <section className={`${styles.panel} ${styles.notesPanel}`}>
        <header>
          <h2>Anotações</h2>
        </header>
        <textarea
          aria-label="Anotações do personagem"
          placeholder="Registre relações, pistas, dívidas, objetivos e acontecimentos importantes..."
          value={character.notes}
          disabled={mode !== 'sheet'}
          onChange={(event) => changeField('notes', event.target.value)}
        />
      </section>
    )
  }

  function renderXpDisciplineCatalog() {
    const ownedPowerNames = new Set(character.disciplines.map((power) => power.name))
    const powerPrerequisitesMet = (power) =>
      (power.minimumHumanity || 0) <= character.humanity &&
      power.amalgamPrerequisites.every(
        (prerequisite) =>
          character.disciplines.filter(
            (candidate) => candidate.discipline === prerequisite.discipline,
          ).length >= prerequisite.level,
      ) &&
      (power.amalgamPrerequisiteOptions || []).every((options) =>
        options.some(
          (prerequisite) =>
            character.disciplines.filter(
              (candidate) => candidate.discipline === prerequisite.discipline,
            ).length >= prerequisite.level,
        ),
      ) &&
      (power.requiredPowerNames || []).every((requiredPowerName) =>
        character.disciplines.some((candidate) => candidate.name === requiredPowerName),
      )
    const disciplineOptions = Object.entries(vtmV5System.catalogs.disciplines)
      .filter(([name]) => name)
      .map(([name, discipline]) => ({
        name,
        discipline,
        powers: vtmV5System.rules.disciplines
          .getAvailablePowersForCharacter(character, name)
          .filter(powerPrerequisitesMet),
      }))
      .filter(({ powers }) => powers.length)

    if (!disciplineOptions.length) return null

    return (
      <section className={`${styles.panel} ${styles.xpDisciplinePanel}`}>
        <header>
          <span>Poderes vampíricos</span>
          <h2>Comprar Disciplinas</h2>
        </header>
        <div className={styles.purchaseCatalog}>
          {disciplineOptions.map(({ name, discipline, powers }) => {
            const cost = vtmV5System.rules.xp.getDisciplineCost(character, name)
            return (
              <details key={name}>
                <summary>
                  {discipline.logo ? <img src={discipline.logo} alt="" /> : null}
                  <span>
                    <strong>{vtmV5System.rules.translations.translateDiscipline(name)}</strong>
                    <small>{powers.length} poder(es) disponível(is) · {cost} XP</small>
                  </span>
                </summary>
                <div>
                  {powers.map((power) => (
                    <article key={power.name}>
                      <span>
                        <strong>{power.name}</strong>
                        <small>Nível {power.level}</small>
                      </span>
                      <p>{power.summary}</p>
                      {power.legacy ? <small>Legado de Sangue: {power.legacy}</small> : null}
                      <button
                        type="button"
                        disabled={isSpendingXp || availableExperience < cost || ownedPowerNames.has(power.name)}
                        onClick={() => {
                          purchaseUpgrade({
                            label: `${vtmV5System.rules.translations.translateDiscipline(name)}: ${power.name}`,
                            cost,
                            category: 'discipline',
                            details: { discipline: name, power: power.name, level: power.level },
                            mutate: (next) => { next.disciplines.push(power) },
                          })
                        }}
                      >
                        <Plus size={13} /> {cost} XP
                      </button>
                    </article>
                  ))}
                </div>
              </details>
            )
          })}
        </div>
      </section>
    )
  }

  function renderPowers(mode, conditionState = character.ephemeral, changeConditionValue = changeEphemeral) {
    const isFreeMode = mode === 'sheet'
    const isXpMode = mode === 'evolution'
    const canAddSheetContent = isFreeMode || isXpMode
    const canAddDirectly = isFreeMode
    const disciplineNames = Array.from(
      new Set(character.disciplines.map((power) => power.discipline)),
    )
    const resolved =
      vtmV5System.rules.meritsAndFlaws.getResolvedMeritsAndFlaws(character)

    return (
      <div className={styles.powersPage}>
        <section className={styles.panel}>
          <header>
            <h2>Disciplinas e poderes</h2>
          </header>
          {disciplineNames.length || canAddDirectly ? (
            <div className={styles.disciplineList}>
              {disciplineNames.map((disciplineName) => {
                const discipline = vtmV5System.catalogs.disciplines[disciplineName]
                const powers = character.disciplines.filter(
                  (power) => power.discipline === disciplineName,
                )
                return (
                  <article key={disciplineName}>
                    <header>
                      {discipline?.logo ? <img src={discipline.logo} alt="" /> : null}
                      <div>
                        <strong>
                          {vtmV5System.rules.translations.translateDiscipline(disciplineName)}
                        </strong>
                        <small>
                          Nível {powers.filter((power) => !power.isExtraPower).length}
                        </small>
                      </div>
                    </header>
                    <div>
                      {powers.map((power) => (
                        <div key={power.name}>
                          <span>
                            <strong>{power.name}</strong>
                            <b>{power.level}</b>
                            {isFreeMode ? (
                              <button
                                type="button"
                                className={styles.removeSheetItem}
                                aria-label={`Remover ${power.name}`}
                                onClick={() => changeCharacter((next) => {
                                  next.disciplines = next.disciplines.filter((candidate) => candidate.name !== power.name)
                                })}
                              >
                                ×
                              </button>
                            ) : null}
                          </span>
                          <p>{power.summary}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                )
              })}
              {canAddDirectly ? (
                <button
                  type="button"
                  className={styles.addSheetCard}
                  aria-label="Adicionar poder de Disciplina"
                  onClick={() => setSheetPicker({ type: 'discipline', mode })}
                >
                  <Plus size={26} />
                </button>
              ) : null}
            </div>
          ) : (
            <p className={styles.mutedEmpty}>Nenhum poder registrado.</p>
          )}
        </section>

        {isXpMode ? renderXpDisciplineCatalog() : null}

        <details className={`${styles.panel} ${styles.collapsiblePanel}`}>
          <summary>
            <span>
              <small>Conhecimento oculto</small>
              <strong>Rituais e Cerimônias</strong>
            </span>
            <em>{[...character.rituals, ...character.ceremonies].length} registrado(s)</em>
          </summary>
          <div className={styles.collapsibleContent}>
            {[...character.rituals, ...character.ceremonies].length ? (
              <div className={styles.riteList}>
                {[...character.rituals, ...character.ceremonies].map((rite) => (
                  <article key={rite.name}>
                    <span>
                      <strong>{rite.name}</strong>
                      <b>Nível {rite.level}</b>
                    </span>
                    <p>{rite.summary}</p>
                    <small>{rite.requiredTime} · {rite.dicePool}</small>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.mutedEmpty}>Nenhum rito registrado.</p>
            )}
            {canAddSheetContent ? (
              <button
                type="button"
                className={styles.addSheetCard}
                aria-label="Adicionar Ritual ou Cerimônia"
                onClick={() => setSheetPicker({ type: 'rite', mode })}
              >
                <Plus size={24} />
              </button>
            ) : null}
          </div>
        </details>

        <section className={styles.bottomDataSection}>
          {renderConditionTracks(conditionState, changeConditionValue, { freeMode: mode === 'sheet' })}
        </section>

        {renderBlood(mode)}

        <section className={styles.panel}>
          <header>
            <h2>Pilares e Convicções</h2>
          </header>
          {character.touchstones.length ? (
            <div className={styles.touchstoneList}>
              {character.touchstones.map((touchstone, index) => (
                <article key={`${touchstone.name}-${index}`}>
                  <strong>{touchstone.name || `Pilar ${index + 1}`}</strong>
                  <b>{touchstone.conviction || 'Sem Convicção registrada'}</b>
                  <p>{touchstone.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.mutedEmpty}>Nenhum Pilar registrado.</p>
          )}
          {isFreeMode ? (
            <button
              type="button"
              className={styles.addSheetCard}
              aria-label="Adicionar Pilar"
              onClick={() => setSheetPicker({ type: 'touchstone', mode })}
            >
              <Plus size={24} />
            </button>
          ) : null}
        </section>

        <details className={`${styles.panel} ${styles.collapsiblePanel}`}>
          <summary>
            <span>
              <small>Qualidades e complicações</small>
              <strong>Vantagens e Defeitos</strong>
            </span>
            <em>{[...resolved.merits, ...resolved.flaws].length} registrado(s)</em>
          </summary>
          <div className={styles.collapsibleContent}>
            <div className={styles.meritColumns}>
              <section>
                <h3>Vantagens</h3>
                <div className={styles.meritList}>
                {resolved.merits.map(({ meritFlaw, isFromPredatorType }) => (
                  <article key={`merit-${meritFlaw.name}`}>
                    <span>Vantagem</span>
                    <strong>{meritFlaw.name} · {meritFlaw.level}</strong>
                    <p>{meritFlaw.summary}</p>
                    {isFromPredatorType ? <small>Concedida pelo tipo de predador</small> : null}
                  </article>
                ))}
                </div>
                {canAddSheetContent ? (
                  <button
                    type="button"
                    className={styles.addSheetCard}
                    aria-label="Adicionar Vantagem"
                    onClick={() => setSheetPicker({ type: 'merit', allowedKind: 'merit', mode })}
                  >
                    <Plus size={24} />
                  </button>
                ) : null}
              </section>
              <section>
                <h3>Defeitos</h3>
                <div className={styles.meritList}>
                {resolved.flaws.map(({ meritFlaw, isFromPredatorType }) => (
                  <article className={styles.flawCard} key={`flaw-${meritFlaw.name}`}>
                    <span>Defeito</span>
                    <strong>{meritFlaw.name} · {meritFlaw.level}</strong>
                    <p>{meritFlaw.summary}</p>
                    {isFromPredatorType ? <small>Concedido pelo tipo de predador</small> : null}
                  </article>
                ))}
                </div>
                {isFreeMode ? (
                  <button
                    type="button"
                    className={styles.addSheetCard}
                    aria-label="Adicionar Defeito"
                    onClick={() => setSheetPicker({ type: 'merit', allowedKind: 'flaw', mode })}
                  >
                    <Plus size={24} />
                  </button>
                ) : null}
              </section>
            </div>
          </div>
        </details>
      </div>
    )
  }

  function renderEvolution() {
    const generationTraitMaximum =
      vtmV5System.rules.generation.maxTraitByGeneration(character.generation)
    const potencyMaximum =
      vtmV5System.catalogs.bloodPotency.limitsByGeneration[character.generation]?.max ?? 5
    const ownedPowerNames = new Set(character.disciplines.map((power) => power.name))
    const powerPrerequisitesMet = (power) =>
      (power.minimumHumanity || 0) <= character.humanity &&
      power.amalgamPrerequisites.every(
        (prerequisite) =>
          character.disciplines.filter(
            (candidate) => candidate.discipline === prerequisite.discipline,
          ).length >= prerequisite.level,
      ) &&
      (power.amalgamPrerequisiteOptions || []).every((options) =>
        options.some(
          (prerequisite) =>
            character.disciplines.filter(
              (candidate) => candidate.discipline === prerequisite.discipline,
            ).length >= prerequisite.level,
        ),
      ) &&
      (power.requiredPowerNames || []).every((requiredPowerName) =>
        character.disciplines.some((candidate) => candidate.name === requiredPowerName),
      )
    const disciplineOptions = Object.entries(vtmV5System.catalogs.disciplines)
      .filter(([name]) => name)
      .map(([name, discipline]) => ({
        name,
        discipline,
        powers: vtmV5System.rules.disciplines
          .getAvailablePowersForCharacter(character, name)
          .filter(powerPrerequisitesMet),
      }))
      .filter(({ powers }) => powers.length)
    const bloodSorceryLevel = character.disciplines.filter(
      (power) => power.discipline === 'blood sorcery',
    ).length
    const oblivionLevel = character.disciplines.filter(
      (power) => power.discipline === 'oblivion',
    ).length
    const availableRituals = vtmV5System.catalogs.rituals.filter(
      (ritual) =>
        ritual.level <= bloodSorceryLevel &&
        !character.rituals.some((owned) => owned.name === ritual.name),
    )
    const availableCeremonies = vtmV5System.catalogs.ceremonies.filter(
      (ceremony) =>
        ceremony.level <= oblivionLevel &&
        !character.ceremonies.some((owned) => owned.name === ceremony.name) &&
        vtmV5System.rules.ceremonies.characterHasCeremonyPrerequisite(
          character,
          ceremony,
        ),
    )
    const predatorMerits =
      vtmV5System.rules.meritsAndFlaws.getPredatorTypeMeritsByName(character)
    const clanExcludedMerits = new Set(
      vtmV5System.catalogs.clans[character.clan]?.excludedMeritsAndFlaws || [],
    )
    const meritSources = [
      ...vtmV5System.catalogs.meritsAndFlaws.flatMap((category) =>
        category.merits.map((item) => ({ item, source: category.title, sheet: null })),
      ),
      ...(character.clan === 'Thin-blood'
        ? vtmV5System.catalogs.thinbloodMeritsAndFlaws.merits.map((item) => ({
            item,
            source: 'Sangue-Ralo',
            sheet: null,
          }))
        : []),
      ...vtmV5System.catalogs.loresheets.flatMap((sheet) =>
        sheet.merits.map((item) => ({ item, source: sheet.title, sheet })),
      ),
    ]
    const uniqueMeritOptions = Array.from(
      new Map(meritSources.map((entry) => [entry.item.name, entry])).values(),
    )
    const meritSearch = evolutionMeritSearch.trim().toLocaleLowerCase('pt-BR')
    const visibleMeritOptions = uniqueMeritOptions
      .filter(({ item, source }) =>
        !meritSearch ||
        `${item.name} ${item.summary} ${source}`.toLocaleLowerCase('pt-BR').includes(meritSearch),
      )
      .slice(0, meritSearch ? 80 : 24)

    const UpgradeButton = ({ label, cost, disabled = false, onBuy }) => (
      <button
        type="button"
        aria-label={`Comprar ${label} por ${cost} XP`}
        disabled={disabled || isSpendingXp || availableExperience < cost}
        title={availableExperience < cost ? `Requer ${cost} XP` : `Comprar por ${cost} XP`}
        onClick={onBuy}
      >
        <Plus size={13} />
        {cost} XP
      </button>
    )

    return (
      <div className={styles.evolutionPage}>
        <section className={styles.xpHero}>
          <div>
            <small>Experiência disponível</small>
            <strong>{availableExperience}</strong>
            <span>{character.experience} recebidos · {character.ephemeral.experienceSpent} gastos</span>
          </div>
          <p>
            Cada compra é salva imediatamente e registrada no histórico. Não é possível
            reduzir características neste modo.
          </p>
        </section>

        <section className={styles.panel}>
          <header>
            <span>Evolução fundamental</span>
            <h2>Atributos</h2>
          </header>
          <div className={styles.upgradeGrid}>
            {Object.keys(vtmV5System.catalogs.attributes.names).map((key) => {
              const current = character.attributes[key]
              const nextLevel = current + 1
              const cost = vtmV5System.rules.xp.getAttributeCost(nextLevel)
              return (
                <article key={key}>
                  <span>
                    <strong>{vtmV5System.catalogs.attributes.names[key]}</strong>
                    <small>{current} → {Math.min(nextLevel, generationTraitMaximum)}</small>
                  </span>
                  <UpgradeButton
                    label={vtmV5System.catalogs.attributes.names[key]}
                    cost={cost}
                    disabled={current >= generationTraitMaximum}
                    onBuy={() =>
                      purchaseUpgrade({
                        label: `${vtmV5System.catalogs.attributes.names[key]} ${nextLevel}`,
                        cost,
                        category: 'attribute',
                        details: { field: key, level: nextLevel },
                        mutate: (next) => {
                          next.attributes[key] = nextLevel
                        },
                      })
                    }
                  />
                </article>
              )
            })}
          </div>
        </section>

        <section className={styles.panel}>
          <header>
            <span>Treinamento</span>
            <h2>Habilidades</h2>
          </header>
          <div className={styles.upgradeGrid}>
            {vtmV5System.catalogs.skills.keys.map((key) => {
              const current = character.skills[key]
              const nextLevel = current + 1
              const cost = vtmV5System.rules.xp.getSkillCost(nextLevel)
              return (
                <article key={key}>
                  <span>
                    <strong>{vtmV5System.catalogs.skills.names[key]}</strong>
                    <small>{current} → {Math.min(nextLevel, generationTraitMaximum)}</small>
                  </span>
                  <UpgradeButton
                    label={vtmV5System.catalogs.skills.names[key]}
                    cost={cost}
                    disabled={current >= generationTraitMaximum}
                    onBuy={() =>
                      purchaseUpgrade({
                        label: `${vtmV5System.catalogs.skills.names[key]} ${nextLevel}`,
                        cost,
                        category: 'skill',
                        details: { field: key, level: nextLevel },
                        mutate: (next) => {
                          next.skills[key] = nextLevel
                        },
                      })
                    }
                  />
                </article>
              )
            })}
          </div>
        </section>

        <section className={styles.panel}>
          <header>
            <span>Domínio específico</span>
            <h2>Nova Especialidade</h2>
          </header>
          <div className={styles.specialtyPurchase}>
            <label>
              Habilidade
              <select
                value={newSpecialty.skill}
                onChange={(event) => setNewSpecialty((current) => ({ ...current, skill: event.target.value }))}
              >
                <option value="">Escolha...</option>
                {vtmV5System.catalogs.skills.keys
                  .filter((key) => character.skills[key] > 0)
                  .map((key) => (
                    <option key={key} value={key}>{vtmV5System.catalogs.skills.names[key]}</option>
                  ))}
              </select>
            </label>
            <label>
              Nome da especialidade
              <input
                maxLength="120"
                placeholder="Ex.: Arrombamento, Espadas, História Antiga..."
                value={newSpecialty.name}
                onChange={(event) => setNewSpecialty((current) => ({ ...current, name: event.target.value }))}
              />
            </label>
            <button
              type="button"
              disabled={
                isSpendingXp ||
                availableExperience < vtmV5System.rules.xp.getSpecialtyCost() ||
                !newSpecialty.skill ||
                !newSpecialty.name.trim() ||
                character.skillSpecialties.some(
                  (specialty) =>
                    specialty.skill === newSpecialty.skill &&
                    specialty.name.toLocaleLowerCase('pt-BR') === newSpecialty.name.trim().toLocaleLowerCase('pt-BR'),
                )
              }
              onClick={() => {
                const specialty = { skill: newSpecialty.skill, name: newSpecialty.name.trim() }
                purchaseUpgrade({
                  label: `Especialidade: ${specialty.name}`,
                  cost: vtmV5System.rules.xp.getSpecialtyCost(),
                  category: 'specialty',
                  details: specialty,
                  mutate: (next) => next.skillSpecialties.push(specialty),
                }).then((purchased) => {
                  if (purchased) setNewSpecialty({ skill: '', name: '' })
                })
              }}
            >
              <Plus size={14} /> {vtmV5System.rules.xp.getSpecialtyCost()} XP
            </button>
          </div>
        </section>

        <section className={styles.panel}>
          <header>
            <span>Vantagens adquiridas</span>
            <h2>Vantagens e Folhas de Conhecimento</h2>
          </header>
          <label className={styles.evolutionSearch}>
            <Search size={15} />
            <input
              type="search"
              placeholder="Pesquisar Vantagem ou Folha de Conhecimento..."
              value={evolutionMeritSearch}
              onChange={(event) => setEvolutionMeritSearch(event.target.value)}
            />
          </label>
          <div className={styles.meritPurchases}>
            {visibleMeritOptions.map(({ item, source, sheet }) => {
              const ownedLevel = character.merits.find((merit) => merit.name === item.name)?.level || 0
              const predatorLevel = predatorMerits.get(item.name)?.level || 0
              const currentLevel = Math.max(ownedLevel, predatorLevel)
              const nextLevel = item.cost.find((level) => level > currentLevel)
              const excluded =
                clanExcludedMerits.has(item.name) ||
                [...character.merits, ...character.flaws].some(
                  (owned) => owned.excludes.includes(item.name) || item.excludes.includes(owned.name),
                ) ||
                Boolean(sheet && !sheet.requirementFunctions.every((rule) => rule(character)))
              const cost = nextLevel
                ? vtmV5System.rules.xp.getMeritCost(nextLevel, currentLevel)
                : 0

              return (
                <article key={item.name}>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{source}{currentLevel ? ` · nível atual ${currentLevel}` : ''}</small>
                  </span>
                  <p>{item.summary}</p>
                  {nextLevel ? (
                    <UpgradeButton
                      label={`${item.name} ${nextLevel}`}
                      cost={cost}
                      disabled={excluded}
                      onBuy={() =>
                        purchaseUpgrade({
                          label: `${item.name} ${nextLevel}`,
                          cost,
                          category: 'merit',
                          details: { name: item.name, level: nextLevel, source },
                          mutate: (next) => {
                            next.merits = [
                              ...next.merits.filter((merit) => merit.name !== item.name),
                              {
                                name: item.name,
                                level: nextLevel,
                                type: 'merit',
                                summary: item.summary,
                                excludes: item.excludes,
                              },
                            ]
                          },
                        })
                      }
                    />
                  ) : (
                    <b>Máximo adquirido</b>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <section className={styles.panel}>
          <header>
            <span>O Sangue</span>
            <h2>Potência de Sangue</h2>
          </header>
          <div className={styles.singleUpgrade}>
            <span>
              <strong>Nível atual: {character.bloodPotency}</strong>
              <small>Limite da {character.generation}ª geração: {potencyMaximum}</small>
            </span>
            <UpgradeButton
              label="Potência de Sangue"
              cost={vtmV5System.rules.xp.getBloodPotencyCost(character.bloodPotency + 1)}
              disabled={character.bloodPotency >= potencyMaximum}
              onBuy={() => {
                const nextLevel = character.bloodPotency + 1
                purchaseUpgrade({
                  label: `Potência de Sangue ${nextLevel}`,
                  cost: vtmV5System.rules.xp.getBloodPotencyCost(nextLevel),
                  category: 'blood-potency',
                  details: { level: nextLevel },
                  mutate: (next) => {
                    next.bloodPotency = nextLevel
                  },
                })
              }}
            />
          </div>
        </section>

        <section className={styles.panel}>
          <header>
            <span>Poderes vampíricos</span>
            <h2>Disciplinas</h2>
          </header>
          <div className={styles.purchaseCatalog}>
            {disciplineOptions.map(({ name, discipline, powers }) => {
              const cost = vtmV5System.rules.xp.getDisciplineCost(character, name)
              return (
                <details key={name}>
                  <summary>
                    {discipline.logo ? <img src={discipline.logo} alt="" /> : null}
                    <span>
                      <strong>{vtmV5System.rules.translations.translateDiscipline(name)}</strong>
                      <small>{powers.length} poder(es) disponível(is) · {cost} XP</small>
                    </span>
                  </summary>
                  <div>
                    {powers.map((power) => (
                      <article key={power.name}>
                        <span>
                          <strong>{power.name}</strong>
                          <small>Nível {power.level}</small>
                        </span>
                        <p>{power.summary}</p>
                        <UpgradeButton
                          label={power.name}
                          cost={cost}
                          disabled={ownedPowerNames.has(power.name)}
                          onBuy={() =>
                            purchaseUpgrade({
                              label: `${vtmV5System.rules.translations.translateDiscipline(name)}: ${power.name}`,
                              cost,
                              category: 'discipline',
                              details: { discipline: name, power: power.name, level: power.level },
                              mutate: (next) => {
                                next.disciplines.push(power)
                              },
                            })
                          }
                        />
                      </article>
                    ))}
                  </div>
                </details>
              )
            })}
          </div>
        </section>

        {[...availableRituals, ...availableCeremonies].length ? (
          <section className={styles.panel}>
            <header>
              <span>Conhecimento oculto</span>
              <h2>Novos ritos</h2>
            </header>
            <div className={styles.ritePurchases}>
              {[...availableRituals.map((rite) => ({ rite, kind: 'ritual' })),
                ...availableCeremonies.map((rite) => ({ rite, kind: 'ceremony' }))].map(
                ({ rite, kind }) => {
                  const cost = vtmV5System.rules.xp.getRitualCost(rite.level)
                  return (
                    <article key={`${kind}-${rite.name}`}>
                      <span>
                        <strong>{rite.name}</strong>
                        <small>{kind === 'ritual' ? 'Ritual' : 'Cerimônia'} · nível {rite.level}</small>
                      </span>
                      <p>{rite.summary}</p>
                      <UpgradeButton
                        label={rite.name}
                        cost={cost}
                        onBuy={() =>
                          purchaseUpgrade({
                            label: `${kind === 'ritual' ? 'Ritual' : 'Cerimônia'}: ${rite.name}`,
                            cost,
                            category: kind,
                            details: { name: rite.name, level: rite.level },
                            mutate: (next) => {
                              next[kind === 'ritual' ? 'rituals' : 'ceremonies'].push(rite)
                            },
                          })
                        }
                      />
                    </article>
                  )
                },
              )}
            </div>
          </section>
        ) : null}

        <section className={styles.panel}>
          <header>
            <span>Registro imutável</span>
            <h2>Histórico de XP</h2>
          </header>
          {isLoadingXp ? (
            <p className={styles.mutedEmpty}>Carregando histórico...</p>
          ) : xpEvents.length ? (
            <div className={styles.xpHistory}>
              {xpEvents.map((event) => {
                const wasRefunded = xpEvents.some(
                  (candidate) => candidate.reverses_event_id === event.id,
                )
                const canRefund =
                  event.event_type === 'spend' &&
                  event.details?.refundable === true &&
                  !wasRefunded &&
                  JSON.stringify(event.details?.purchasedCharacterData) ===
                    JSON.stringify(serverCharacter.character_data)

                return (
                <article key={event.id}>
                  <span className={event.xp_delta > 0 ? styles.positiveXp : styles.negativeXp}>
                    {event.xp_delta > 0 ? '+' : ''}{event.xp_delta} XP
                  </span>
                  <div>
                    <strong>{event.reason || event.event_type}</strong>
                    <small>{new Date(event.created_at).toLocaleString('pt-BR')}</small>
                  </div>
                  {canRefund ? (
                    <button
                      type="button"
                      className={styles.refundButton}
                      disabled={isSpendingXp}
                      onClick={() => handleRefundPurchase(event)}
                    >
                      <RotateCcw size={13} /> Estornar
                    </button>
                  ) : null}
                </article>
                )
              })}
            </div>
          ) : (
            <p className={styles.mutedEmpty}>
              Ainda não há eventos. O XP inicial da criação faz parte da ficha-base.
            </p>
          )}
        </section>
      </div>
    )
  }

  function renderChronicles() {
    const linkByCampaign = new Map(
      chronicleLinks.map((link) => [link.campaign_id, link]),
    )

    return (
      <div className={styles.sharingPage}>
        <section className={styles.shareIntro}>
          <Share2 size={24} />
          <div>
            <small>Ficha reutilizável</small>
            <h2>Compartilhar com crônicas</h2>
            <p>
              A ficha continua sendo sua. Compartilhar permite que o Narrador a consulte,
              conceda XP e a use naquela crônica. A edição completa permanece bloqueada até
              você autorizá-la explicitamente.
            </p>
          </div>
        </section>

        {isLoadingShares ? (
          <p className={styles.mutedEmpty}>Carregando suas crônicas...</p>
        ) : chronicles.length ? (
          <div className={styles.shareList}>
            {chronicles.map((campaign) => {
              const link = linkByCampaign.get(campaign.id)
              const isActive = link && !link.archived_at
              const isBusy = busyShareId === campaign.id

              return (
                <article key={campaign.id}>
                  <div>
                    <span className={isActive ? styles.sharedBadge : styles.privateBadge}>
                      {isActive ? 'Compartilhada' : 'Privada'}
                    </span>
                    <h3>{campaign.name}</h3>
                    <small>
                      {isActive
                        ? 'O Narrador pode consultar a ficha e conceder XP.'
                        : 'Somente você pode acessar esta ficha nesta crônica.'}
                    </small>
                  </div>

                  {isActive ? (
                    <div className={styles.shareControls}>
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(link.can_gm_edit)}
                          disabled={isBusy}
                          onChange={(event) => handleGmPermission(link, event.target.checked)}
                        />
                        <span>
                          <strong>Permitir edição pelo Narrador</strong>
                          <small>O Narrador poderá alterar os dados permanentes da ficha.</small>
                        </span>
                      </label>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleUnshare(link, campaign.name)}
                      >
                        Remover da crônica
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.shareButton}
                      disabled={isBusy}
                      onClick={() => handleShare(campaign)}
                    >
                      <Share2 size={15} />
                      {isBusy ? 'Compartilhando...' : 'Compartilhar ficha'}
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyShareState}>
            <Share2 size={28} />
            <strong>Você ainda não participa de uma crônica</strong>
            <p>Entre por um convite permanente; depois ela aparecerá aqui automaticamente.</p>
          </div>
        )}
      </div>
    )
  }

  function renderSheetPicker() {
    if (!sheetPicker) return null
    const isXpMode = sheetPicker.mode === 'evolution'
    const closePicker = () => {
      setSheetPicker(null)
      setSheetPickerSearch('')
    }
    const normalizedSearch = sheetPickerSearch.trim().toLocaleLowerCase('pt-BR')

    let title = ''
    let body = null

    if (sheetPicker.type === 'specialty') {
      const cost = vtmV5System.rules.xp.getSpecialtyCost()
      title = `Especialidade em ${vtmV5System.catalogs.skills.names[newSpecialty.skill] || 'Habilidade'}`
      body = (
        <form
          className={styles.sheetPickerForm}
          onSubmit={(event) => {
            event.preventDefault()
            const specialty = { skill: newSpecialty.skill, name: newSpecialty.name.trim() }
            if (!specialty.skill || !specialty.name) return
            if (isXpMode) {
              purchaseUpgrade({
                label: `Especialidade: ${specialty.name}`,
                cost,
                category: 'specialty',
                details: specialty,
                mutate: (next) => next.skillSpecialties.push(specialty),
              }).then((purchased) => {
                if (purchased) closePicker()
              })
              return
            }
            changeCharacter((next) => next.skillSpecialties.push(specialty))
            closePicker()
          }}
        >
          <label>
            Nome da especialidade
            <input
              autoFocus
              maxLength="120"
              placeholder="Ex.: Espadas, Política local, História Antiga..."
              value={newSpecialty.name}
              onChange={(event) => setNewSpecialty((current) => ({ ...current, name: event.target.value }))}
            />
          </label>
          <button type="submit" disabled={!newSpecialty.name.trim() || (isXpMode && availableExperience < cost)}>
            Adicionar{isXpMode ? ` · ${cost} XP` : ''}
          </button>
        </form>
      )
    }

    if (sheetPicker.type === 'discipline') {
      title = 'Adicionar poder de Disciplina'
      const powerOptions = Object.entries(vtmV5System.catalogs.disciplines)
        .filter(([name]) => name)
        .flatMap(([name, discipline]) =>
          vtmV5System.rules.disciplines
            .getAvailablePowersForCharacter(character, name)
            .map((power) => ({ name, discipline, power })),
        )
        .filter(({ name, power }) =>
          !normalizedSearch ||
          `${vtmV5System.rules.translations.translateDiscipline(name)} ${power.name} ${power.summary}`
            .toLocaleLowerCase('pt-BR')
            .includes(normalizedSearch),
        )

      body = (
        <div className={styles.sheetPickerCatalog}>
          <label className={styles.sheetPickerSearch}>
            <Search size={15} />
            <input
              autoFocus
              type="search"
              placeholder="Pesquisar Disciplina ou poder..."
              value={sheetPickerSearch}
              onChange={(event) => setSheetPickerSearch(event.target.value)}
            />
          </label>
          <div>
            {powerOptions.map(({ name, discipline, power }) => {
              const cost = vtmV5System.rules.xp.getDisciplineCost(character, name)
              return (
                <button
                  type="button"
                  disabled={isSpendingXp || (isXpMode && availableExperience < cost)}
                  key={`${name}-${power.name}`}
                  onClick={() => {
                    if (isXpMode) {
                      purchaseUpgrade({
                        label: `${vtmV5System.rules.translations.translateDiscipline(name)}: ${power.name}`,
                        cost,
                        category: 'discipline',
                        details: { discipline: name, power: power.name, level: power.level },
                        mutate: (next) => next.disciplines.push(power),
                      }).then((purchased) => { if (purchased) closePicker() })
                      return
                    }
                    changeCharacter((next) => next.disciplines.push(power))
                    closePicker()
                  }}
                >
                  <span>
                    {discipline.logo ? <img src={discipline.logo} alt="" /> : null}
                    <strong>{power.name}</strong>
                    <small>{vtmV5System.rules.translations.translateDiscipline(name)} · nível {power.level}</small>
                  </span>
                  <p>{power.summary}</p>
                  {isXpMode ? <b>{cost} XP</b> : <Plus size={16} />}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    if (sheetPicker.type === 'rite') {
      title = 'Adicionar Ritual ou Cerimônia'
      const bloodSorceryLevel = character.disciplines.filter(
        (power) => power.discipline === 'blood sorcery',
      ).length
      const oblivionLevel = character.disciplines.filter(
        (power) => power.discipline === 'oblivion',
      ).length
      const riteOptions = [
        ...vtmV5System.catalogs.rituals
          .filter((rite) => rite.level <= bloodSorceryLevel && !character.rituals.some((owned) => owned.name === rite.name))
          .map((rite) => ({ rite, kind: 'ritual' })),
        ...vtmV5System.catalogs.ceremonies
          .filter((rite) => rite.level <= oblivionLevel && !character.ceremonies.some((owned) => owned.name === rite.name))
          .map((rite) => ({ rite, kind: 'ceremony' })),
      ].filter(({ rite }) =>
        !normalizedSearch || `${rite.name} ${rite.summary}`.toLocaleLowerCase('pt-BR').includes(normalizedSearch),
      )
      const riteGroups = Array.from(
        riteOptions.reduce((groups, entry) => {
          const key = `${entry.kind}-${entry.rite.level}`
          const existing = groups.get(key) || {
            key,
            label: `${entry.kind === 'ritual' ? 'Rituais' : 'Cerimônias'} · Nível ${entry.rite.level}`,
            entries: [],
          }
          existing.entries.push(entry)
          groups.set(key, existing)
          return groups
        }, new Map()).values(),
      ).sort((first, second) => first.key.localeCompare(second.key, 'pt-BR', { numeric: true }))
      body = (
        <div className={styles.sheetPickerCatalog}>
          <label className={styles.sheetPickerSearch}>
            <Search size={15} />
            <input type="search" placeholder="Pesquisar rito..." value={sheetPickerSearch} onChange={(event) => setSheetPickerSearch(event.target.value)} />
          </label>
          <div className={styles.sheetPickerGroups}>
            {riteGroups.map((group) => (
              <section className={styles.sheetPickerGroup} key={group.key}>
                <h3>{group.label}</h3>
                <div className={styles.sheetPickerCards}>
                  {group.entries.map(({ rite, kind }) => {
                    const cost = vtmV5System.rules.xp.getRitualCost(rite.level)
                    return (
                      <button
                        type="button"
                        disabled={isSpendingXp || (isXpMode && availableExperience < cost)}
                        key={`${kind}-${rite.name}`}
                        onClick={() => {
                          if (isXpMode) {
                            purchaseUpgrade({
                              label: `${kind === 'ritual' ? 'Ritual' : 'Cerimônia'}: ${rite.name}`,
                              cost,
                              category: kind,
                              details: { name: rite.name, level: rite.level },
                              mutate: (next) => next[kind === 'ritual' ? 'rituals' : 'ceremonies'].push(rite),
                            }).then((purchased) => { if (purchased) closePicker() })
                            return
                          }
                          changeCharacter((next) => next[kind === 'ritual' ? 'rituals' : 'ceremonies'].push(rite))
                          closePicker()
                        }}
                      >
                        <span><strong>{rite.name}</strong><small>Nível {rite.level}</small></span>
                        <p>{rite.summary}</p>
                        {isXpMode ? <b>{cost} XP</b> : <Plus size={16} />}
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      )
    }

    if (sheetPicker.type === 'touchstone') {
      title = 'Adicionar Pilar e Convicção'
      body = (
        <form
          className={styles.sheetPickerForm}
          onSubmit={(event) => {
            event.preventDefault()
            if (!touchstoneDraft.name.trim() || !touchstoneDraft.conviction.trim()) return
            changeCharacter((next) => next.touchstones.push({
              name: touchstoneDraft.name.trim(),
              conviction: touchstoneDraft.conviction.trim(),
              description: touchstoneDraft.description.trim(),
            }))
            setTouchstoneDraft({ name: '', conviction: '', description: '' })
            closePicker()
          }}
        >
          <label>Nome do Pilar<input autoFocus value={touchstoneDraft.name} onChange={(event) => setTouchstoneDraft((current) => ({ ...current, name: event.target.value }))} /></label>
          <label>Convicção<input value={touchstoneDraft.conviction} onChange={(event) => setTouchstoneDraft((current) => ({ ...current, conviction: event.target.value }))} /></label>
          <label>Descrição<textarea rows="4" value={touchstoneDraft.description} onChange={(event) => setTouchstoneDraft((current) => ({ ...current, description: event.target.value }))} /></label>
          <button type="submit" disabled={!touchstoneDraft.name.trim() || !touchstoneDraft.conviction.trim()}>Adicionar Pilar</button>
        </form>
      )
    }

    if (sheetPicker.type === 'merit') {
      title = 'Adicionar Vantagem ou Defeito'
      const meritOptions = vtmV5System.catalogs.meritsAndFlaws.flatMap((category) => [
        ...category.merits.map((item) => ({ item, kind: 'merit', source: category.title })),
        ...(isXpMode ? [] : category.flaws.map((item) => ({ item, kind: 'flaw', source: category.title }))),
      ]).filter(({ item, source, kind }) =>
        (!sheetPicker.allowedKind || kind === sheetPicker.allowedKind) &&
        (!normalizedSearch || `${item.name} ${item.summary} ${source}`.toLocaleLowerCase('pt-BR').includes(normalizedSearch)),
      )
      const meritGroups = Array.from(
        meritOptions.reduce((groups, entry) => {
          const key = `${entry.kind}-${entry.source}`
          const existing = groups.get(key) || {
            key,
            label: `${entry.kind === 'merit' ? 'Vantagens' : 'Defeitos'} · ${entry.source}`,
            entries: [],
          }
          existing.entries.push(entry)
          groups.set(key, existing)
          return groups
        }, new Map()).values(),
      )
      body = (
        <div className={styles.sheetPickerCatalog}>
          <label className={styles.sheetPickerSearch}>
            <Search size={15} />
            <input type="search" placeholder="Pesquisar Vantagem ou Defeito..." value={sheetPickerSearch} onChange={(event) => setSheetPickerSearch(event.target.value)} />
          </label>
          <div className={styles.sheetPickerGroups}>
            {meritGroups.map((group) => (
              <section className={styles.sheetPickerGroup} key={group.key}>
                <h3>{group.label}</h3>
                <div className={styles.sheetPickerCards}>
                  {group.entries.slice(0, normalizedSearch ? 100 : 40).map(({ item, kind, source }) => {
                    const currentLevel = character[kind === 'merit' ? 'merits' : 'flaws'].find((owned) => owned.name === item.name)?.level || 0
                    const nextLevel = item.cost.find((level) => level > currentLevel)
                    if (!nextLevel) return null
                    const cost = isXpMode ? vtmV5System.rules.xp.getMeritCost(nextLevel, currentLevel) : 0
                    return (
                      <button
                        type="button"
                        disabled={isSpendingXp || (isXpMode && availableExperience < cost)}
                        key={`${kind}-${item.name}`}
                        onClick={() => {
                          const addItem = (next) => {
                            const field = kind === 'merit' ? 'merits' : 'flaws'
                            next[field] = [
                              ...next[field].filter((owned) => owned.name !== item.name),
                              { name: item.name, level: nextLevel, type: kind, summary: item.summary, excludes: item.excludes },
                            ]
                          }
                          if (isXpMode) {
                            purchaseUpgrade({
                              label: `${item.name} ${nextLevel}`,
                              cost,
                              category: kind,
                              details: { name: item.name, level: nextLevel, source },
                              mutate: addItem,
                            }).then((purchased) => { if (purchased) closePicker() })
                            return
                          }
                          changeCharacter(addItem)
                          closePicker()
                        }}
                      >
                        <span><strong>{item.name}</strong><small>{kind === 'merit' ? 'Vantagem' : 'Defeito'} · nível {nextLevel}</small></span>
                        <p>{item.summary}</p>
                        {isXpMode ? <b>{cost} XP</b> : <Plus size={16} />}
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      )
    }

    // Mantém o catálogo completo disponível para uma eventual restauração
    // administrativa sem recolocá-lo como uma página separada da ficha.
    if (sheetPicker.type === 'advanced-xp-catalog') {
      title = 'Catálogo completo de evolução'
      body = renderEvolution()
    }

    return (
      <div className={styles.sheetModalBackdrop} role="presentation" onMouseDown={closePicker}>
        <section className={styles.sheetModal} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
          <header><h2>{title}</h2><button type="button" aria-label="Fechar" onClick={closePicker}>×</button></header>
          {body}
        </section>
      </div>
    )
  }

  function renderFullSheet(mode) {
    const isGameMode = mode === 'session'
    const sessionContext = isGameMode ? getSessionSheetContext() : null
    const conditionState = sessionContext?.sessionState || character.ephemeral
    const changeConditionValue = sessionContext?.changeSessionValue || changeEphemeral

    return (
      <div
        className={`${styles.sheetMode} ${isGameMode ? styles.sessionStatePanel : ''} ${mode !== 'sheet' ? styles.lockedMode : ''}`}
      >
        {sessionContext ? renderSessionToolbar(sessionContext) : null}
        {renderIdentity(mode)}
        {renderTraits(mode)}
        {renderPowers(mode, conditionState, changeConditionValue)}
        {renderNotes(mode)}
      </div>
    )
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <button type="button" className={styles.backButton} onClick={handleBack}>
          <ArrowLeft size={18} />
          Personagens
        </button>
        <div className={styles.titleBlock}>
          <small>{vtmV5System.label}</small>
          <h1>{character.name || 'Personagem sem nome'}</h1>
        </div>
        <span className={isDirty ? styles.dirty : styles.savedState}>
          {isReadOnly
            ? 'Somente leitura'
            : isDirty
              ? 'Alterações não salvas'
              : accessMode === 'gm-edit'
                ? 'Edição autorizada pelo jogador'
                : 'Tudo salvo'}
        </span>
        {isOwnerView ? (
          <div className={styles.portraitActions}>
            <label className={styles.portraitHeaderButton}>
              {portraitUrl ? <img src={portraitUrl} alt="" /> : <ImageUp size={17} />}
              {isUploadingPortrait ? 'Enviando...' : 'Retrato'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={isUploadingPortrait}
                onChange={handlePortraitFile}
              />
            </label>
            {serverCharacter.portrait_path ? (
              <button
                type="button"
                className={styles.portraitRemoveButton}
                title="Remover retrato"
                aria-label="Remover retrato"
                disabled={isUploadingPortrait}
                onClick={handleRemovePortrait}
              >
                <ImageOff size={16} />
              </button>
            ) : null}
          </div>
        ) : null}
        <button type="button" className={styles.exportButton} onClick={handleExport}>
          <Download size={17} />
          Exportar JSON
        </button>
        {!isReadOnly ? (
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? <LoaderCircle className={styles.spin} size={17} /> : <Save size={17} />}
            {isSaving ? 'Salvando...' : 'Salvar ficha'}
          </button>
        ) : null}
      </header>

      <div className={styles.workspace}>
        <section className={styles.sheetFrame}>
        <nav className={styles.tabs} aria-label="Modos da ficha">
          {visibleTabs.map((tab) => {
            return (
              <button
                type="button"
                className={activeTab === tab.id ? styles.activeTab : undefined}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>

        {notice ? (
          <div className={notice.type === 'error' ? styles.error : styles.success}>
            {notice.type === 'error' ? <CircleAlert size={17} /> : <Check size={17} />}
            {notice.text}
          </div>
        ) : null}

        <div className={`${styles.content} ${isReadOnly ? styles.readOnlyContent : ''}`}>
          {activeTab !== 'chronicles' ? renderFullSheet(activeTab) : null}
          {activeTab === 'chronicles' ? renderChronicles() : null}
        </div>
        {renderSheetPicker()}
        </section>
      </div>
    </main>
  )
}

export default CharacterEditor
