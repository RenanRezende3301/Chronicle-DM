import { useState } from 'react'
import { Dices, Droplet } from 'lucide-react'
import Modal from '../common/Modal.jsx'
import commonStyles from '../common/common.module.css'
import styles from './NPCManager.module.css'
import { attributes, skills } from '../../data/skills.js'
import { getSheetCapabilities } from '../../domain/characterSheetContract.js'

function rollD10() {
  return Math.floor(Math.random() * 10) + 1
}

function calculateSuccesses(dice) {
  let std = 0
  let tens = 0
  
  dice.forEach((d) => {
    if (d >= 6 && d < 10) std++
    if (d === 10) tens++
  })

  // Each pair of 10s is a critical (+2 successes per pair)
  const pairs = Math.floor(tens / 2)
  const criticalBonus = pairs * 2
  
  // Total = std + tens + bonus
  return std + tens + criticalBonus
}

export default function MassRollerModal({ isOpen, onClose, npcs }) {
  const [selectedAttribute, setSelectedAttribute] = useState('strength')
  const [selectedSkill, setSelectedSkill] = useState('none') // can be 'none', an attribute, or a skill
  const [useBloodSurge, setUseBloodSurge] = useState(false)
  const [results, setResults] = useState(null)
  const [isRolling, setIsRolling] = useState(false)

  const allAttributesFlat = Object.values(attributes).flat()

  function handleRoll() {
    setIsRolling(true)
    setResults(null)

    // Small delay for effect
    setTimeout(() => {
      const newResults = npcs.map((npc) => {
        // 1. Calculate pool size
        let poolSize = 0
        
        // Add first selected attribute
        if (npc.attributes && npc.attributes[selectedAttribute] !== undefined) {
          poolSize += npc.attributes[selectedAttribute]
        }

        // Add second stat (can be skill or attribute)
        if (selectedSkill !== 'none') {
          if (npc.skills && npc.skills[selectedSkill] !== undefined) {
            poolSize += npc.skills[selectedSkill]
          } else if (npc.attributes && npc.attributes[selectedSkill] !== undefined) {
            poolSize += npc.attributes[selectedSkill]
          }
        }

        let hungerIncreased = false
        let surgeUsed = false

        // Add blood surge if applicable
        const capabilities = getSheetCapabilities({
          sourceKind: 'npc',
          characterType: npc.type,
        })
        if (useBloodSurge && capabilities.actions.bloodSurge && npc.bloodPotency > 0) {
          poolSize += npc.bloodPotency
          surgeUsed = true
          const rouseCheck = rollD10()
          if (rouseCheck < 6) {
            hungerIncreased = true
          }
        }

        // Roll dice
        const dice = Array.from({ length: poolSize }, rollD10)
        const successes = calculateSuccesses(dice)

        return {
          id: npc.id,
          name: npc.name,
          poolSize,
          successes,
          surgeUsed,
          hungerIncreased,
        }
      })
      
      // Sort by successes (descending)
      newResults.sort((a, b) => b.successes - a.successes)
      
      setResults(newResults)
      setIsRolling(false)
    }, 400)
  }

  function handleClose() {
    setResults(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title={`Rolar em Massa (${npcs.length} NPCs)`}
      description="Role um teste para todos os NPCs visíveis da lista atual simultaneamente."
      size="medium"
      onClose={handleClose}
      footer={
        <div className={styles.massRollerFooter}>
          <button className={commonStyles.secondaryButton} type="button" onClick={handleClose}>
            Fechar
          </button>
          <button 
            className={commonStyles.primaryButton} 
            type="button" 
            onClick={handleRoll}
            disabled={isRolling || npcs.length === 0}
          >
            <Dices size={16} />
            {isRolling ? 'Rolando...' : 'Rolar Dados'}
          </button>
        </div>
      }
    >
      <div className={styles.massRollerContainer}>
        <div className={styles.massRollerControls}>
          <div className={styles.controlGroup}>
            <label>Atributo 1</label>
            <select 
              value={selectedAttribute} 
              onChange={(e) => setSelectedAttribute(e.target.value)}
              className={styles.massSelect}
            >
              {allAttributesFlat.map((attr) => (
                <option key={attr.key} value={attr.key}>{attr.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>Atributo 2 / Perícia</label>
            <select 
              value={selectedSkill} 
              onChange={(e) => setSelectedSkill(e.target.value)}
              className={styles.massSelect}
            >
              <option value="none">Nenhum (Apenas Atributo 1)</option>
              <optgroup label="Atributos">
                {allAttributesFlat.map((attr) => (
                  <option key={`attr-${attr.key}`} value={attr.key}>{attr.name}</option>
                ))}
              </optgroup>
              <optgroup label="Perícias Físicas">
                {skills.physical.map((skill) => (
                  <option key={skill.key} value={skill.key}>{skill.name}</option>
                ))}
              </optgroup>
              <optgroup label="Perícias Sociais">
                {skills.social.map((skill) => (
                  <option key={skill.key} value={skill.key}>{skill.name}</option>
                ))}
              </optgroup>
              <optgroup label="Perícias Mentais">
                {skills.mental.map((skill) => (
                  <option key={skill.key} value={skill.key}>{skill.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className={styles.massRollerOptions}>
          <label className={styles.surgeCheckbox}>
            <input 
              type="checkbox" 
              checked={useBloodSurge} 
              onChange={(e) => setUseBloodSurge(e.target.checked)} 
            />
            Aplicar Surto de Sangue aos Vampiros
          </label>
        </div>

        {results && (
          <div className={styles.massResultsList}>
            {results.map((r) => (
              <div key={r.id} className={styles.massResultRow}>
                <span className={styles.massResultName}>{r.name}</span>
                <div className={styles.massResultData}>
                  {r.surgeUsed && r.hungerIncreased && (
                    <span className={styles.massHungerIcon} title="Fome aumentou no surto de sangue">
                      <Droplet size={14} fill="currentColor" />
                    </span>
                  )}
                  {r.surgeUsed && !r.hungerIncreased && (
                    <span className={styles.massHungerSafeIcon} title="Surto de sangue usado (seguro)">
                      <Droplet size={14} />
                    </span>
                  )}
                  <span className={styles.massResultPool}>({r.poolSize}d)</span>
                  <span className={styles.massResultSuccesses}>
                    {r.successes} <small>sucessos</small>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
