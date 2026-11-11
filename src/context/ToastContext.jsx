import { useCallback, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import ToastViewport from '../components/common/Toast.jsx'
import { ToastContext } from './ToastContextObject.js'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    )
  }, [])

  const notify = useCallback((toast) => {
    const id = toast.id ?? nanoid()
    setToasts((currentToasts) => [...currentToasts, { ...toast, id }])
    return id
  }, [])

  const value = useMemo(
    () => ({
      notify,
      dismissToast,
      success: (message, title = 'Sucesso') =>
        notify({ type: 'success', title, message }),
      error: (message, title = 'Erro') =>
        notify({ type: 'error', title, message, duration: 5000 }),
      info: (message, title = 'Aviso') => notify({ type: 'info', title, message }),
      warning: (message, title = 'Atencao') =>
        notify({ type: 'warning', title, message, duration: 4500 }),
    }),
    [dismissToast, notify],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
