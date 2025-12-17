import { ref } from 'vue'
import { defaultShortcuts } from '@/enums/keyboardShortcutsEnum'

export interface KeyboardShortcut {
  id: string
  name: string
  description: string
  key: string
  ctrl: boolean
  shift: boolean
  alt: boolean
}

interface ShortcutConfig {
  key: string
  ctrl: boolean
  shift: boolean
  alt: boolean
}

export class KeyboardService {
  private shortcuts: Map<string, ShortcutConfig> = new Map()
  private isListening = false
  private router: { push: (path: string) => void } | null = null
  private mode: { value: string } | null = null

  constructor() {
    this.loadShortcutsFromStorage()
  }

  setRouter(router: { push: (path: string) => void }) {
    this.router = router
  }

  setColorMode(mode: { value: string }) {
    this.mode = mode
  }

  // Load shortcuts from localStorage
  private loadShortcutsFromStorage() {
    const saved = localStorage.getItem('keyboardShortcuts')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        Object.entries(defaultShortcuts).forEach(([key, value]) => {
          this.shortcuts.set(key, parsed[key] || value)
        })
      } catch {
        this.shortcuts = new Map(Object.entries(defaultShortcuts))
      }
    } else {
      this.shortcuts = new Map(Object.entries(defaultShortcuts))
    }
  }

  // Save shortcuts to localStorage
  saveShortcuts() {
    const obj: Record<string, ShortcutConfig> = {}
    this.shortcuts.forEach((value, key) => {
      obj[key] = value
    })
    localStorage.setItem('keyboardShortcuts', JSON.stringify(obj))

    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('shortcutsUpdated'))
  }

  // Get all shortcuts
  getAllShortcuts(): Map<string, ShortcutConfig> {
    return this.shortcuts
  }

  // Update a shortcut
  updateShortcut(id: string, key: string, ctrl: boolean, shift: boolean, alt: boolean) {
    this.shortcuts.set(id, { key, ctrl, shift, alt })
    this.saveShortcuts()
  }

  // Reset shortcuts to default
  resetToDefaults() {
    this.shortcuts = new Map(Object.entries(defaultShortcuts))
    this.saveShortcuts()
  }

  // Start listening for keyboard events
  startListening() {
    if (this.isListening) return

    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.isListening = true
  }

  // Stop listening
  stopListening() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this))
    this.isListening = false
  }

  // Handle keyboard events
  private handleKeyDown(event: KeyboardEvent) {
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey // Support both Ctrl and Cmd
    const shift = event.shiftKey
    const alt = event.altKey

    // Check for favorite shortcuts (Ctrl+1-9)
    if (ctrl && !shift && !alt && /^[1-9]$/.test(key)) {
      event.preventDefault()
      this.handleFavoriteShortcut(parseInt(key))
      return
    }

    // Check registered shortcuts
    this.shortcuts.forEach((shortcut, id) => {
      if (
        shortcut.key === key &&
        shortcut.ctrl === ctrl &&
        shortcut.shift === shift &&
        shortcut.alt === alt
      ) {
        event.preventDefault()
        this.executeShortcutAction(id)
      }
    })
  }

  // Execute shortcut action
  private executeShortcutAction(id: string) {
    switch (id) {
      case 'search':
        this.openSearch()
        break
      case 'darkMode':
        this.toggleDarkMode()
        break
      case 'settings':
        this.navigateToSettings()
        break
      case 'dashboard':
        this.navigateToDashboard()
        break
    }
  }

  // Shortcut actions
  private openSearch() {
    const searchEvent = new CustomEvent('openSearch')
    window.dispatchEvent(searchEvent)
  }

  private toggleDarkMode() {
    if (this.mode) {
      this.mode.value = this.mode.value === 'dark' ? 'light' : 'dark'
    }
  }

  private navigateToSettings() {
    if (this.router) {
      this.router.push('/settings')
    }
  }

  private navigateToDashboard() {
    if (this.router) {
      this.router.push('/')
    }
  }

  // Handle favorite shortcuts (Ctrl+1-9)
  private handleFavoriteShortcut(number: number) {
    const favoriteCards = localStorage.getItem('favoriteCards')
    if (favoriteCards) {
      try {
        const favorites = JSON.parse(favoriteCards)
        if (favorites[number - 1]) {
          const favorite = favorites[number - 1]

          const route = favorite.route || favorite.card?.route || favorite.card?.path
          if (this.router && route) {
            this.router.push(route)
          } else {
            console.warn('No route found for favorite:', favorite)
          }
        } else {
          console.log(`No favorite at position ${number}`)
        }
      } catch (error) {
        console.error('Failed to parse favorite cards:', error)
      }
    } else {
      console.log('No favorite cards found in localStorage')
    }
  }

  // Get shortcut display string
  static getShortcutDisplay(shortcut: ShortcutConfig | KeyboardShortcut): string {
    const parts: string[] = []
    if (shortcut.ctrl) parts.push('Ctrl')
    if (shortcut.shift) parts.push('Shift')
    if (shortcut.alt) parts.push('Alt')
    parts.push(shortcut.key.toUpperCase())
    return parts.join(' + ')
  }
}

