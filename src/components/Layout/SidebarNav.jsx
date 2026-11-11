import { BookOpenText, FileText, UserRoundSearch, Image as ImageIcon } from 'lucide-react'
import { APP_PAGES } from '../../context/appPages.js'
import { useAppContext } from '../../context/useAppContext.js'
import styles from './Layout.module.css'

const navItems = [
  {
    ...APP_PAGES.npcs,
    icon: UserRoundSearch,
  },
  {
    ...APP_PAGES.reference,
    icon: BookOpenText,
  },
  {
    ...APP_PAGES.notes,
    icon: FileText,
  },
  {
    ...APP_PAGES.gallery,
    icon: ImageIcon,
  },
]

function SidebarNav({ isMobileOpen = false, onCloseMobile = () => {} }) {
  const { activePage, setActivePage } = useAppContext()

  return (
    <aside
      className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarMobileOpen : ''}`}
      aria-label="Navegacao principal"
    >
      <div className={styles.sidebarHeader}>
        <span>Dossie</span>
      </div>
      <nav className={styles.navList}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id

          return (
            <button
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              key={item.id}
              type="button"
              onClick={() => {
                onCloseMobile()
                setActivePage(item.id)
              }}
            >
              <Icon size={18} strokeWidth={1.7} />
              <span>{item.label}</span>
              <small>{item.eyebrow}</small>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default SidebarNav
