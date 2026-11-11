import { skills } from '../../../data/skills.js'
import Stepper from '../../common/Stepper.jsx'
import styles from '../NPCManager.module.css'

const categoryLabels = {
  physical: 'Fisicas',
  social: 'Sociais',
  mental: 'Mentais',
}

function SkillsSection({ formData, onChange }) {
  function updateSkill(key, value) {
    onChange({
      skills: {
        ...formData.skills,
        [key]: value,
      },
    })
  }

  return (
    <section className={styles.formSection}>
      <h3>Habilidades</h3>
      <div className={styles.skillColumns}>
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h4>{categoryLabels[category]}</h4>
            {items.map((skill) => (
              <Stepper
                key={skill.key}
                label={skill.name}
                min={0}
                max={10}
                value={formData.skills[skill.key]}
                onChange={(value) => updateSkill(skill.key, value)}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
