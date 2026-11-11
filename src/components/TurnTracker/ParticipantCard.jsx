import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Shield, Trash2, UserRound } from 'lucide-react'
import { useIndexedDB } from '../../hooks/useIndexedDB.js'
import { useLibraryPortraitUrl } from '../../hooks/useLibraryPortraitUrl.js'
import HealthTrack from './HealthTrack.jsx'
import HungerTrack from './HungerTrack.jsx'
import styles from './TurnTracker.module.css'
import { getHungerMaximum } from '../../utils/npcUtils.js'
import { getSheetCapabilities } from '../../domain/characterSheetContract.js'

function ParticipantCard({
  participant,
  isCurrentTurn,
  onUpdate,
  onRemove,
  onViewSheet,
}) {
  const { imageUrl: storedImageUrl } = useIndexedDB(participant.imageStorageKey)
  const canonicalImageUrl = useLibraryPortraitUrl(participant.portraitPath)
  const imageUrl = participant.imageUrl || canonicalImageUrl || storedImageUrl
  const sheetCapabilities = getSheetCapabilities({
    sourceKind: participant.type === 'pc' ? 'player' : 'npc',
    characterType: participant.characterType || (participant.isVampire ? 'vampire' : 'other'),
  })
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: participant.id,
    data: { type: 'participant', participant },
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      aria-current={isCurrentTurn ? 'step' : undefined}
      className={`${styles.participantCard} ${
        isCurrentTurn ? styles.participantCurrent : ''
      } ${isDragging ? styles.participantDragging : ''}`}
      style={style}
    >
      <header
        ref={setActivatorNodeRef}
        className={styles.participantHeader}
        title="Arraste para reordenar o turno"
        {...attributes}
        {...listeners}
        aria-label={`Reordenar ${participant.name} no turno`}
      >
        <span className={styles.dragHandle} aria-hidden="true">
          <GripVertical size={17} />
        </span>
        <div className={styles.participantImage}>
          {imageUrl ? <img src={imageUrl} alt="" /> : <UserRound size={20} />}
        </div>
        <div className={styles.participantTitle}>
          <strong>{participant.name}</strong>
          <span>{participant.clan || participant.concept || 'Cena ativa'}</span>
        </div>
        <span className={styles.participantBadge}>
          {participant.type === 'pc' ? 'PC' : 'NPC'}
        </span>
      </header>

      <div className={styles.participantTracks}>
        <HealthTrack
          label="Saude"
          boxes={participant.healthBoxes}
          size="compact"
          onChange={(healthBoxes) => onUpdate(participant.id, { healthBoxes })}
        />
        <HealthTrack
          label="FdV"
          boxes={participant.willpowerBoxes}
          size="compact"
          tone="willpower"
          showStatus={false}
          onChange={(willpowerBoxes) => onUpdate(participant.id, { willpowerBoxes })}
        />
        {sheetCapabilities.tracks.hunger && (
          <HungerTrack
            value={participant.hunger}
            max={getHungerMaximum(participant.bloodPotency)}
            size="compact"
            onChange={(hunger) => onUpdate(participant.id, { hunger })}
          />
        )}
      </div>

      <footer className={styles.participantActions}>
        <button
          type="button"
          onClick={() => onViewSheet(participant)}
          disabled={!participant.npcId}
        >
          <Shield size={15} />
          Ver Ficha
        </button>
        <button type="button" onClick={() => onRemove(participant.id)}>
          <Trash2 size={15} />
          Remover
        </button>
      </footer>
    </article>
  )
}

export default ParticipantCard