// Global instance
export const keyboardService = new KeyboardService()

// Composable for Vue components
export function useKeyboardShortcuts() {
  const shortcuts = ref<KeyboardShortcut[]>([
    {
      id: 'search',
      name: 'Open Search',
      description: 'Open the search dialog',
      ...defaultShortcuts.search,
    },
    {
      id: 'darkMode',
      name: 'Toggle Dark Mode',
      description: 'Switch between light and dark mode',
      ...defaultShortcuts.darkMode,
    },
    {
      id: 'settings',
      name: 'Open Settings',
      description: 'Navigate to settings page',
      ...defaultShortcuts.settings,
    },
    {
      id: 'dashboard',
      name: 'Go to Dashboard',
      description: 'Navigate to dashboard',
      ...defaultShortcuts.dashboard,
    },
  ])

  const loadShortcuts = () => {
    const saved = localStorage.getItem('keyboardShortcuts')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        shortcuts.value = shortcuts.value.map((s) => ({
          ...s,
          ...(parsed[s.id] || {}),
        }))
      } catch {
        // Keep defaults
      }
    }
  }

  const updateShortcut = (id: string, key: string, ctrl: boolean, shift: boolean, alt: boolean) => {
    const shortcut = shortcuts.value.find((s) => s.id === id)
    if (shortcut) {
      shortcut.key = key
      shortcut.ctrl = ctrl
      shortcut.shift = shift
      shortcut.alt = alt

      // Save to localStorage
      const obj: Record<string, ShortcutConfig> = {}
      shortcuts.value.forEach((s) => {
        obj[s.id] = { key: s.key, ctrl: s.ctrl, shift: s.shift, alt: s.alt }
      })
      localStorage.setItem('keyboardShortcuts', JSON.stringify(obj))

      // Update service
      keyboardService.updateShortcut(id, key, ctrl, shift, alt)
    }
  }

  const resetToDefaults = () => {
    shortcuts.value = shortcuts.value.map((s) => ({
      ...s,
      ...defaultShortcuts[s.id as keyof typeof defaultShortcuts],
    }))

    // Save to localStorage
    const obj: Record<string, ShortcutConfig> = {}
    shortcuts.value.forEach((s) => {
      obj[s.id] = { key: s.key, ctrl: s.ctrl, shift: s.shift, alt: s.alt }
    })
    localStorage.setItem('keyboardShortcuts', JSON.stringify(obj))

    keyboardService.resetToDefaults()
  }

  const getShortcutDisplay = (shortcut: ShortcutConfig | KeyboardShortcut): string => {
    return KeyboardService.getShortcutDisplay(shortcut)
  }

  return {
    shortcuts,
    loadShortcuts,
    updateShortcut,
    resetToDefaults,
    getShortcutDisplay,
  }
}
