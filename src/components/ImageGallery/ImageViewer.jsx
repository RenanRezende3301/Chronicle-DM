import { useEffect, useState } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'
import { useLibraryPortraitUrl } from '../../hooks/useLibraryPortraitUrl.js'
import { api } from '../../services/api.js'
import styles from './ImageGallery.module.css'

function ImageViewer({ image, categories, onClose }) {
  const [fetchedImageUrl, setFetchedImageUrl] = useState(null)
  const storedImageUrl = useLibraryPortraitUrl(image.storagePath)
  const category = categories.find((c) => c.id === image.categoryId)
  const displayUrl = image.url || storedImageUrl || fetchedImageUrl

  useEffect(() => {
    if (image.url || image.storagePath) return

    let active = true
    let blobUrl = null

    api.getImage(image.id)
      .then((blob) => {
        if (active && blob) {
          blobUrl = URL.createObjectURL(blob)
          setFetchedImageUrl(blobUrl)
        }
      })
      .catch(() => {})

    return () => {
      active = false
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [image.id, image.storagePath, image.url])

  // Handle escape key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className={styles.modalOverlay} onClick={onClose} style={{ zIndex: 200 }}>
      <div className={`${styles.modalContent} ${styles.viewerModal}`} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem' }}>{category ? `${category.name} / ` : ''}{image.name}</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose} title="Fechar (Esc)">
            <X size={20} />
          </button>
        </header>

        <div className={styles.viewerImageContainer}>
          {displayUrl ? (
            <img src={displayUrl} alt={image.name} className={styles.viewerImage} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)' }}>
              <ImageIcon size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
              <span>Carregando imagem...</span>
            </div>
          )}
        </div>

        {image.description && (
          <div className={styles.viewerDetails}>
            <p className={styles.viewerDescription}>{image.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageViewer
