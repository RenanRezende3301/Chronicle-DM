import styles from '../QuickReference.module.css'

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-text-primary)">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--color-text-muted)">$1</em>')
}

function BloodResonanceRef({ data }) {
  return (
    <div className={styles.referenceSection}>
      <ReferenceTable
        columns={['Regra Geral', 'Descricao']}
        rows={data.rules.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-gold)' }}>
        Niveis de Intensidade (Temperamento)
      </h3>
      <ReferenceTable
        columns={['Nivel', 'Efeito']}
        rows={data.temperaments.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-gold)' }}>
        Tabela de Humores e Bônus
      </h3>
      <ReferenceTable
        columns={['Humor / Ressonancia', 'Emocao Associada', 'Disciplinas Beneficiadas']}
        rows={data.resonances.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.humor}</strong>,
          row.emotion,
          <strong style={{ color: 'var(--color-accent-hover)' }}>{row.disciplines}</strong>
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

export default BloodResonanceRef
