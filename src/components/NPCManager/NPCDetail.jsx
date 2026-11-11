import { useState } from 'react'
import { Download, Pencil, Plus, Dices, Droplet } from 'lucide-react'
import Modal from '../common/Modal.jsx'
import commonStyles from '../common/common.module.css'
import { attributes, skills } from '../../data/skills.js'
import { useIndexedDB } from '../../hooks/useIndexedDB.js'
import { useLibraryPortraitUrl } from '../../hooks/useLibraryPortraitUrl.js'
import { getHungerMaximum, normalizeDisciplinePowers } from '../../utils/npcUtils.js'
import { getSheetCapabilities } from '../../domain/characterSheetContract.js'
import DiceRollerModal from '../DiceRoller/DiceRollerModal.jsx'
import HealthTrack from '../TurnTracker/HealthTrack.jsx'
import HungerTrack from '../TurnTracker/HungerTrack.jsx'
import styles from './NPCManager.module.css'

const typeLabels = {
  vampire: 'Vampiro',
  mortal: 'Mortal',
  ghoul: 'Ghoul',
  other: 'Outro',
}

function spendWillpower(participant, onUpdateParticipant, npc, onUpdateNPC) {
  const currentBoxes = participant ? [...participant.willpowerBoxes] : [...npc.willpowerBoxes]
  const firstEmpty = currentBoxes.indexOf('')
  let newBoxes = [...currentBoxes]
  if (firstEmpty !== -1) {
    newBoxes[firstEmpty] = '/'
  } else {
    const firstSuperficial = currentBoxes.indexOf('/')
    if (firstSuperficial !== -1) {
      newBoxes[firstSuperficial] = 'X'
    }
  }

  if (onUpdateNPC) onUpdateNPC(npc.id, { willpowerBoxes: newBoxes })
  if (participant && onUpdateParticipant) onUpdateParticipant(participant.id, { willpowerBoxes: newBoxes })
}

function increaseHunger(participant, onUpdateParticipant, npc, onUpdateNPC) {
  const capabilities = getSheetCapabilities({ sourceKind: 'npc', characterType: npc.type })
  if (!capabilities.tracks.hunger) return
  
  const currentHunger = participant ? participant.hunger : npc.hunger
  if (currentHunger < getHungerMaximum(npc.bloodPotency)) {
    const newHunger = currentHunger + 1
    if (onUpdateNPC) onUpdateNPC(npc.id, { hunger: newHunger })
    if (participant && onUpdateParticipant) onUpdateParticipant(participant.id, { hunger: newHunger })
  }
}

