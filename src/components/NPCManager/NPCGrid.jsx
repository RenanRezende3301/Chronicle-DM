import NPCCard from './NPCCard.jsx'
import styles from './NPCManager.module.css'

function NPCGrid({
  npcs,
  categories,
  onViewNPC,
  onEditNPC,
  onDeleteNPC,
  onDuplicateNPC,
  onMoveNPC,
  onExportNPC,
}) {
  if (!npcs.length) {
    return (
      <div className={styles.emptyState}>
        Nenhum NPC nesta categoria. Clique em + para criar.
      </div>
    )
  }

  return (
    <div className={styles.npcGrid}>
      {npcs.map((npc) => (
        <NPCCard
          key={npc.id}
          npc={npc}
          categories={categories}
          onViewNPC={onViewNPC}
          onEditNPC={onEditNPC}
          onDeleteNPC={onDeleteNPC}
          onDuplicateNPC={onDuplicateNPC}
          onMoveNPC={onMoveNPC}
          onExportNPC={onExportNPC}
        />
      ))}
    </div>
  )
}

export default NPCGrid
