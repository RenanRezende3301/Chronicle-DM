import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { useEffect } from 'react'
import styles from './common.module.css'

export function Toast({ id, type = 'info', title, message, onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (!duration) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss?.(id)
    }, duration)

    return () => window.clearTimeout(timeoutId)
  }, [duration, id, onDismiss])

  return (
    <article className={`${styles.toast} ${styles[`toast${type}`]}`} role="status">
      {type === 'success' && <CheckCircle2 size={18} />}
      {type === 'error' && <XCircle size={18} />}
      {type === 'warning' && <AlertTriangle size={18} />}
      {!['success', 'error', 'warning'].includes(type) && <Info size={18} />}
      <div>
        {title && <strong>{title}</strong>}
        {message && <p>{message}</p>}
      </div>
      <button
        type="button"
        className={styles.toastClose}
        onClick={() => onDismiss?.(id)}
        aria-label="Dispensar notificacao"
        title="Dispensar"
      >
        x
      </button>
    </article>
  )
}

function ToastViewport({ toasts = [], onDismiss }) {
  if (!toasts.length) {
    return null
  }

  return (
    <div className={styles.toastViewport} aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export default ToastViewport