function NPCDetail({ npc, participant, onUpdateParticipant, onUpdateNPC, isOpen, onClose, onEdit, onAddToTracker, onExport }) {
  const { imageUrl: storedImageUrl } = useIndexedDB(npc?.id)
  const canonicalImageUrl = useLibraryPortraitUrl(npc?.portraitPath)
  
  // States for Dice Roller
  const [selectedDice, setSelectedDice] = useState({})
  const [useBloodSurge, setUseBloodSurge] = useState(false)
  const [isRollerOpen, setIsRollerOpen] = useState(false)

  if (!npc) {
    return null
  }

  const imageUrl = npc.imageUrl || canonicalImageUrl || storedImageUrl
  const sheetCapabilities = getSheetCapabilities({
    sourceKind: 'npc',
    characterType: npc.type,
  })

  const handleToggleDie = (key, value) => {
    setSelectedDice(prev => {
      const next = { ...prev }
      if (next[key] !== undefined) {
        delete next[key]
      } else {
        next[key] = value
      }
      return next
    })
  }

  const handleClose = () => {
    setSelectedDice({})
    setUseBloodSurge(false)
    setIsRollerOpen(false)
    onClose()
  }

  const handleTrackChange = (field, value) => {
    if (onUpdateNPC) onUpdateNPC(npc.id, { [field]: value })
    if (participant && onUpdateParticipant) onUpdateParticipant(participant.id, { [field]: value })
  }

  const dicePoolTotal = Object.values(selectedDice).reduce((a, b) => a + b, 0) + (useBloodSurge ? Number(npc.bloodPotency || 0) : 0)
  const showFab = Object.keys(selectedDice).length > 0 || useBloodSurge

  // Resolve current status (Participant takes precedence if in scene)
  const currentHealthBoxes = participant ? participant.healthBoxes : npc.healthBoxes
  const currentWillpowerBoxes = participant ? participant.willpowerBoxes : npc.willpowerBoxes
  const currentHunger = participant ? participant.hunger : npc.hunger

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={npc.name}
        description={`${npc.clan || 'Sem cla'} · ${typeLabels[npc.type] ?? 'Outro'}`}
        size="large"
        className={styles.detailModal}
        bodyClassName={styles.detailModalBody}
        footerClassName={styles.detailModalFooter}
        onClose={handleClose}
        footer={
          <>
            <button className={commonStyles.secondaryButton} type="button" onClick={() => onExport(npc)}>
              <Download size={16} />
              Exportar JSON
            </button>
            <button className={commonStyles.secondaryButton} type="button" onClick={() => onAddToTracker(npc)}>
              <Plus size={16} />
              Adicionar ao Rastreador
            </button>
            <button className={commonStyles.primaryButton} type="button" onClick={() => onEdit(npc)}>
              <Pencil size={16} />
              Editar
            </button>
          </>
        }
      >
        <article className={styles.detailSheet}>
          <div className={styles.detailHeader}>
            <div className={styles.detailPortrait}>
              {imageUrl ? <img src={imageUrl} alt="" /> : <span>Sem imagem</span>}
            </div>
            <div>
              <h3>{npc.name}</h3>
              <p>{npc.concept || 'Sem conceito definido'}</p>
              <dl>
                <div>
                  <dt>Geracao</dt>
                  <dd>{npc.generation || '-'}</dd>
                </div>
                {sheetCapabilities.fields.bloodPotency ? <div>
                  <dt>Potencia</dt>
                  <dd>{npc.bloodPotency ?? '-'}</dd>
                </div> : null}
                {sheetCapabilities.tracks.humanity ? <div>
                  <dt>Humanidade</dt>
                  <dd>{npc.humanity ?? '-'}</dd>
                </div> : null}
                <div>
                  <dt>Iniciativa</dt>
                  <dd>{npc.initiativeBase}</dd>
                </div>
              </dl>
            </div>
          </div>

          <DetailBlock title="Status">
            <div className={styles.statusRow}>
              {sheetCapabilities.tracks.health ? <HealthTrack
                label="Saude"
                boxes={currentHealthBoxes}
                onChange={(boxes) => handleTrackChange('healthBoxes', boxes)}
              /> : null}
              {sheetCapabilities.tracks.willpower ? <HealthTrack
                label="FdV"
                boxes={currentWillpowerBoxes}
                tone="willpower"
                showStatus={false}
                onChange={(boxes) => handleTrackChange('willpowerBoxes', boxes)}
              /> : null}
              {sheetCapabilities.tracks.hunger && (
                <HungerTrack
                  value={currentHunger}
                  max={getHungerMaximum(npc.bloodPotency)}
                  onChange={(hunger) => handleTrackChange('hunger', hunger)}
                />
              )}
            </div>
          </DetailBlock>

          {sheetCapabilities.fields.attributes ? <DetailBlock title="Atributos">
            <StatColumns groups={attributes} values={npc.attributes} selectedDice={selectedDice} onToggleDie={handleToggleDie} />
          </DetailBlock> : null}

          {sheetCapabilities.fields.skills ? <DetailBlock title="Habilidades">
            <StatColumns groups={skills} values={npc.skills} hideZero selectedDice={selectedDice} onToggleDie={handleToggleDie} />
          </DetailBlock> : null}

          {sheetCapabilities.fields.disciplines ? <DetailBlock title="Disciplinas">
            {npc.disciplines.length ? (
              <div className={styles.detailDisciplineList}>
                {npc.disciplines.map((discipline) => {
                  const powers = normalizeDisciplinePowers(discipline.powers)
                  const isSelected = selectedDice[discipline.name] !== undefined

                  return (
                    <section className={styles.detailDiscipline} key={discipline.id}>
                      <h5>
                        <label className={`${styles.statLabel} ${isSelected ? styles.statLabelSelected : ''}`} style={{ display: 'inline-flex', padding: '4px 8px' }}>
                          <div className={styles.statNameGroup}>
                            <div className={styles.customCheck}>
                              <input 
                                type="checkbox" 
                                className="sr-only"
                                checked={isSelected}
                                onChange={() => handleToggleDie(discipline.name, discipline.level)}
                              />
                              <Droplet size={14} className={`${styles.bloodDrop} ${isSelected ? styles.bloodDropActive : ''}`} fill={isSelected ? 'currentColor' : 'none'} />
                            </div>
                            {discipline.name}
                          </div>
                          <strong>{discipline.level}</strong>
                        </label>
                      </h5>
                      {powers.length ? (
                        <div className={styles.detailPowerList}>
                          {powers.map((power) => (
                            <article key={power.id}>
                              <strong>{power.name || 'Poder sem nome'}</strong>
                              {power.mechanics && <p>{power.mechanics}</p>}
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p>Nenhum poder registrado.</p>
                      )}
                    </section>
                  )
                })}
              </div>
            ) : (
              <p>Nenhuma disciplina registrada.</p>
            )}
          </DetailBlock> : null}

          <DetailBlock title="Equipamentos">
            {npc.equipment.length ? (
              npc.equipment.map((item) => (
                <p key={item.id}>
                  <strong>{item.name || 'Item'}</strong>: {item.notes || '-'}
                </p>
              ))
            ) : (
              <p>Nenhum equipamento registrado.</p>
            )}
          </DetailBlock>

          <DetailBlock title="Notas">
            <p style={{ whiteSpace: 'pre-wrap' }}>{npc.notes || 'Nenhuma nota privada.'}</p>
          </DetailBlock>
        </article>

        {showFab && (
          <div className={styles.fabContainer}>
            {sheetCapabilities.actions.bloodSurge && Number(npc.bloodPotency || 0) > 0 && (
              <label className={styles.surgeCheckbox}>
                <input 
                  type="checkbox" 
                  checked={useBloodSurge} 
                  onChange={(e) => setUseBloodSurge(e.target.checked)} 
                />
                Surto de Sangue (+{npc.bloodPotency})
              </label>
            )}
            <button type="button" className={styles.fabButton} onClick={() => setIsRollerOpen(true)}>
              <Dices size={20} />
              Rolar {dicePoolTotal} Dados
            </button>
          </div>
        )}
      </Modal>

      {isRollerOpen ? (
        <DiceRollerModal
          isOpen
          onClose={() => setIsRollerOpen(false)}
          poolSize={dicePoolTotal}
          useBloodSurge={useBloodSurge}
          characterName={npc.name}
          onSpendWillpower={() => spendWillpower(participant, onUpdateParticipant, npc, onUpdateNPC)}
          onHungerIncrease={() => increaseHunger(participant, onUpdateParticipant, npc, onUpdateNPC)}
        />
      ) : null}
    </>
  )
}

function DetailBlock({ title, children }) {
  return (
    <section className={styles.detailBlock}>
      <h4>{title}</h4>
      {children}
    </section>
  )
}

function StatColumns({ groups, values, hideZero = false, selectedDice, onToggleDie }) {
  return (
    <div className={styles.detailStats}>
      {Object.entries(groups).map(([group, items]) => (
        <div key={group}>
          {items.map((item) => {
            const value = values[item.key] ?? 0

            if (hideZero && value === 0) {
              return null
            }
            
            const isSelected = selectedDice && selectedDice[item.name] !== undefined

            return (
              <label key={item.key} className={`${styles.statLabel} ${isSelected ? styles.statLabelSelected : ''}`}>
                <div className={styles.statNameGroup}>
                  <div className={styles.customCheck}>
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => onToggleDie && onToggleDie(item.name, value)}
                    />
                    <Droplet size={14} className={`${styles.bloodDrop} ${isSelected ? styles.bloodDropActive : ''}`} fill={isSelected ? 'currentColor' : 'none'} />
                  </div>
                  {item.name}
                </div>
                <strong>{value}</strong>
              </label>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default NPCDetail
