import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import styles from './common.module.css'

function Modal({
  isOpen,
  title,
  description,
  children,
  footer,
  size = 'medium',
  className = '',
  bodyClassName = '',
  footerClassName = '',
  onClose,
  closeOnOverlay = true,
}) {
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  function handleOverlayClick(event) {
    if (closeOnOverlay && event.target === event.currentTarget) {
      onClose?.()
    }
  }

  return createPortal(
    <div
      className={styles.modalOverlay}
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className={`${styles.modalPanel} ${styles[`modalPanel${size}`]} ${className}`}
        role="dialog"
      >
        <header className={styles.modalHeader}>
          <div>
            {title && <h2 id={titleId}>{title}</h2>}
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <button
            className={styles.iconButton}
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        <div className={`${styles.modalBody} ${bodyClassName}`}>{children}</div>

        {footer && <footer className={`${styles.modalFooter} ${footerClassName}`}>{footer}</footer>}
      </section>
    </div>,
    document.body,
  )
}

export default Modal
