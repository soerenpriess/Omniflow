<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icon } from '@iconify/vue'

const favoriteCards = inject<any>('favoriteCards')
const favoriteCardsUpdated = inject<any>('favoriteCardsUpdated')

const emit = defineEmits<{
  showFeedback: [message: string, type: 'success' | 'error' | 'info']
}>()

const favoriteCount = computed(() => favoriteCards?.value?.length || 0)
const fileInput = ref<HTMLInputElement>()
const themeFileInput = ref<HTMLInputElement>()
const shortcutFileInput = ref<HTMLInputElement>()

const customThemeCount = computed(() => {
  const saved = localStorage.getItem('customThemes')
  return saved ? JSON.parse(saved).length : 0
})

// Export Favorites
function exportFavorites() {
  if (!favoriteCards?.value || favoriteCards.value.length === 0) {
    emit('showFeedback', 'No favorites to export. Add some favorites first!', 'error')
    return
  }

  const dataStr = JSON.stringify(favoriteCards.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `omniflow-favorites-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)

  emit('showFeedback', 'Favorites exported successfully!', 'success')
}

// Export Themes (custom themes stored under 'customThemes')
function exportThemes() {
  const savedThemes = localStorage.getItem('customThemes')
  if (!savedThemes || JSON.parse(savedThemes).length === 0) {
    emit('showFeedback', 'No custom themes to export!', 'error')
    return
  }

  const dataStr = savedThemes
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `omniflow-themes-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)

  emit('showFeedback', 'Themes exported successfully!', 'success')
}

