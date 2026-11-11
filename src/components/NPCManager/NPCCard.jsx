import { useState, useRef, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Copy, Download, Eye, MoreVertical, Pencil, Trash2, UserRound } from 'lucide-react'
import { useIndexedDB } from '../../hooks/useIndexedDB.js'
import { useLibraryPortraitUrl } from '../../hooks/useLibraryPortraitUrl.js'
import styles from './NPCManager.module.css'

const typeLabels = {
  vampire: 'Vampiro',
  mortal: 'Mortal',
  ghoul: 'Ghoul',
  other: 'Outro',
}

function NPCCard({
  npc,
  categories,
  onViewNPC,
  onEditNPC,
  onDeleteNPC,
  onDuplicateNPC,
  onMoveNPC,
  onExportNPC,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { imageUrl: storedImageUrl } = useIndexedDB(npc.id)
  const canonicalImageUrl = useLibraryPortraitUrl(npc.portraitPath)
  const imageUrl = npc.imageUrl || canonicalImageUrl || storedImageUrl
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `npc-${npc.id}`,
    data: { type: 'npc', npc },
  })

  useEffect(() => {
    if (!isMenuOpen) return

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <article
      ref={setNodeRef}
      className={`${styles.npcCard} ${isDragging ? styles.npcCardDragging : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className={styles.cardImage}>
        {imageUrl ? <img src={imageUrl} alt="" /> : <UserRound size={46} />}
      </div>
      <div className={styles.cardBody}>
        <h3>{npc.name || 'NPC sem nome'}</h3>
        <p>
          {npc.clan || 'Sem cla'} · {typeLabels[npc.type] ?? 'Outro'}
        </p>
      </div>
      <footer className={styles.cardActions}>
        <button type="button" onClick={() => onViewNPC(npc)}>
          <Eye size={15} />
          Ver ficha
        </button>
        <div className={styles.cardMenu} ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Abrir menu do NPC"
            title="Menu"
          >
            <MoreVertical size={16} />
          </button>
          {isMenuOpen && (
            <div className={styles.cardMenuPanel}>
              <button type="button" onClick={() => onEditNPC(npc)}>
                <Pencil size={14} />
                Editar
              </button>
              <button type="button" onClick={() => onDuplicateNPC(npc)}>
                <Copy size={14} />
                Duplicar
              </button>
              <button type="button" onClick={() => onExportNPC(npc)}>
                <Download size={14} />
                Exportar
              </button>
              <label>
                Mover
                <select
                  value={npc.categoryId ?? ''}
                  onChange={(event) => onMoveNPC(npc.id, event.target.value || null)}
                >
                  <option value="">Sem Categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={() => onDeleteNPC(npc.id)}>
                <Trash2 size={14} />
                Deletar
              </button>
            </div>
          )}
        </div>
      </footer>
    </article>
  )
}

export default NPCCard
