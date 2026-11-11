import { AlertTriangle } from 'lucide-react'
import { clampNumber } from '../../utils/npcUtils.js'
import styles from '../common/common.module.css'

function HungerTrack({
  label = 'Fome',
  value = 0,
  max = 5,
  size = 'normal',
  disabled = false,
  onChange,
}) {
  const maximum = clampNumber(max, 5, 10)
  const numericValue = clampNumber(value, 0, maximum)
  const isCritical = numericValue === maximum

  function handleDotClick(dotValue) {
    if (disabled) {
      return
    }

    onChange?.(dotValue === numericValue ? Math.max(numericValue - 1, 0) : dotValue)
  }

  return (
    <div
      className={`${styles.hungerTrack} ${styles[`hungerTrack${size}`]} ${
        isCritical ? styles.hungerCritical : ''
      }`}
    >
      <div className={styles.trackHeader}>
        <span>{label}</span>
        {isCritical && (
          <strong className={styles.hungerAlert}>
            <AlertTriangle size={14} />
            Frenesi
          </strong>
        )}
      </div>

      <div className={styles.hungerDots}>
        {Array.from({ length: maximum }, (_, index) => {
          const dotValue = index + 1
          const isFilled = dotValue <= numericValue

          return (
            <button
              key={dotValue}
              type="button"
              className={`${styles.hungerDot} ${isFilled ? styles.hungerDotFilled : ''}`}
              onClick={() => handleDotClick(dotValue)}
              disabled={disabled}
              aria-label={`${label} ${dotValue}`}
              aria-pressed={isFilled}
            />
          )
        })}
      </div>
    </div>
  )
}

export default HungerTrack
