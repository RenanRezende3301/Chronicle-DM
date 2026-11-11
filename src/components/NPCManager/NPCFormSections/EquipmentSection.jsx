import { nanoid } from 'nanoid'
import { Plus, Trash2 } from 'lucide-react'
import styles from '../NPCManager.module.css'

function EquipmentSection({ formData, onChange }) {
  function updateEquipment(nextEquipment) {
    onChange({ equipment: nextEquipment })
  }

  function updateItem(id, updates) {
    updateEquipment(
      formData.equipment.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    )
  }

  return (
    <section className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <h3>Equipamentos e Armas</h3>
        <button
          type="button"
          onClick={() =>
            updateEquipment([...formData.equipment, { id: nanoid(), name: '', notes: '' }])
          }
        >
          <Plus size={16} />
          Adicionar Item
        </button>
      </div>
      <div className={styles.dynamicList}>
        {formData.equipment.map((item) => (
          <article className={styles.equipmentRow} key={item.id}>
            <input
              value={item.name}
              onChange={(event) => updateItem(item.id, { name: event.target.value })}
              placeholder="Nome do item"
            />
            <input
              value={item.notes}
              onChange={(event) => updateItem(item.id, { notes: event.target.value })}
              placeholder="Observacao"
            />
            <button
              type="button"
              onClick={() =>
                updateEquipment(formData.equipment.filter((entry) => entry.id !== item.id))
              }
              aria-label="Remover item"
            >
              <Trash2 size={16} />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EquipmentSection
