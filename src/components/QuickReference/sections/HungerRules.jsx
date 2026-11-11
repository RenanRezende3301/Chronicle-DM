import styles from '../QuickReference.module.css'

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-text-primary)">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color: var(--color-text-muted)">$1</em>')
}

function HungerRules({ data }) {
  return (
    <div className={styles.referenceSection}>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', marginTop: '0.5rem' }}>
        Sempre que o vampiro usa o seu Sangue, ele corre o risco de ficar mais faminto. O jogador rola <strong style={{ color: 'var(--color-text-primary)' }}>1 dado normal</strong> (nunca um Dado de Fome).
      </p>
      
      <ReferenceTable
        columns={['Teste de Despertar o Sangue (Rouse Check)', 'Resultado']}
        rows={data.rouseCheck.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label.replace(':', '')}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.2rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
        Nota: Não é possível gastar Força de Vontade para re-rolar um Teste de Despertar do Sangue.
      </p>

      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
        O Sangue pode ser ativado conscientemente ou por necessidade. Os usos mais comuns são:
      </p>
      <ReferenceTable
        columns={['Quando fazer um Teste de Despertar?', 'Efeito']}
        rows={data.whenToRouse.map((row) => [
          <strong style={{ color: 'var(--color-text-primary)' }}>{row.label.replace(':', '')}</strong>,
          <span dangerouslySetInnerHTML={{ __html: formatText(row.description) }} />
        ])}
      />

      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', marginTop: '0.5rem' }}>
        A Fome varia de 0 (saciado) a 5 (faminto).
      </p>
      <ReferenceTable
        columns={['O Limite: Fome 5', 'Consequência']}
        rows={data.hungerLimit.map((row) => [
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

export default HungerRules
