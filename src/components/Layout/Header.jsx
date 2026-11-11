import { BookOpen, LogOut, Menu, Settings } from 'lucide-react'
import { useAuth } from '../../context/useAuth.js'
import { useUserData } from '../../context/useUserData.js'
import styles from './Layout.module.css'

function Header({ onOpenNavigation }) {
  const { user, logout, openAccountSettings, setActiveExperience } = useAuth()
  const { syncState } = useUserData()
  const syncLabel =
    syncState === 'saving'
      ? 'Salvando'
      : syncState === 'error'
        ? 'Erro ao salvar'
        : 'Sincronizado'

  return (
    <header className={styles.header}>
      <button
        className={`${styles.iconButton} ${styles.mobileMenuButton}`}
        type="button"
        aria-label="Abrir navegação"
        onClick={onOpenNavigation}
      >
        <Menu size={20} strokeWidth={1.7} />
      </button>
      <div className={styles.brandMark} aria-hidden="true" />
      <div className={styles.brand}>
        <span>Chronicle</span>
        <strong>V5</strong>
      </div>
      <div className={styles.headerDivider} />
      <span className={styles.headerMode}>{syncLabel}</span>
      <span className={styles.accountName}>{user?.displayName}</span>
      <div className={styles.headerActions}>
        {user?.authBackend === 'supabase' ? (
          <button
            className={styles.iconButton}
            type="button"
            title="Abrir meus personagens"
            aria-label="Abrir meus personagens"
            onClick={() => setActiveExperience('player')}
          >
            <BookOpen size={18} strokeWidth={1.7} />
          </button>
        ) : null}
        <button
          className={styles.iconButton}
          type="button"
          title="Sair da conta"
          aria-label="Sair da conta"
          onClick={logout}
        >
          <LogOut size={18} strokeWidth={1.7} />
        </button>
        <button
          className={styles.iconButton}
          type="button"
          title="Configurações da conta"
          aria-label="Configurações da conta"
          onClick={openAccountSettings}
        >
          <Settings size={18} strokeWidth={1.7} />
        </button>
      </div>
    </header>
  )
}

export default Header
