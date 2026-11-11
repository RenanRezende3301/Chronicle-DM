import { useMemo, useState } from 'react'
import { APP_PAGES } from './appPages.js'
import { AppContext } from './AppContextObject.js'

export function AppProvider({ children }) {
  const [activePage, setActivePage] = useState(APP_PAGES.npcs.id)
  const [isTrackerMinimized, setIsTrackerMinimized] = useState(false)

  const value = useMemo(
    () => ({
      activePage,
      setActivePage,
      isTrackerMinimized,
      toggleTracker: () => setIsTrackerMinimized((current) => !current),
    }),
    [activePage, isTrackerMinimized],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
