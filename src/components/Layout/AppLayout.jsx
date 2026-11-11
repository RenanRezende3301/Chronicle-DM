import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import NPCManager from '../NPCManager/NPCManager.jsx'
import Notes from '../Notes/Notes.jsx'
import QuickReference from '../QuickReference/QuickReference.jsx'
import TurnTracker from '../TurnTracker/TurnTracker.jsx'
import ImageGallery from '../ImageGallery/ImageGallery.jsx'
import { APP_PAGES } from '../../context/appPages.js'
import { useAppContext } from '../../context/useAppContext.js'
import { useTurnTracker } from '../../hooks/useTurnTracker.js'
import { useToast } from '../../hooks/useToast.js'
import Header from './Header.jsx'
import SidebarNav from './SidebarNav.jsx'
import styles from './Layout.module.css'

const pageComponents = {
  [APP_PAGES.npcs.id]: <NPCManager />,
  [APP_PAGES.reference.id]: <QuickReference />,
  [APP_PAGES.notes.id]: <Notes />,
  [APP_PAGES.gallery.id]: <ImageGallery />,
}

function AppLayout() {
  const { activePage, isTrackerMinimized } = useAppContext()
  const { addParticipant, participants, reorderParticipants } = useTurnTracker()
  const toast = useToast()
  const [activeNPC, setActiveNPC] = useState(null)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function collisionDetection(args) {
    const activeData = args.active.data.current

    if (activeData?.type === 'npc') {
      return pointerWithin(args).filter(
        (collision) => collision.id === 'turn-tracker-dropzone',
      )
    }

    return closestCenter(args)
  }

  function handleDragStart(event) {
    const activeData = event.active.data.current
    setActiveNPC(activeData?.type === 'npc' ? activeData.npc : null)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveNPC(null)

    if (!over) {
      return
    }

    const activeData = active.data.current

    if (activeData?.type === 'npc' && over.id === 'turn-tracker-dropzone') {
      addParticipant(activeData.npc)
      toast.success(`${activeData.npc.name} entrou na cena.`, 'Rastreador atualizado')
      return
    }

    if (activeData?.type === 'participant' && active.id !== over.id) {
      const currentIds = participants.map((participant) => participant.id)
      const oldIndex = currentIds.indexOf(active.id)
      const newIndex = currentIds.indexOf(over.id)

      if (oldIndex >= 0 && newIndex >= 0) {
        reorderParticipants(arrayMove(currentIds, oldIndex, newIndex))
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveNPC(null)}
    >
      <div
        className={`${styles.shell} ${
          isTrackerMinimized ? styles.shellTrackerMinimized : ''
        }`}
      >
        <Header onOpenNavigation={() => setIsMobileNavOpen(true)} />
        <SidebarNav
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />
        {isMobileNavOpen ? (
          <button
            className={styles.mobileNavBackdrop}
            type="button"
            aria-label="Fechar navegação"
            onClick={() => setIsMobileNavOpen(false)}
          />
        ) : null}
        <main className={styles.main}>
          {pageComponents[activePage]}
        </main>
        <TurnTracker />
      </div>
      <DragOverlay dropAnimation={null}>
        {activeNPC ? <NPCDragOverlay npc={activeNPC} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

function NPCDragOverlay({ npc }) {
  return (
    <article className={styles.dragOverlayCard}>
      <span>NPC</span>
      <strong>{npc.name || 'NPC sem nome'}</strong>
      <small>{npc.clan || npc.concept || 'Dossie da biblioteca'}</small>
    </article>
  )
}

export default AppLayout
