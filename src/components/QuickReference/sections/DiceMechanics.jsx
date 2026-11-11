import styles from '../QuickReference.module.css'

function DiceMechanics({ data }) {
  return (
    <div className={styles.referenceSection}>
      <Summary items={data.summary} />

      <ReferenceTable
        columns={['Dificuldades de Testes', 'Exemplo de Situação']}
        rows={data.difficulties.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label.replace(':', '')}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <ReferenceTable
        columns={['Testes Resistidos', 'Mecânica']}
        rows={data.opposedTests.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label.replace(':', '')}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <ReferenceTable
        columns={['Tipos de Críticos', 'Mecânica']}
        rows={data.criticals.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label.replace(':', '')}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <ReferenceTable
        columns={['Tipos de Falhas', 'Mecânica']}
        rows={data.failures.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label.replace(':', '')}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />
    </div>
  )
}

function Summary({ items }) {
  return (
    <ul className={styles.summaryList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-text)">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--color-text-muted)">$1</em>')
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

export default DiceMechanics