// Export Shortcuts
function exportShortcuts() {
  const savedShortcuts = localStorage.getItem('keyboardShortcuts')
  if (!savedShortcuts) {
    emit('showFeedback', 'No custom shortcuts to export!', 'error')
    return
  }

  const dataStr = savedShortcuts
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `omniflow-shortcuts-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)

  emit('showFeedback', 'Shortcuts exported successfully!', 'success')
}

function applyCustomThemeStyles(theme: any) {
  let styleEl = document.getElementById(`custom-theme-${theme.value}`)
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = `custom-theme-${theme.value}`
    document.head.appendChild(styleEl)
  }

  const css = `
    html.${theme.value} {
      --primary: ${theme.colors.light.primary};
      --primary-foreground: #ffffff;
      --background: ${theme.colors.light.background};
      --foreground: #1a1a1a;
      --card: ${theme.colors.light.card};
      --card-foreground: #1a1a1a;
      --accent: ${theme.colors.light.accent};
      --accent-foreground: #ffffff;
      --muted: ${theme.colors.light.background};
      --muted-foreground: #666666;
      --secondary: ${theme.colors.light.card};
      --secondary-foreground: #1a1a1a;
      --popover: ${theme.colors.light.card};
      --popover-foreground: #1a1a1a;
      --border: #e5e5e5;
      --input: #e5e5e5;
      --ring: ${theme.colors.light.primary};
      --sidebar: ${theme.colors.light.card};
      --sidebar-foreground: #1a1a1a;
      --sidebar-primary: ${theme.colors.light.primary};
      --sidebar-primary-foreground: #ffffff;
      --sidebar-accent: ${theme.colors.light.background};
      --sidebar-accent-foreground: #1a1a1a;
      --sidebar-border: #e5e5e5;
      --sidebar-ring: ${theme.colors.light.primary};
    }
    
    html.dark.${theme.value} {
      --primary: ${theme.colors.dark.primary};
      --primary-foreground: #ffffff;
      --background: ${theme.colors.dark.background};
      --foreground: #ffffff;
      --card: ${theme.colors.dark.card};
      --card-foreground: #ffffff;
      --accent: ${theme.colors.dark.accent};
      --accent-foreground: #ffffff;
      --muted: ${theme.colors.dark.card};
      --muted-foreground: #a0a0a0;
      --secondary: ${theme.colors.dark.card};
      --secondary-foreground: #ffffff;
      --popover: ${theme.colors.dark.card};
      --popover-foreground: #ffffff;
      --border: #333333;
      --input: #333333;
      --ring: ${theme.colors.dark.primary};
      --sidebar: ${theme.colors.dark.card};
      --sidebar-foreground: #ffffff;
      --sidebar-primary: ${theme.colors.dark.primary};
      --sidebar-primary-foreground: #ffffff;
      --sidebar-accent: ${theme.colors.dark.background};
      --sidebar-accent-foreground: #ffffff;
      --sidebar-border: #333333;
      --sidebar-ring: ${theme.colors.dark.primary};
    }
  `

  styleEl.textContent = css
}

// Import Themes
function importThemes(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string)
      if (Array.isArray(imported)) {
        // Get existing themes
        const savedThemes = localStorage.getItem('customThemes')
        const existingThemes = savedThemes ? JSON.parse(savedThemes) : []

        // Merge themes (avoid duplicates by value)
        const mergedThemes = [...existingThemes]
        imported.forEach((importedTheme: any) => {
          if (!mergedThemes.find((t: any) => t.value === importedTheme.value)) {
            mergedThemes.push(importedTheme)
          }
        })

        localStorage.setItem('customThemes', JSON.stringify(mergedThemes))

        // Apply styles for all imported themes
        imported.forEach((theme: any) => {
          applyCustomThemeStyles(theme)
        })

        emit('showFeedback', `Successfully imported ${imported.length} theme(s)!`, 'success')
        window.location.reload()
      } else {
        throw new Error('Invalid format')
      }
    } catch (error) {
      emit('showFeedback', 'Import failed. Invalid file format.', 'error')
    }
  }
  reader.readAsText(file)
  input.value = ''
}

// Import Favorites
function importFavorites(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string)
      if (Array.isArray(imported)) {
        favoriteCards!.value = imported
        if (favoriteCardsUpdated) {
          favoriteCardsUpdated.value = !favoriteCardsUpdated.value
        }
        emit('showFeedback', `Successfully imported ${imported.length} favorite(s)!`, 'success')
      } else {
        throw new Error('Invalid format')
      }
    } catch (error) {
      emit('showFeedback', 'Import failed. Invalid file format.', 'error')
    }
  }
  reader.readAsText(file)
  input.value = ''
}

// Import Shortcuts
function importShortcuts(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string)
      if (typeof imported === 'object' && imported !== null) {
        localStorage.setItem('keyboardShortcuts', JSON.stringify(imported))

        // Dispatch event to notify components
        window.dispatchEvent(new CustomEvent('shortcutsUpdated'))

        emit('showFeedback', 'Shortcuts imported successfully!', 'success')
      } else {
        throw new Error('Invalid format')
      }
    } catch (error) {
      emit('showFeedback', 'Import failed. Invalid file format.', 'error')
    }
  }
  reader.readAsText(file)
  input.value = ''
}

// Clear all favorites
function clearAllFavorites() {
  if (confirm('Are you sure you want to clear all favorites? This action cannot be undone.')) {
    favoriteCards!.value = []
    if (favoriteCardsUpdated) {
      favoriteCardsUpdated.value = !favoriteCardsUpdated.value
    }
    emit('showFeedback', 'All favorites have been cleared.', 'success')
  }
}

// Clear all themes
function clearAllThemes() {
  if (confirm('Are you sure you want to delete all custom themes? This action cannot be undone.')) {
    const savedThemes = localStorage.getItem('customThemes')
    if (savedThemes) {
      const themes = JSON.parse(savedThemes)
      // Remove style elements
      themes.forEach((theme: any) => {
        const styleEl = document.getElementById(`custom-theme-${theme.value}`)
        if (styleEl) {
          styleEl.remove()
        }
      })
    }
    localStorage.removeItem('customThemes')
    emit('showFeedback', 'All custom themes have been deleted.', 'success')
    window.location.reload()
  }
}

// Reset shortcuts to defaults
function resetAllShortcuts() {
  if (
    confirm(
      'Are you sure you want to reset all shortcuts to default? This action cannot be undone.',
    )
  ) {
    localStorage.removeItem('keyboardShortcuts')
    window.dispatchEvent(new CustomEvent('shortcutsUpdated'))
    emit('showFeedback', 'All shortcuts have been reset to default.', 'success')
  }
}

function viewStorageInfo() {
  const keys = Object.keys(localStorage).filter(
    (k) =>
      k.startsWith('omniflow') ||
      k.startsWith('theme') ||
      k === 'favoriteCards' ||
      k === 'customThemes' ||
      k === 'app-theme',
  )
  emit('showFeedback', `Found ${keys.length} Omniflow-related storage entries.`, 'info')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Favorites Management</CardTitle>
        <CardDescription>Export, import, or manage your favorite tools</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="hover:bg-muted/50 rounded-lg border p-4 transition-colors">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <Icon icon="mdi:star" class="h-5 w-5 text-amber-500" />
                <h4 class="font-medium">Your Favorites</h4>
              </div>
              <p class="text-muted-foreground mt-1 text-sm">
                {{ favoriteCount }} favorite tool(s) saved
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <Button size="sm" @click="exportFavorites" :disabled="favoriteCount === 0">
              <Icon icon="mdi:download" class="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button size="sm" variant="outline" @click="(fileInput as any)?.click()">
              <Icon icon="mdi:upload" class="mr-2 h-4 w-4" />
              Import
            </Button>
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              class="hidden"
              @change="importFavorites"
            />

            <Button
              size="sm"
              variant="destructive"
              @click="clearAllFavorites"
              :disabled="favoriteCount === 0"
            >
              <Icon icon="mdi:delete" class="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Themes Management</CardTitle>
        <CardDescription>Export or import your custom color themes</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="hover:bg-muted/50 rounded-lg border p-4 transition-colors">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <Icon icon="mdi:palette-advanced" class="h-5 w-5" />
                <h4 class="font-medium">Custom Themes</h4>
              </div>
              <p class="text-muted-foreground mt-1 text-sm">
                {{ customThemeCount }} custom theme(s) saved
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <Button size="sm" @click="exportThemes" :disabled="customThemeCount === 0">
              <Icon icon="mdi:download" class="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button size="sm" variant="outline" @click="(themeFileInput as any)?.click()">
              <Icon icon="mdi:upload" class="mr-2 h-4 w-4" />
              Import
            </Button>
            <input
              ref="themeFileInput"
              type="file"
              accept=".json"
              class="hidden"
              @change="importThemes"
            />

            <Button
              size="sm"
              variant="destructive"
              @click="clearAllThemes"
              :disabled="customThemeCount === 0"
            >
              <Icon icon="mdi:delete" class="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Shortcuts Management</CardTitle>
        <CardDescription>Export or import your custom keyboard shortcuts</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="hover:bg-muted/50 rounded-lg border p-4 transition-colors">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <Icon icon="mdi:keyboard" class="h-5 w-5" />
                <h4 class="font-medium">Keyboard Shortcuts</h4>
              </div>
              <p class="text-muted-foreground mt-1 text-sm">
                Export or import custom shortcuts configuration
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <Button size="sm" @click="exportShortcuts">
              <Icon icon="mdi:download" class="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button size="sm" variant="outline" @click="(shortcutFileInput as any)?.click()">
              <Icon icon="mdi:upload" class="mr-2 h-4 w-4" />
              Import
            </Button>
            <input
              ref="shortcutFileInput"
              type="file"
              accept=".json"
              class="hidden"
              @change="importShortcuts"
            />

            <Button size="sm" variant="destructive" @click="resetAllShortcuts">
              <Icon icon="mdi:restore" class="mr-2 h-4 w-4" />
              Reset All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Local Storage</CardTitle>
        <CardDescription>Manage your browser's local data</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Alert>
          <Icon icon="mdi:shield-check" class="h-4 w-4" />
          <AlertDescription>
            Omniflow stores all data locally in your browser. No data is sent to external servers.
          </AlertDescription>
        </Alert>
        <Button variant="outline" @click="viewStorageInfo">
          <Icon icon="mdi:information" class="mr-2 h-4 w-4" />
          View Storage Info
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
