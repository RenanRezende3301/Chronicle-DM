import { useMemo, useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Search,
  SkipForward,
} from 'lucide-react'
import { useAppContext } from '../../context/useAppContext.js'
import { useTurnTracker } from '../../hooks/useTurnTracker.js'
import { useNPCs } from '../../hooks/useNPCs.js'
import { useToast } from '../../hooks/useToast.js'
import { exportNPC } from '../../utils/exportImport.js'
import NPCDetail from '../NPCManager/NPCDetail.jsx'
import AddPCForm from './AddPCForm.jsx'
import DropZone from './DropZone.jsx'
import ParticipantCard from './ParticipantCard.jsx'
import styles from './TurnTracker.module.css'

function TurnTracker() {
  const { isTrackerMinimized, toggleTracker } = useAppContext()
  const {
    participants,
    currentTurnIndex,
    round,
    savedScenes,
    addPC,
    addParticipant,
    removeParticipant,
    updateParticipant,
    nextTurn,
    resetTurn,
    clearScene,
    saveScene,
    loadScene,
    adjustRound,
  } = useTurnTracker()
  const { npcs, updateNPC } = useNPCs()
  const toast = useToast()
  const [isAddingPC, setIsAddingPC] = useState(false)
  const [sceneName, setSceneName] = useState('')
  const [selectedSceneId, setSelectedSceneId] = useState('')
  const [mobileNpcQuery, setMobileNpcQuery] = useState('')
  const [detailNPC, setDetailNPC] = useState(null)
  const [detailParticipant, setDetailParticipant] = useState(null)
  const ToggleIcon = isTrackerMinimized ? ChevronLeft : ChevronRight
  const participantIds = useMemo(
    () => participants.map((participant) => participant.id),
    [participants],
  )
  const mobileNpcMatches = useMemo(() => {
    const query = mobileNpcQuery.trim().toLocaleLowerCase('pt-BR')
    const availableNPCs = npcs.filter((npc) => !participants.some(
      (participant) => participant.npcId === npc.id,
    ))

    if (!query) return availableNPCs

    return availableNPCs.filter((npc) => (
      `${npc.name || ''} ${npc.clan || ''} ${npc.concept || ''}`
        .toLocaleLowerCase('pt-BR')
        .includes(query)
    ))
  }, [mobileNpcQuery, npcs, participants])

  function handleSaveScene() {
    const savedScene = saveScene(sceneName)
    setSelectedSceneId(savedScene.id)
    setSceneName('')
    toast.success(`${savedScene.name} salva.`, 'Cena salva')
  }

  function handleViewSheet(participant) {
    const npc = npcs.find((item) => item.id === participant.npcId)

    if (npc) {
      setDetailNPC(npc)
      setDetailParticipant(participant)
    }
  }

  function handleClearScene() {
    if (window.confirm('Limpar todos os participantes da cena?')) {
      clearScene()
      toast.info('Participantes removidos da cena.', 'Cena limpa')
    }
  }

  function handleAddPC(pc) {
    addPC(pc)
    toast.success(`${pc.name} entrou na cena.`, 'PC adicionado')
  }

  function handleLoadScene(sceneId) {
    if (sceneId && loadScene(sceneId)) {
      toast.success('Cena carregada no rastreador.', 'Cena restaurada')
    }
  }

  function handleExportNPC(npc) {
    exportNPC(npc)
    toast.success(`${npc.name} exportado em JSON.`, 'Exportacao iniciada')
  }

  return (
    <aside
      className={`${styles.tracker} ${
        isTrackerMinimized ? styles.trackerMinimized : ''
      }`}
      aria-label="Rastreador de turnos"
    >
      <button
        className={styles.toggleButton}
        type="button"
        onClick={toggleTracker}
        title={isTrackerMinimized ? 'Expandir rastreador' : 'Minimizar rastreador'}
        aria-label={
          isTrackerMinimized ? 'Expandir rastreador' : 'Minimizar rastreador'
        }
      >
        <ToggleIcon size={18} />
      </button>

      {!isTrackerMinimized && (
        <div className={styles.content}>
          <span className={styles.eyebrow}>Rastreador</span>
          <div className={styles.trackerTitle}>
            <h2>Turnos</h2>
            <div className={styles.roundControl}>
              <button type="button" onClick={() => adjustRound(-1)} aria-label="Reduzir rodada">
                <Minus size={14} />
              </button>
              <span>Rodada {round}</span>
              <button type="button" onClick={() => adjustRound(1)} aria-label="Aumentar rodada">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className={styles.controls}>
            <button type="button" onClick={() => setIsAddingPC((current) => !current)}>
              <Plus size={16} />
              Adicionar PC
            </button>
            <button
              type="button"
              onClick={() => {
                nextTurn()
                toast.info('Turno avancado.', 'Rastreador')
              }}
              disabled={!participants.length}
            >
              <SkipForward size={16} />
              Proximo Turno
            </button>
            <button
              type="button"
              onClick={() => {
                resetTurn()
                toast.info('Turno reiniciado.', 'Rastreador')
              }}
              disabled={!participants.length}
            >
              <RotateCcw size={16} />
              Resetar
            </button>
            <button type="button" onClick={handleClearScene} disabled={!participants.length}>
              <Eraser size={16} />
              Limpar
            </button>
          </div>

          {isAddingPC && <AddPCForm onAddPC={handleAddPC} onCancel={() => setIsAddingPC(false)} />}

          <DropZone />

          <section className={styles.mobileNpcPicker} aria-label="Adicionar NPC por nome">
            <span>Adicionar NPC à cena</span>
            <label className={styles.mobileNpcSearchBox}>
              <Search size={16} />
              <input
                type="search"
                value={mobileNpcQuery}
                onChange={(event) => setMobileNpcQuery(event.target.value)}
                placeholder="Buscar por nome, clã ou conceito"
              />
            </label>
            <div className={styles.mobileNpcResults}>
              {mobileNpcMatches.length ? mobileNpcMatches.map((npc) => (
                <button
                  type="button"
                  key={npc.id}
                  onClick={() => {
                    addParticipant(npc)
                    setMobileNpcQuery('')
                    toast.success(`${npc.name} entrou na cena.`, 'Rastreador atualizado')
                  }}
                >
                  <span>
                    <strong>{npc.name || 'NPC sem nome'}</strong>
                    <small>{npc.clan || npc.concept || 'NPC da biblioteca'}</small>
                  </span>
                  <Plus size={16} aria-hidden="true" />
                </button>
              )) : (
                <p>Nenhum NPC disponível para adicionar.</p>
              )}
            </div>
          </section>

          <div className={styles.sceneTools}>
            <label>
              Nome da cena
              <input
                value={sceneName}
                onChange={(event) => setSceneName(event.target.value)}
                placeholder="Confronto no Elysium"
              />
            </label>
            <button type="button" onClick={handleSaveScene} disabled={!participants.length}>
              <Save size={15} />
              Salvar
            </button>
            <label>
              Cenas salvas
              <select
                value={selectedSceneId}
                onChange={(event) => {
                  const sceneId = event.target.value
                  setSelectedSceneId(sceneId)
                  handleLoadScene(sceneId)
                }}
              >
                <option value="">Carregar cena</option>
                {savedScenes.map((scene) => (
                  <option key={scene.id} value={scene.id}>
                    {scene.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {participants.length ? (
            <SortableContext
              items={participantIds}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles.participantList}>
                {participants.map((participant, index) => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    isCurrentTurn={index === currentTurnIndex}
                    onUpdate={updateParticipant}
                    onRemove={(participantId) => {
                      removeParticipant(participantId)
                      toast.info('Participante removido da cena.', 'Rastreador')
                    }}
                    onViewSheet={handleViewSheet}
                  />
                ))}
              </div>
            </SortableContext>
          ) : (
            <div className={styles.emptyState}>Nenhum participante na cena atual.</div>
          )}

          <NPCDetail
            npc={detailNPC ? (npcs.find(n => n.id === detailNPC.id) || detailNPC) : null}
            participant={detailParticipant ? (participants.find(p => p.id === detailParticipant.id) || detailParticipant) : null}
            onUpdateParticipant={updateParticipant}
            onUpdateNPC={updateNPC}
            isOpen={Boolean(detailNPC)}
            onClose={() => {
              setDetailNPC(null)
              setDetailParticipant(null)
            }}
            onEdit={() => window.alert('Edite este NPC pela Biblioteca.')}
            onAddToTracker={(npc) => {
              addParticipant(npc)
              toast.success(`${npc.name} entrou na cena.`, 'Rastreador atualizado')
            }}
            onExport={handleExportNPC}
          />
        </div>
      )}
    </aside>
  )
}

export default TurnTracker
