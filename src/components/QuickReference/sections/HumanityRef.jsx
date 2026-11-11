import styles from '../QuickReference.module.css'

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-text-primary)">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--color-text-muted)">$1</em>')
}

function HumanityRef({ data }) {
  return (
    <div className={styles.referenceSection}>
      <ReferenceTable
        columns={['Conceito', 'Descrição']}
        rows={data.rules.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label.replace(':', '')}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary-light)' }}>
        Tabela de Faixas de Humanidade (Efeitos Mecânicos V5)
      </h3>
      <ReferenceTable
        columns={['Faixa', 'Significado', 'Efeitos Mecânicos e Narrativos no V5']}
        rows={data.levels.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.range}</strong>,
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.meaning}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.effect) }} />
        ])}
      />

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary-light)' }}>
        Efeito no Frenesi e Remorso
      </h3>
      <ReferenceTable
        columns={['Situação', 'Regra']}
        rows={data.frenzy.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label.replace(':', '')}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
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

export default HumanityRef
