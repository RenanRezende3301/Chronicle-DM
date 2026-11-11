import Modal from './Modal.jsx'
import styles from './common.module.css'

function ConfirmDialog({
  isOpen,
  title = 'Confirmar acao',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      size="small"
      onClose={onCancel}
      footer={
        <>
          <button className={styles.secondaryButton} type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={destructive ? styles.destructiveButton : styles.primaryButton}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className={styles.dialogMessage}>{message}</p>
    </Modal>
  )
}

export default ConfirmDialog
