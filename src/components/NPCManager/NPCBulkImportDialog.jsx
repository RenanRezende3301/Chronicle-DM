import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import Modal from '../common/Modal.jsx'
import commonStyles from '../common/common.module.css'
import styles from './NPCManager.module.css'

function NPCBulkImportDialog({ isOpen, onClose, onImportFiles }) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  async function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.name.endsWith('.json'))
    
    if (droppedFiles.length === 0) {
      setError('Nenhum arquivo .json válido encontrado.')
      return
    }

    await processFiles(droppedFiles)
  }

  async function handleFileChange(event) {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    await processFiles(files)
    event.target.value = ''
  }

  async function processFiles(files) {
    setError('')
    setIsProcessing(true)
    
    try {
      await onImportFiles(files)
      onClose()
    } catch (err) {
      setError(err.message || 'Erro durante a importação em massa.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Importação em Massa"
      description="Arraste e solte dezenas de arquivos .json aqui para adicioná-los rapidamente à biblioteca."
      size="large"
      onClose={onClose}
      footer={
        <button className={commonStyles.secondaryButton} type="button" onClick={onClose} disabled={isProcessing}>
          {isProcessing ? 'Processando...' : 'Cancelar'}
        </button>
      }
    >
      <div className={styles.importDialog}>
        <div 
          className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''} ${isProcessing ? styles.dropzoneProcessing : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <UploadCloud size={48} className={styles.dropzoneIcon} />
          <h3>Solte seus arquivos .json aqui</h3>
          <p>ou clique para selecionar do seu computador</p>
        </div>

        <input
          ref={fileInputRef}
          className={styles.hiddenInput}
          type="file"
          accept="application/json,.json"
          multiple
          onChange={handleFileChange}
          disabled={isProcessing}
        />

        {error && <p className={styles.fieldError} style={{ textAlign: 'center' }}>{error}</p>}
      </div>
    </Modal>
  )
}

export default NPCBulkImportDialog
