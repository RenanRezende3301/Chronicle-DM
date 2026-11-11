import { Minus, Plus } from 'lucide-react'
import { clampNumber } from '../../utils/npcUtils.js'
import styles from './common.module.css'

function Stepper({
  label,
  value,
  min = 0,
  max = 10,
  step = 1,
  disabled = false,
  onChange,
}) {
  const numericValue = clampNumber(value, min, max)

  function updateValue(nextValue) {
    onChange?.(clampNumber(nextValue, min, max))
  }

  return (
    <label className={styles.stepper}>
      {label && <span>{label}</span>}
      <div className={styles.stepperControls}>
        <button
          type="button"
          onClick={() => updateValue(numericValue - step)}
          disabled={disabled || numericValue <= min}
          aria-label={`Reduzir ${label ?? 'valor'}`}
          title="Reduzir"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={numericValue}
          disabled={disabled}
          onChange={(event) => updateValue(event.target.value)}
        />
        <button
          type="button"
          onClick={() => updateValue(numericValue + step)}
          disabled={disabled || numericValue >= max}
          aria-label={`Aumentar ${label ?? 'valor'}`}
          title="Aumentar"
        >
          <Plus size={14} />
        </button>
      </div>
    </label>
  )
}

export default Stepper
