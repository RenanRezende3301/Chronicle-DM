import styles from '../QuickReference.module.css'

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-text-primary)">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--color-text-muted)">$1</em>')
}

function CompulsionsRef({ data }) {
  return (
    <div className={styles.referenceSection}>
      <ReferenceTable
        columns={['Regra', 'Descrição']}
        rows={data.rules.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary-light)' }}>
        Tabela de Compulsões por Clã (Oficiais V5)
      </h3>
      <ReferenceTable
        columns={['Clã', 'Compulsão', 'Efeito Resumido (Mecânica V5)']}
        rows={data.rows.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.clan}</strong>,
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.compulsion}</strong>,
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

export default CompulsionsRef
