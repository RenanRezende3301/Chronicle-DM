import styles from '../QuickReference.module.css'

function WillpowerRules({ data }) {
  return (
    <div className={styles.referenceSection}>
      <ul className={styles.summaryList}>
        {data.summary.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default WillpowerRules
