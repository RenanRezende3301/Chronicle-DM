import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { quickReference, quickReferenceSections } from '../../data/quickref.js'
import CombatRef from './sections/CombatRef.jsx'
import CompulsionsRef from './sections/CompulsionsRef.jsx'
import DamageRules from './sections/DamageRules.jsx'
import DiceMechanics from './sections/DiceMechanics.jsx'
import HumanityRef from './sections/HumanityRef.jsx'
import HungerRules from './sections/HungerRules.jsx'
import WillpowerRules from './sections/WillpowerRules.jsx'
import BloodResonanceRef from './sections/BloodResonanceRef.jsx'
import styles from './QuickReference.module.css'

const sectionComponents = {
  diceMechanics: DiceMechanics,
  hungerRules: HungerRules,
  damageRules: DamageRules,
  willpowerRules: WillpowerRules,
  combat: CombatRef,
  humanity: HumanityRef,
  compulsions: CompulsionsRef,
  bloodResonance: BloodResonanceRef,
}

function QuickReference() {
  const [activeSectionId, setActiveSectionId] = useState(quickReference.diceMechanics.id)
  const [query, setQuery] = useState('')
  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return quickReferenceSections
    }

    return quickReferenceSections.filter((section) =>
      JSON.stringify(section).toLowerCase().includes(normalizedQuery),
    )
  }, [query])
  const visibleSectionIds = filteredSections.map((section) => section.id)
  const activeSection = visibleSectionIds.includes(activeSectionId)
    ? quickReferenceSections.find((section) => section.id === activeSectionId)
    : filteredSections[0]
  const ActiveComponent = activeSection ? sectionComponents[activeSection.id] : null

  return (
    <section className={styles.module}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Referencia Rapida</span>
          <h1>Arquivo de Regras V5</h1>
          <p>Consulta compacta para manter a sessao fluindo sem abrir o livro.</p>
        </div>
        <label className={styles.searchBox}>
          <Search size={17} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar regra, cla..."
          />
        </label>
      </header>

      <div className={styles.referenceLayout}>
        <nav className={styles.sectionNav} aria-label="Secoes da referencia">
          <span className={styles.sectionNavLabel}>Escolha uma referência</span>
          {filteredSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={section.id === activeSection?.id ? styles.sectionNavActive : ''}
              onClick={() => setActiveSectionId(section.id)}
            >
              <span>{section.title}</span>
              <small>{section.id === activeSection?.id ? 'Em leitura' : 'Abrir referência'}</small>
            </button>
          ))}
        </nav>

        <article className={styles.contentPanel}>
          {activeSection && ActiveComponent ? (
            <>
              <span className={styles.panelEyebrow}>Arquivo V5</span>
              <h2>{activeSection.title}</h2>
              <ActiveComponent data={activeSection} query={query} />
            </>
          ) : (
            <div className={styles.emptyState}>Nenhuma regra encontrada.</div>
          )}
        </article>
      </div>
    </section>
  )
}

export default QuickReference
