import {
  DAMAGE_STATES,
  cycleDamageState,
  getHealthStatus,
} from '../../utils/npcUtils.js'
import styles from '../common/common.module.css'

const statusLabels = {
  ok: 'OK',
  impaired: 'PREJUDICADO',
  torpor: 'TORPOR',
}

function HealthTrack({
  label = 'Saude',
  boxes = [],
  size = 'normal',
  tone = 'health',
  showStatus = true,
  disabled = false,
  onChange,
}) {
  const status = getHealthStatus(boxes)

  function handleBoxClick(index) {
    if (disabled) {
      return
    }

    const nextBoxes = boxes.map((box, boxIndex) =>
      boxIndex === index ? cycleDamageState(box) : box,
    )

    onChange?.(nextBoxes)
  }

  return (
    <div
      className={`${styles.track} ${styles[`track${size}`]} ${
        tone === 'willpower' ? styles.trackWillpower : ''
      }`}
    >
      <div className={styles.trackHeader}>
        <span>{label}</span>
        {showStatus && (
          <strong className={`${styles.statusLabel} ${styles[`status${status}`]}`}>
            {statusLabels[status]}
          </strong>
        )}
      </div>

      <div className={styles.damageBoxes}>
        {boxes.map((box, index) => (
          <button
            key={`${label}-${index}`}
            type="button"
            className={`${styles.damageBox} ${styles[`damage${box}`]}`}
            onClick={() => handleBoxClick(index)}
            disabled={disabled}
            aria-label={`${label} caixa ${index + 1}: ${box}`}
            title="Alternar dano"
          >
            {box === DAMAGE_STATES.superficial && <span aria-hidden="true" />}
            {box === DAMAGE_STATES.aggravated && <strong aria-hidden="true">x</strong>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default HealthTrack
