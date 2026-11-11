import { useDroppable } from '@dnd-kit/core'
import { ArrowDownToLine } from 'lucide-react'
import styles from './TurnTracker.module.css'

function DropZone() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'turn-tracker-dropzone',
  })

  return (
    <div
      ref={setNodeRef}
      className={`${styles.dropZone} ${isOver ? styles.dropZoneActive : ''}`}
    >
      <ArrowDownToLine size={22} />
      <strong>Arraste NPCs aqui</strong>
      <span>Solte um dossie da biblioteca para colocar na cena.</span>
    </div>
  )
}

export default DropZone
