import { useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { CATEGORY_COLORS } from '../../data/categoryColors.js'
import Modal from '../common/Modal.jsx'
import commonStyles from '../common/common.module.css'
import styles from './NPCManager.module.css'

function CategoryManager({
  isOpen,
  categories,
  onClose,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0])

  function handleAddCategory(event) {
    event.preventDefault()

    if (!newName.trim()) {
      return
    }

    onAddCategory({ name: newName.trim(), color: newColor })
    setNewName('')
    setNewColor(CATEGORY_COLORS[0])
  }

  return (
    <Modal isOpen={isOpen} title="Gerenciar categorias" size="medium" onClose={onClose}>
      <form className={styles.categoryForm} onSubmit={handleAddCategory}>
        <label>
          Nova categoria
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Ex: Antagonistas"
          />
        </label>
        <div className={styles.colorSwatches}>
          {CATEGORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={newColor === color ? styles.swatchActive : ''}
              style={{ backgroundColor: color }}
              onClick={() => setNewColor(color)}
              aria-label={`Selecionar cor ${color}`}
            />
          ))}
        </div>
        <button className={commonStyles.primaryButton} type="submit">
          <Plus size={16} />
          Criar
        </button>
      </form>

      <div className={styles.categoryList}>
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            onUpdateCategory={onUpdateCategory}
            onDeleteCategory={onDeleteCategory}
          />
        ))}
      </div>
    </Modal>
  )
}

function CategoryRow({ category, onUpdateCategory, onDeleteCategory }) {
  const [name, setName] = useState(category.name)
  const [color, setColor] = useState(category.color)

  return (
    <article className={styles.categoryRow}>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <div className={styles.colorSwatches}>
        {CATEGORY_COLORS.map((option) => (
          <button
            key={option}
            type="button"
            className={color === option ? styles.swatchActive : ''}
            style={{ backgroundColor: option }}
            onClick={() => setColor(option)}
            aria-label={`Selecionar cor ${option}`}
          />
        ))}
      </div>
      <button
        className={commonStyles.secondaryButton}
        type="button"
        onClick={() => onUpdateCategory(category.id, { name: name.trim(), color })}
      >
        <Save size={16} />
        Salvar
      </button>
      <button
        className={commonStyles.destructiveButton}
        type="button"
        onClick={() => {
          if (window.confirm(`Deletar categoria "${category.name}"?`)) {
            onDeleteCategory(category.id)
          }
        }}
      >
        <Trash2 size={16} />
        Deletar
      </button>
    </article>
  )
}

export default CategoryManager
