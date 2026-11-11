import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Dices, Droplets } from 'lucide-react'
import { createPortal } from 'react-dom'
import styles from './DiceRollerModal.module.css'

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

export default function DiceRollerModal({ 
  isOpen, 
  onClose, 
  poolSize, 
  useBloodSurge, 
  onSpendWillpower, 
  onHungerIncrease, 
  characterName 
}) {
  const [diceResults, setDiceResults] = useState(() =>
    Array.from({ length: poolSize }, rollD10),
  )
  const [surgeResult] = useState(() => (useBloodSurge ? rollD10() : null))
  const [hasRerolled, setHasRerolled] = useState(false)
  const [animating, setAnimating] = useState(true)
  const processedSurgeRef = useRef(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setAnimating(false), 400)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (
      !processedSurgeRef.current &&
      useBloodSurge &&
      surgeResult !== null &&
      surgeResult < 6
    ) {
      processedSurgeRef.current = true
      onHungerIncrease?.()
    }
  }, [onHungerIncrease, surgeResult, useBloodSurge])

  const totalSuccesses = useMemo(() => calculateSuccesses(diceResults), [diceResults])
  const failedCount = useMemo(() => diceResults.filter(d => d < 6).length, [diceResults])

  if (!isOpen) return null

  function handleReroll() {
    if (hasRerolled || failedCount === 0) return
    
    setAnimating(true)
    const newResults = [...diceResults]
    const indicesToReroll = []
    
    // Find up to 3 failed dice
    for (let i = 0; i < newResults.length; i++) {
      if (newResults[i] < 6) {
        indicesToReroll.push(i)
        if (indicesToReroll.length === 3) break
      }
    }
    
    indicesToReroll.forEach(idx => {
      newResults[idx] = rollD10()
    })
    
    onSpendWillpower?.()
    
    setTimeout(() => {
      setDiceResults(newResults)
      setHasRerolled(true)
      setAnimating(false)
    }, 400)
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>Rolagem: {characterName || 'Personagem'}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </header>

        <div className={styles.resultsArea} style={{ opacity: animating ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          <div className={styles.successCount}>{animating ? '?' : totalSuccesses}</div>
          <div className={styles.successLabel}>
            {totalSuccesses === 1 ? 'Sucesso' : 'Sucessos'}
          </div>
          
          <div className={styles.diceList}>
            {diceResults.map((result, idx) => {
              let dieClass = styles.die
              if (!animating) {
                if (result === 10) dieClass += ` ${styles.dieCritical}`
                else if (result >= 6) dieClass += ` ${styles.dieSuccess}`
                else dieClass += ` ${styles.dieFail}`
              }
              
              return (
                <div key={idx} className={dieClass}>
                  {animating ? '-' : result}
                </div>
              )
            })}
          </div>
        </div>

        {useBloodSurge && surgeResult !== null && (
          <div className={`${styles.surgeAlert} ${surgeResult >= 6 ? styles.surgeAlertSuccess : ''}`} style={{ opacity: animating ? 0.5 : 1 }}>
            <Droplets size={16} />
            <div>
              <strong>Rouse Check: {animating ? '?' : surgeResult}</strong>
              <p style={{ margin: 0 }}>
                {animating 
                  ? 'Rolando...' 
                  : (surgeResult >= 6 ? 'Saciado. Nenhuma fome adicionada.' : 'Falha! Fome aumentou em 1.')}
              </p>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button 
            type="button"
            className={styles.rerollButton}
            onClick={handleReroll}
            disabled={hasRerolled || failedCount === 0 || animating}
          >
            <Dices size={16} />
            {hasRerolled 
              ? 'Falhas Reroladas' 
              : failedCount === 0 
                ? 'Nenhuma falha para rerolar' 
                : `Rerolar ate 3 falhas (Gastar 1 FdV)`}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
