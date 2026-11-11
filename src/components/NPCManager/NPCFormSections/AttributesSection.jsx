import { attributes } from '../../../data/skills.js'
import { calculateDerived } from '../../../utils/npcUtils.js'
import Stepper from '../../common/Stepper.jsx'
import styles from '../NPCManager.module.css'

const categoryLabels = {
  physical: 'Fisicos',
  social: 'Sociais',
  mental: 'Mentais',
}

function AttributesSection({ formData, onChange }) {
  const derived = calculateDerived(formData.attributes)

  function updateAttribute(key, value) {
    onChange({
      attributes: {
        ...formData.attributes,
        [key]: value,
      },
    })
  }

  return (
    <section className={styles.formSection}>
      <h3>Atributos</h3>
      <div className={styles.attributeColumns}>
        {Object.entries(attributes).map(([category, items]) => (
          <div key={category}>
            <h4>{categoryLabels[category]}</h4>
            {items.map((attribute) => (
              <Stepper
                key={attribute.key}
                label={attribute.name}
                min={1}
                max={10}
                value={formData.attributes[attribute.key]}
                onChange={(value) => updateAttribute(attribute.key, value)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={styles.derivedStats}>
        <span>Saude Maxima: {derived.healthMax}</span>
        <span>Forca de Vontade Max.: {derived.willpowerMax}</span>
        <span>Iniciativa Base: {derived.initiativeBase}</span>
      </div>
    </section>
  )
}

export default AttributesSection
