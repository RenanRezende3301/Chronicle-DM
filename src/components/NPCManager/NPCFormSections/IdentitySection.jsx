import { clans } from '../../../data/clans.js'
import styles from '../NPCManager.module.css'

const npcTypes = [
  { value: 'vampire', label: 'Vampiro' },
  { value: 'mortal', label: 'Mortal' },
  { value: 'ghoul', label: 'Ghoul' },
  { value: 'other', label: 'Outro' },
]

function IdentitySection({
  formData,
  categories,
  imagePreview,
  error,
  onChange,
  onImageFile,
  onRemoveImage,
}) {
  return (
    <section className={styles.formSection}>
      <h3>Identidade</h3>
      <div className={styles.formGrid}>
        <label>
          Nome *
          <input
            value={formData.name}
            onChange={(event) => onChange({ name: event.target.value })}
            aria-invalid={Boolean(error)}
          />
          {error && <small className={styles.fieldError}>{error}</small>}
        </label>
        <label>
          Categoria
          <select
            value={formData.categoryId ?? ''}
            onChange={(event) => onChange({ categoryId: event.target.value || null })}
          >
            <option value="">Sem Categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Cla
          <select
            value={formData.clan}
            onChange={(event) => onChange({ clan: event.target.value })}
          >
            <option value="">Sem cla</option>
            {clans.map((clan) => (
              <option key={clan.id} value={clan.name}>
                {clan.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tipo
          <select
            value={formData.type}
            onChange={(event) => onChange({ type: event.target.value })}
          >
            {npcTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Geracao
          <input
            type="number"
            min="4"
            max="16"
            value={formData.generation}
            onChange={(event) => onChange({ generation: Number(event.target.value) })}
          />
        </label>
        <label>
          Potencia de Sangue
          <input
            type="number"
            min="0"
            max="10"
            value={formData.bloodPotency}
            onChange={(event) => onChange({ bloodPotency: Number(event.target.value) })}
          />
        </label>
        <label>
          Humanidade
          <input
            type="number"
            min="0"
            max="10"
            value={formData.humanity}
            onChange={(event) => onChange({ humanity: Number(event.target.value) })}
          />
        </label>
        <label>
          Conceito
          <input
            value={formData.concept}
            onChange={(event) => onChange({ concept: event.target.value })}
          />
        </label>
      </div>

      <div className={styles.imageTools}>
        <div className={styles.imagePreview}>
          {imagePreview || formData.imageUrl ? (
            <img src={imagePreview || formData.imageUrl} alt="" />
          ) : (
            <span>Sem imagem</span>
          )}
        </div>
        <label>
          Selecionar imagem
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onImageFile} />
        </label>
        <label>
          Ou cole uma URL de imagem
          <input
            value={formData.imageUrl}
            onChange={(event) => onChange({
              imageUrl: event.target.value,
              // A URL externa and a private Supabase portrait are mutually
              // exclusive. Keeping an old storage path would make Supabase
              // validate the URL change as an invalid private portrait.
              portraitPath: '',
            })}
            placeholder="https://..."
          />
        </label>
        <button type="button" onClick={onRemoveImage}>
          Remover imagem
        </button>
      </div>

      <label>
        Descricao
        <textarea
          value={formData.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </label>
      <label>
        Notas do Narrador
        <textarea
          value={formData.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
        />
      </label>
    </section>
  )
}

export default IdentitySection
