import { isEqual } from "es-toolkit"
import { useLocalStorage } from "minimal-shared/hooks"
import { getStorage as getStorageValue } from "minimal-shared/utils"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { SETTINGS_STORAGE_KEY } from "../settings-config"
import { SettingsContext } from "./settings-context"
import { defaultSettings as df } from "../settings-config"

// ----------------------------------------------------------------------

export function SettingsProvider({
  children,
  defaultSettings,
  storageKey = SETTINGS_STORAGE_KEY,
}: {
  children: ReactNode
  defaultSettings: typeof df
  storageKey?: string
}) {
  const { state, setState, resetState, setField } = useLocalStorage(
    storageKey,
    defaultSettings,
  )

  const [openDrawer, setOpenDrawer] = useState(false)

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev)
  }, [])

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false)
  }, [])

  const canReset = !isEqual(state, defaultSettings)

  const onReset = useCallback(() => {
    resetState(defaultSettings)
  }, [defaultSettings, resetState])

  // Version check and reset handling
  useEffect(() => {
    const storedValue = getStorageValue(storageKey) as typeof defaultSettings | null

    if (storedValue) {
      try {
        if (
          !storedValue.version ||
          storedValue.version !== defaultSettings.version
        ) {
          onReset()
        }
      } catch {
        onReset()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSettings.version, onReset, storageKey])

  const memoizedValue = useMemo(
    () => ({
      canReset,
      onReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      state,
      setState,
      setField,
    }),
    [
      canReset,
      onReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      state,
      setField,
      setState,
    ],
  )

  return (
    <SettingsContext.Provider value={memoizedValue as any}>
      {children}
    </SettingsContext.Provider>
  )
}
