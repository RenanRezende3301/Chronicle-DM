import styles from '../QuickReference.module.css'

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-text-primary)">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--color-text-muted)">$1</em>')
    .replace(/`(.*?)`/g, '<code style="color: var(--color-primary-light); background: rgba(139,0,0,0.15); padding: 2px 5px; border-radius: 4px; font-family: var(--font-mono)">$1</code>')
}

function DamageRules({ data }) {
  return (
    <div className={styles.referenceSection}>
      <ReferenceTable
        columns={['Tipos de Dano', 'Regra e Aplicação']}
        rows={data.damageTypes.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label.replace(':', '')}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <ReferenceTable
        columns={['Estado', 'Condição Mecânica', 'Efeito no Jogo']}
        rows={data.states.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.state}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.condition) }} />,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.effect) }} />
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

export default DamageRules
