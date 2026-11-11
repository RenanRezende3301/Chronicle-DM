import { Settings } from 'lucide-react'
import styles from './NPCManager.module.css'

function CategoryTabs({
  categories,
  npcs,
  activeCategoryId,
  onSelectCategory,
  onManageCategories,
}) {
  const allCount = npcs.length

  return (
    <div className={styles.categoryBar}>
      <button
        className={`${styles.categoryTab} ${
          activeCategoryId === 'all' ? styles.categoryTabActive : ''
        }`}
        type="button"
        onClick={() => onSelectCategory('all')}
      >
        <span className={styles.categoryColor} />
        Todos ({allCount})
      </button>

      {categories.map((category) => {
        const count = npcs.filter((npc) => npc.categoryId === category.id).length

        return (
          <button
            className={`${styles.categoryTab} ${
              activeCategoryId === category.id ? styles.categoryTabActive : ''
            }`}
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
          >
            <span
              className={styles.categoryColor}
              style={{ backgroundColor: category.color }}
            />
            {category.name} ({count})
          </button>
        )
      })}

      <button
        className={styles.categoryManageButton}
        type="button"
        onClick={onManageCategories}
        title="Gerenciar categorias"
        aria-label="Gerenciar categorias"
      >
        <Settings size={16} />
      </button>
    </div>
  )
}

export default CategoryTabs
