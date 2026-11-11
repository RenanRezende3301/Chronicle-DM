import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key)
      return storedValue ? JSON.parse(storedValue) : initialValue
    } catch (error) {
      console.warn(`Nao foi possivel ler ${key} do LocalStorage.`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Nao foi possivel salvar ${key} no LocalStorage.`, error)
    }
  }, [key, value])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setValue(initialValue)
    } catch (error) {
      console.warn(`Nao foi possivel remover ${key} do LocalStorage.`, error)
    }
  }, [initialValue, key])

  return [value, setValue, removeValue]
}
