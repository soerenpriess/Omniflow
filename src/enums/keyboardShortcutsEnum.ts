interface ShortcutConfig {
  key: string
  ctrl: boolean
  shift: boolean
  alt: boolean
}

export const defaultShortcuts: Record<string, ShortcutConfig> = {
  search: { key: 'k', ctrl: true, shift: false, alt: false },
  darkMode: { key: 'd', ctrl: true, shift: false, alt: false },
  settings: { key: ',', ctrl: true, shift: false, alt: false },
  dashboard: { key: 'h', ctrl: true, shift: false, alt: false },
}
