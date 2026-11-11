import { useState, useRef, useEffect } from 'react'
import { X, UploadCloud, Trash2, Save } from 'lucide-react'
import { useGallery } from '../../context/useGallery.js'
import { useAuth } from '../../context/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { useLibraryPortraitUrl } from '../../hooks/useLibraryPortraitUrl.js'
import { api } from '../../services/api.js'
import {
  removeLibraryPortrait,
  uploadGalleryImage,
} from '../../services/supabaseChronicle2.js'
import styles from './ImageGallery.module.css'
import { nanoid } from 'nanoid'

function GalleryModal({ isOpen, image, categories, defaultCategoryId, onClose }) {
  const { addImage, updateImage, deleteImage: removeImageFromState } = useGallery()
  const { user } = useAuth()
  const toast = useToast()
  const usesRemoteGallery = user?.authBackend === 'supabase'
  const storedImageUrl = useLibraryPortraitUrl(image?.storagePath)
  
  const [name, setName] = useState(image?.name || '')
  const [description, setDescription] = useState(image?.description || '')
  const [categoryId, setCategoryId] = useState(image?.categoryId || (defaultCategoryId === 'all' ? '' : defaultCategoryId))
  
  const [uploadType, setUploadType] = useState(image?.url ? 'url' : 'file')
  const [imageUrl, setImageUrl] = useState(image?.url || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (image?.id && !selectedFile && !image.url && !image.storagePath) {
      let active = true
      api.getImage(image.id).then(blob => {
        if (active && blob) {
          setPreviewUrl(URL.createObjectURL(blob))
        }
      }).catch(() => {})
      return () => { active = false }
    }
  }, [image?.id, image?.storagePath, image?.url, selectedFile])

  useEffect(() => {
    return () => {
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, selectedFile])

  if (!isOpen) return null

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  function processFile(file) {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecione uma imagem valida.', 'Formato invalido')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem deve ter no maximo 10MB.', 'Arquivo muito grande')
      return
    }
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error('A imagem precisa de um nome.', 'Campo obrigatorio')
      return
    }

    if (!image && uploadType === 'file' && !selectedFile) {
      toast.error('Voce precisa selecionar um arquivo de imagem.', 'Campo obrigatorio')
      return
    }

    if (uploadType === 'url' && !imageUrl.trim()) {
      toast.error('Voce precisa informar a URL da imagem.', 'Campo obrigatorio')
      return
    }

    setIsSubmitting(true)

    let uploadedPath = ''
    try {
      const imgId = image?.id || nanoid()
      
      if (uploadType === 'file' && selectedFile) {
        if (usesRemoteGallery) {
          uploadedPath = await uploadGalleryImage({ imageId: imgId, file: selectedFile })
        } else {
          await api.saveImage(imgId, selectedFile)
        }
      }

      const previousStoragePath = String(image?.storagePath || '')
      const nextStoragePath = uploadType === 'file'
        ? uploadedPath || previousStoragePath
        : ''
      const imageData = {
        name,
        description,
        categoryId: categoryId || null,
        url: uploadType === 'url' ? imageUrl.trim() : null,
        storagePath: nextStoragePath,
      }

      if (image) {
        await updateImage(image.id, imageData)
      } else {
        await addImage({
          id: imgId,
          ...imageData,
        })
      }

      if (previousStoragePath && previousStoragePath !== nextStoragePath) {
        await removeLibraryPortrait(previousStoragePath).catch(() => false)
      }

      toast.success('Imagem salva na galeria.', 'Sucesso')
      onClose()
    } catch (err) {
      if (uploadedPath) await removeLibraryPortrait(uploadedPath).catch(() => false)
      toast.error(err?.message || 'Erro ao salvar imagem.', 'Erro')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (window.confirm('Tem certeza que deseja deletar esta imagem?')) {
      try {
        if (usesRemoteGallery) {
          await removeImageFromState(image.id)
          if (image.storagePath) {
            await removeLibraryPortrait(image.storagePath).catch(() => false)
          }
        } else {
          await api.deleteImage(image.id).catch(() => {})
          await removeImageFromState(image.id)
        }
        toast.info('Imagem deletada.', 'Galeria atualizada')
        onClose()
      } catch {
        toast.error('Erro ao deletar imagem.', 'Erro')
      }
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h2>{image ? 'Editar Imagem' : 'Adicionar Imagem'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className={styles.modalBody}>
          <div className={styles.field} style={{ flexDirection: 'row', gap: '16px', marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', textTransform: 'none', fontWeight: 400 }}>
              <input type="radio" checked={uploadType === 'file'} onChange={() => setUploadType('file')} /> Upload de Arquivo
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', textTransform: 'none', fontWeight: 400 }}>
              <input type="radio" checked={uploadType === 'url'} onChange={() => setUploadType('url')} /> Link (URL)
            </label>
          </div>

          <div className={styles.field}>
            {uploadType === 'file' ? (
              <>
                <label>Arquivo de Imagem (Max 10MB)</label>
                <div 
                  className={`${styles.imageDropzone} ${isDragActive ? styles.imageDropzoneActive : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragActive(true) }}
                  onDragLeave={() => setIsDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl || storedImageUrl ? (
                    <img src={previewUrl || storedImageUrl} alt="Preview" className={styles.imagePreview} />
                  ) : (
                    <>
                      <UploadCloud size={32} />
                      <span>Arraste uma imagem ou clique para selecionar</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileSelect}
                />
              </>
            ) : (
              <>
                <label>URL da Imagem</label>
                <input 
                  type="url" 
                  className={styles.input} 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Preview URL" 
                    className={styles.imagePreview} 
                    style={{ marginTop: '12px' }}
                    onError={(e) => { e.target.style.display = 'none' }}
                    onLoad={(e) => { e.target.style.display = 'block' }}
                  />
                )}
              </>
            )}
          </div>

          <div className={styles.field}>
            <label>Nome</label>
            <input 
              type="text" 
              className={styles.input} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Mapa de Seattle"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label>Categoria</label>
            <select 
              className={styles.input} 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Sem categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Descricao</label>
            <textarea 
              className={`${styles.input} ${styles.textarea}`} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Anotacoes rapidas sobre essa imagem..."
            />
          </div>
        </div>

        <footer className={styles.modalFooter}>
          {image && (
            <button 
              className={styles.secondaryButton} 
              style={{ marginRight: 'auto', color: 'var(--color-critical)' }} 
              onClick={handleDelete}
            >
              <Trash2 size={16} /> Excluir
            </button>
          )}
          <button className={styles.secondaryButton} onClick={onClose}>Cancelar</button>
          <button 
            className={styles.primaryButton} 
            onClick={handleSave} 
            disabled={isSubmitting}
          >
            <Save size={16} /> {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default GalleryModal
