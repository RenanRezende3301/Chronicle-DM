import styles from '../QuickReference.module.css'

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-text-primary)">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--color-text-muted)">$1</em>')
}

function CombatRef({ data }) {
  return (
    <div className={styles.referenceSection}>
      <ReferenceTable
        columns={['Sequência de Turno no Combate', 'Descrição']}
        rows={data.sequence.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.step}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <ReferenceTable
        columns={['Ação de Combate', 'Pool de Ataque', 'Pool de Defesa / Esquiva', 'Dano Base']}
        rows={data.actions.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.action}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.attack) }} />,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.defense) }} />,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.damage) }} />
        ])}
      />
      
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '1rem', fontStyle: 'italic' }}>
        Nota de Regra: No V5, a perícia "Athletics" foi traduzida oficialmente como Esportes e "Melee" virou Armas Brancas. Alvos completamente parados e sem reação não têm direito a testes de defesa.
      </p>

      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', marginTop: '0.5rem' }}>
        Ao tentar se defender de armas de longo alcance usando a perícia <strong style={{ color: 'var(--color-text-primary)' }}>Destreza + Esportes</strong>, aplique os seguintes modificadores à parada de dados do defensor dependendo da sua proteção no cenário:
      </p>
      
      <ReferenceTable
        columns={['Modificadores de Cobertura', 'Efeito na Defesa']}
        rows={data.cover.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.type}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.modifier) }} />
        ])}
      />
    </div>
  )
}

function ReferenceTable({ columns, rows }) {
  return (
    <table className={styles.referenceTable}>
      <thead>
        <tr>
          {columns.map((column, idx) => (
            <th key={idx}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rIdx) => (
          <tr key={rIdx}>
            {row.map((cell, cIdx) => (
              <td key={cIdx} data-label={columns[cIdx]}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CombatRef
