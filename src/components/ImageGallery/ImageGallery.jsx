import { useMemo, useState, useEffect } from 'react'
import { Plus, Search, Image as ImageIcon, Edit2, Maximize2 } from 'lucide-react'
import { useGallery } from '../../context/useGallery.js'
import { useToast } from '../../hooks/useToast.js'
import { useLibraryPortraitUrl } from '../../hooks/useLibraryPortraitUrl.js'
import { api } from '../../services/api.js'
import CategoryTabs from '../NPCManager/CategoryTabs.jsx'
import CategoryManager from '../NPCManager/CategoryManager.jsx'
import GalleryModal from './GalleryModal.jsx'
import ImageViewer from './ImageViewer.jsx'
import styles from './ImageGallery.module.css'

function ImageGallery() {
  const { images, categories, addCategory, updateCategory, deleteCategory } = useGallery()
  const toast = useToast()
  
  const [activeCategoryId, setActiveCategoryId] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingImage, setEditingImage] = useState(null)
  const [viewingImage, setViewingImage] = useState(null)

  const filteredImages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return images.filter((img) => {
      const matchesCategory =
        activeCategoryId === 'all'
          ? true
          : activeCategoryId === 'uncategorized'
            ? !img.categoryId
            : img.categoryId === activeCategoryId
      const matchesSearch = normalizedSearch
        ? [img.name, img.description].some((value) =>
            String(value ?? '').toLowerCase().includes(normalizedSearch),
          )
        : true

      return matchesCategory && matchesSearch
    })
  }, [activeCategoryId, images, searchTerm])

  function openCreateModal() {
    setEditingImage(null)
    setIsModalOpen(true)
  }

  function openEditModal(img, event) {
    event.stopPropagation()
    setEditingImage(img)
    setIsModalOpen(true)
  }

  function openViewer(img) {
    setViewingImage(img)
  }

  return (
    <section className={styles.module}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Modulo de Recursos</span>
        <h1>Galeria do Narrador</h1>
        <p>
          Guarde mapas, retratos de locais, itens e outras referencias visuais
          para compartilhar durante a sessao a um clique de distancia.
        </p>
      </div>

      <CategoryTabs
        categories={categories}
        npcs={images} // using npcs prop because CategoryTabs calculates length based on it
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        onManageCategories={() => setIsCategoryManagerOpen(true)}
      />

      <div className={styles.toolbar} aria-label="Ferramentas da Galeria">
        <label className={styles.searchBox}>
          <Search size={17} />
          <input
            type="search"
            placeholder="Buscar imagem"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
        <div className={styles.toolbarActions}>
          <button className={styles.primaryButton} type="button" onClick={openCreateModal}>
            <Plus size={17} />
            Adicionar Imagem
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredImages.length === 0 ? (
          <div className={styles.emptyState}>
            <ImageIcon size={48} strokeWidth={1} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>Nenhuma imagem encontrada.</p>
          </div>
        ) : (
          filteredImages.map((img) => (
            <GalleryCard 
              key={img.id} 
              img={img} 
              categories={categories} 
              onView={() => openViewer(img)} 
              onEdit={(e) => openEditModal(img, e)} 
            />
          ))
        )}
      </div>

      <CategoryManager
        isOpen={isCategoryManagerOpen}
        categories={categories}
        onClose={() => setIsCategoryManagerOpen(false)}
        onAddCategory={async (category) => {
          try {
            await addCategory(category)
            toast.success(`${category.name} criada.`, 'Categoria adicionada')
          } catch (error) {
            toast.error(error.message || 'Não foi possível criar a categoria.', 'Erro')
          }
        }}
        onUpdateCategory={async (categoryId, updates) => {
          try {
            await updateCategory(categoryId, updates)
            toast.success('Categoria salva.', 'Galeria atualizada')
          } catch (error) {
            toast.error(error.message || 'Não foi possível salvar a categoria.', 'Erro')
          }
        }}
        onDeleteCategory={async (categoryId) => {
          try {
            await deleteCategory(categoryId)
            toast.info('Categoria removida.', 'Galeria atualizada')
          } catch (error) {
            toast.error(error.message || 'Não foi possível remover a categoria.', 'Erro')
          }
        }}
      />

      {isModalOpen && (
        <GalleryModal
          isOpen={isModalOpen}
          image={editingImage}
          categories={categories}
          defaultCategoryId={activeCategoryId}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {viewingImage && (
        <ImageViewer 
          image={viewingImage} 
          categories={categories}
          onClose={() => setViewingImage(null)} 
        />
      )}
    </section>
  )
}

function GalleryCard({ img, categories, onView, onEdit }) {
  const [fetchedImageUrl, setFetchedImageUrl] = useState(null)
  const storedImageUrl = useLibraryPortraitUrl(img.storagePath)
  const category = categories.find((c) => c.id === img.categoryId)
  const displayUrl = img.url || storedImageUrl || fetchedImageUrl

  useEffect(() => {
    if (img.url || img.storagePath) return

    let active = true
    let blobUrl = null

    api.getImage(img.id)
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
  }, [img.id, img.storagePath, img.url])

  return (
    <article className={styles.card} onClick={onView}>
      <div className={styles.cardImageContainer}>
        {displayUrl ? (
          <img src={displayUrl} alt={img.name} className={styles.cardImage} />
        ) : (
          <ImageIcon className={styles.cardPlaceholder} size={32} strokeWidth={1} />
        )}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle} title={img.name}>{img.name}</h3>
        </div>
        {category && (
          <div style={{ display: 'flex' }}>
            <span 
              className={styles.cardCategory} 
              style={{ color: category.color, border: `1px solid ${category.color}40` }}
            >
              {category.name}
            </span>
          </div>
        )}
        <div className={styles.cardActions}>
          <button className={styles.actionButton} onClick={onView} title="Visualizar expandido">
            <Maximize2 size={14} /> View
          </button>
          <button className={styles.actionButton} onClick={onEdit} title="Editar metadados">
            <Edit2 size={14} /> Edit
          </button>
        </div>
      </div>
    </article>
  )
}

export default ImageGallery
