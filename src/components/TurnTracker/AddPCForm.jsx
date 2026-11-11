import { useState } from 'react'
import styles from './TurnTracker.module.css'

function AddPCForm({ onAddPC, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    healthMax: 5,
    willpowerMax: 5,
    isVampire: true,
    hunger: 1,
  })

  function updateForm(updates) {
    setFormData((current) => ({ ...current, ...updates }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formData.name.trim()) {
      return
    }

    onAddPC({
      ...formData,
      name: formData.name.trim(),
    })
    onCancel()
  }

  return (
    <form className={styles.addPCForm} onSubmit={handleSubmit}>
      <label>
        Nome
        <input
          value={formData.name}
          onChange={(event) => updateForm({ name: event.target.value })}
          autoFocus
        />
      </label>
      <label>
        Saude Max.
        <input
          type="number"
          min="1"
          max="20"
          value={formData.healthMax}
          onChange={(event) => updateForm({ healthMax: Number(event.target.value) })}
        />
      </label>
      <label>
        FdV Max.
        <input
          type="number"
          min="1"
          max="20"
          value={formData.willpowerMax}
          onChange={(event) => updateForm({ willpowerMax: Number(event.target.value) })}
        />
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={formData.isVampire}
          onChange={(event) => updateForm({ isVampire: event.target.checked })}
        />
        Vampiro
      </label>
      {formData.isVampire && (
        <label>
          Fome
          <input
            type="number"
            min="0"
            max="5"
            value={formData.hunger}
            onChange={(event) => updateForm({ hunger: Number(event.target.value) })}
          />
        </label>
      )}
      <div className={styles.formActions}>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit">Adicionar</button>
      </div>
    </form>
  )
}

export default AddPCForm
