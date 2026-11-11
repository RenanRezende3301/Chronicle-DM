import { clampNumber } from '../../utils/npcUtils.js'
import styles from './common.module.css'

function DotRating({
  label,
  value = 0,
  max = 5,
  min = 0,
  disabled = false,
  onChange,
}) {
  const numericValue = clampNumber(value, min, max)

  return (
    <fieldset className={styles.dotRating} disabled={disabled}>
      {label && <legend>{label}</legend>}
      <div>
        {Array.from({ length: max }, (_, index) => {
          const dotValue = index + 1
          const isActive = dotValue <= numericValue

          return (
            <button
              key={dotValue}
              type="button"
              className={isActive ? styles.dotActive : ''}
              onClick={() => onChange?.(dotValue)}
              aria-label={`${label ?? 'Valor'} ${dotValue}`}
              aria-pressed={isActive}
            />
          )
        })}
      </div>
    </fieldset>
  )
}

export default DotRating
