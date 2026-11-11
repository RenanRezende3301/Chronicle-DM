import { useRef, useState } from 'react'
import { ArchiveRestore, FileUp, Files, Upload } from 'lucide-react'
import Modal from '../common/Modal.jsx'
import commonStyles from '../common/common.module.css'
import styles from './NPCManager.module.css'

function NPCImportDialog({
  isOpen,
  onClose,
  onImportText,
  onImportFile,
  onOpenBulkImport,
  onOpenBackupImport,
}) {
  const fileInputRef = useRef(null)
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState('')

  async function handleTextImport() {
    setError('')

    try {
      await onImportText(jsonText)
      setJsonText('')
      onClose()
    } catch (importError) {
      setError(importError.message)
    }
  }

  async function handleFileChange(event) {
    const [file] = event.target.files

    if (!file) {
      return
    }

    setError('')

    try {
      await onImportFile(file)
      setJsonText('')
      onClose()
    } catch (importError) {
      setError(importError.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Importar fichas"
      description="Cole uma ficha em JSON ou escolha outro formato de importação abaixo."
      size="large"
      onClose={onClose}
      footer={
        <>
          <button className={commonStyles.secondaryButton} type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className={commonStyles.primaryButton}
            type="button"
            onClick={handleTextImport}
            disabled={!jsonText.trim()}
          >
            <Upload size={16} />
            Importar JSON colado
          </button>
        </>
      }
    >
      <div className={styles.importDialog}>
        <label>
          Bloco JSON
          <textarea
            value={jsonText}
            onChange={(event) => {
              setError('')
              setJsonText(event.target.value)
            }}
            placeholder='Cole aqui um JSON com {"npc": {...}}, {"npcs": [...]} ou o NPC direto.'
          />
        </label>

        <div className={styles.importDivider}>
          <span>ou</span>
        </div>

        <button
          className={styles.secondaryButton}
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp size={17} />
          Selecionar arquivo JSON
        </button>
        <input
          ref={fileInputRef}
          className={styles.hiddenInput}
          type="file"
          accept="application/json,.json"
          onChange={handleFileChange}
        />

        <div className={styles.importAdvancedOptions}>
          <span>Outras opções</span>
          <button
            className={styles.importOptionButton}
            type="button"
            onClick={() => {
              onClose()
              onOpenBulkImport?.()
            }}
          >
            <Files size={18} />
            <span>
              <strong>Importar lote de fichas</strong>
              <small>Selecione vários arquivos JSON de uma só vez.</small>
            </span>
          </button>
          <button
            className={styles.importOptionButton}
            type="button"
            onClick={() => {
              onClose()
              onOpenBackupImport?.()
            }}
          >
            <ArchiveRestore size={18} />
            <span>
              <strong>Restaurar backup completo</strong>
              <small>Importe um ZIP com fichas, categorias e retratos.</small>
            </span>
          </button>
        </div>

        {error && <p className={styles.fieldError}>{error}</p>}
      </div>
    </Modal>
  )
}

export default NPCImportDialog
