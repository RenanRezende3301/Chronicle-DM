import { useState } from 'react'
import { Dices, UserRound } from 'lucide-react'
import Modal from '../common/Modal.jsx'
import { attributes, skills } from '../../data/skills.js'
import { useIndexedDB } from '../../hooks/useIndexedDB.js'
import { useLibraryPortraitUrl } from '../../hooks/useLibraryPortraitUrl.js'
import styles from './CollectiveRollModal.module.css'

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
  
  return std + tens + criticalBonus
}

// Helper to get all options in a flat list with categories
const getOptionsList = (sourceObj) => {
  const options = []
  for (const [category, items] of Object.entries(sourceObj)) {
    options.push({
      category: category === 'physical' ? 'Fisico' : category === 'social' ? 'Social' : 'Mental',
      items
    })
  }
  return options
}

const attributeOptions = getOptionsList(attributes)
const skillOptions = getOptionsList(skills)

function CollectiveResultItem({ npc, successes, poolSize }) {
  const { imageUrl: storedImageUrl } = useIndexedDB(npc.id)
  const canonicalImageUrl = useLibraryPortraitUrl(npc.portraitPath)
  const imageUrl = npc.imageUrl || canonicalImageUrl || storedImageUrl

  return (
    <article className={styles.resultItem}>
      <div className={styles.resultImage}>
        {imageUrl ? <img src={imageUrl} alt="" /> : <UserRound size={20} />}
      </div>
      <div className={styles.resultInfo}>
        <strong>{npc.name}</strong>
        <span>Pool: {poolSize} dados</span>
      </div>
      <div className={`${styles.resultScore} ${successes >= 4 ? styles.criticalScore : successes === 0 ? styles.failureScore : ''}`}>
        <strong>{successes}</strong>
        <span>Sucessos</span>
      </div>
    </article>
  )
}

export default function CollectiveRollModal({ isOpen, onClose, npcs = [] }) {
  const [stat1, setStat1] = useState('')
  const [stat2, setStat2] = useState('')
  const [results, setResults] = useState(null)

  const handleRoll = () => {
    if (!stat1 && !stat2) return

    const newResults = npcs.map((npc) => {
      // Find the value for stat1
      let val1 = 0
      if (stat1) {
        val1 = npc.attributes[stat1] !== undefined ? npc.attributes[stat1] : (npc.skills[stat1] || 0)
      }
      
      // Find the value for stat2
      let val2 = 0
      if (stat2) {
        val2 = npc.attributes[stat2] !== undefined ? npc.attributes[stat2] : (npc.skills[stat2] || 0)
      }

      const poolSize = val1 + val2
      const roll = Array.from({ length: poolSize }, rollD10)
      const successes = calculateSuccesses(roll)

      return {
        npc,
        poolSize,
        successes
      }
    })

    // Sort descending by successes
    newResults.sort((a, b) => b.successes - a.successes)
    setResults(newResults)
  }

  const handleClose = () => {
    setStat1('')
    setStat2('')
    setResults(null)
    onClose()
  }

  const renderSelect = (value, onChange, label) => (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">-- Selecione --</option>
        <optgroup label="Atributos">
          {attributeOptions.map((group) => (
            group.items.map(item => (
              <option key={`attr-${item.key}`} value={item.key}>{item.name} (Atributo)</option>
            ))
          ))}
        </optgroup>
        <optgroup label="Habilidades">
          {skillOptions.map((group) => (
            group.items.map(item => (
              <option key={`skill-${item.key}`} value={item.key}>{item.name} (Habilidade)</option>
            ))
          ))}
        </optgroup>
      </select>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Rolagem Coletiva"
      description={`Rolar dados simultaneamente para ${npcs.length} NPCs visiveis.`}
      size="medium"
    >
      <div className={styles.modalContent}>
        {renderSelect(stat1, setStat1, 'Traco 1')}
        {renderSelect(stat2, setStat2, 'Traco 2 (Opcional)')}

        <button 
          className={styles.rollButton} 
          onClick={handleRoll}
          disabled={!stat1 && !stat2}
        >
          <Dices size={20} />
          {results ? 'Rolar Novamente' : 'Rolar Dados'}
        </button>

        {results && (
          <div className={styles.resultsList}>
            {results.map((res) => (
              <CollectiveResultItem 
                key={res.npc.id} 
                npc={res.npc} 
                successes={res.successes} 
                poolSize={res.poolSize} 
              />
            ))}
            {results.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Nenhum NPC encontrado para rolar.
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
