<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Icon } from '@iconify/vue'
import { useKeyboardShortcuts } from '@/services/keyboardService'
import { getCategories } from '@/data/tools/_index'
import type { Category } from '@/types/Category'

const favoriteCards = inject<any>('favoriteCards')

const emit = defineEmits<{
  showFeedback: [message: string, type: 'success' | 'error' | 'info']
}>()

// Keyboard Shortcuts
const { shortcuts, loadShortcuts, updateShortcut, resetToDefaults, getShortcutDisplay } =
  useKeyboardShortcuts()

const showEditShortcutDialog = ref(false)
const editingShortcut = ref<any>(null)
const newShortcut = ref({ key: '', ctrl: false, shift: false, alt: false })
const isCapturingKey = ref(false)
const showSplashScreen = ref(true)
let captureKeyHandler: ((event: KeyboardEvent) => void) | null = null

onMounted(() => {
  loadShortcuts()

  // Listen for shortcut updates
  window.addEventListener('shortcutsUpdated', loadShortcuts)
})

const categoriesData: Category[] = getCategories()

const totalToolsCount = computed(() => {
  return categoriesData.reduce((acc, cat) => {
    const activeCards = cat.cards.filter((card) => card.isActive) // only count active cards
    return acc + activeCards.length
  }, 0)
})

function openEditShortcut(shortcut: any) {
  editingShortcut.value = shortcut
  newShortcut.value = {
    key: shortcut.key,
    ctrl: shortcut.ctrl,
    shift: shortcut.shift,
    alt: shortcut.alt,
  }
  isCapturingKey.value = false
  showEditShortcutDialog.value = true
}

function startCapturingKey() {
  isCapturingKey.value = true
  newShortcut.value.key = 'Press a key...'

  // Add document-level key listener
  if (captureKeyHandler) {
    document.removeEventListener('keydown', captureKeyHandler)
  }

  captureKeyHandler = (event: KeyboardEvent) => {
    if (!isCapturingKey.value) {
      if (captureKeyHandler) {
        document.removeEventListener('keydown', captureKeyHandler)
        captureKeyHandler = null
      }
      return
    }

    event.preventDefault()
    event.stopPropagation()
    const key = event.key.toLowerCase()

    // Ignore modifier keys alone
    if (['control', 'shift', 'alt', 'meta'].includes(key)) return

    newShortcut.value = {
      key: key,
      ctrl: event.ctrlKey || event.metaKey,
      shift: event.shiftKey,
      alt: event.altKey,
    }
    isCapturingKey.value = false

    // Remove listener after capturing
    document.removeEventListener('keydown', captureKeyHandler!)
    captureKeyHandler = null
  }

  document.addEventListener('keydown', captureKeyHandler, true)
}

function saveShortcut() {
  if (
    !editingShortcut.value ||
    !newShortcut.value.key ||
    newShortcut.value.key === 'Press a key...'
  ) {
    emit('showFeedback', 'Please capture a valid key', 'error')
    return
  }

  updateShortcut(
    editingShortcut.value.id,
    newShortcut.value.key,
    newShortcut.value.ctrl,
    newShortcut.value.shift,
    newShortcut.value.alt,
  )
  showEditShortcutDialog.value = false
  emit('showFeedback', 'Shortcut updated successfully!', 'success')
}

function resetShortcuts() {
  if (confirm('Are you sure you want to reset all shortcuts to default?')) {
    resetToDefaults()
    emit('showFeedback', 'Shortcuts reset to default', 'success')
  }
}

const favoriteCount = computed(() => favoriteCards?.value?.length || 0)
const favoritesForShortcuts = computed(() => {
  return (favoriteCards?.value || []).slice(0, 9)
})

onMounted(() => {
  const savedWelcomePreference = localStorage.getItem('showSplashScreen')
  showSplashScreen.value = savedWelcomePreference !== 'false'
})

function toggleSplashScreen(value: boolean) {
  showSplashScreen.value = value
  localStorage.setItem('showSplashScreen', value.toString())
  emit('showFeedback', `Welcome screen ${value ? 'enabled' : 'disabled'}`, 'success')
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>About Omniflow</CardTitle>
        <CardDescription>Application information and version details</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-4">
          <Icon icon="octicon:stack-24" class="text-foreground h-16 w-16" />
          <div>
            <h3 class="text-xl font-semibold">Omniflow</h3>
            <p class="text-muted-foreground text-sm">All-in-One Tool Suite</p>
            <Badge variant="secondary" class="mt-2">Version 1.0.0</Badge>
          </div>
        </div>
        <Separator />
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Total Favorites:</span>
            <span class="font-medium">{{ favoriteCount }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Total Tools:</span>
            <span class="font-medium">{{ totalToolsCount }}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Welcome Screen</CardTitle>
        <CardDescription>Configure the startup animation</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label class="text-base">Show Welcome Animation</Label>
            <p class="text-muted-foreground text-sm">
              Display the animated welcome screen when opening the app
            </p>
          </div>
          <Switch
            :checked="showSplashScreen"
            @update:checked="toggleSplashScreen"
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Keyboard Shortcuts</CardTitle>
            <CardDescription>Customize keyboard shortcuts for quick actions</CardDescription>
          </div>
          <Button variant="outline" size="sm" @click="resetShortcuts">
            <Icon icon="mdi:restore" class="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="shortcut in shortcuts"
            :key="shortcut.id"
            class="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <div class="flex-1">
              <p class="font-medium">{{ shortcut.name }}</p>
              <p class="text-muted-foreground text-sm">{{ shortcut.description }}</p>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="secondary" class="font-mono">
                {{ getShortcutDisplay(shortcut) }}
              </Badge>
              <Button variant="ghost" size="icon" @click="openEditShortcut(shortcut)">
                <Icon icon="mdi:pencil" class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator class="my-4" />

          <!-- Favorite App Shortcuts -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:star" class="h-5 w-5 text-amber-500" />
              <h4 class="font-semibold">Favorite App Shortcuts</h4>
              <Badge variant="outline" class="text-xs">Ctrl + 1-9</Badge>
            </div>
            <p class="text-muted-foreground text-sm">
              Your first 9 favorite apps can be accessed using Ctrl+1 through Ctrl+9
            </p>
            <div v-if="favoritesForShortcuts.length > 0" class="mt-3 space-y-2">
              <div
                v-for="(fav, index) in favoritesForShortcuts"
                :key="index"
                class="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <Icon :icon="fav.card.icon" class="h-4 w-4" />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium">{{ fav.card.title }}</span>
                    <span class="text-muted-foreground text-xs">{{ fav.category.title }}</span>
                  </div>
                </div>
                <Badge variant="secondary" class="font-mono">Ctrl + {{ index + 1 }}</Badge>
              </div>
            </div>
            <div v-else class="bg-muted/30 rounded-lg p-4 text-center">
              <Icon icon="mdi:star-off" class="text-muted-foreground mx-auto mb-2 h-8 w-8" />
              <p class="text-muted-foreground text-sm">
                No favorites yet. Add apps to favorites to use quick shortcuts!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Edit Shortcut Dialog -->
    <Dialog v-model:open="showEditShortcutDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Keyboard Shortcut</DialogTitle>
          <DialogDescription>
            {{ editingShortcut?.name }} - {{ editingShortcut?.description }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label>Current Shortcut</Label>
            <Badge variant="secondary" class="font-mono text-base">
              {{ editingShortcut ? getShortcutDisplay(editingShortcut) : '' }}
            </Badge>
          </div>

          <Separator />

          <div class="space-y-3">
            <Label>New Shortcut</Label>
            <Button
              :variant="isCapturingKey ? 'default' : 'outline'"
              class="w-full justify-start font-mono transition-all"
              :class="{ 'bg-primary/50 animate-pulse': isCapturingKey }"
              @click="startCapturingKey"
            >
              <Icon v-if="!isCapturingKey" icon="mdi:keyboard" class="mr-2 h-4 w-4" />
              <Icon v-else icon="mdi:keyboard-outline" class="mr-2 h-4 w-4 animate-pulse" />
              {{
                isCapturingKey
                  ? 'Press any key combination...'
                  : newShortcut.key || 'Click to capture key'
              }}
            </Button>
            <p class="text-muted-foreground text-xs">
              <Icon
                v-if="isCapturingKey"
                icon="mdi:information"
                class="text-primary mr-1 inline h-3 w-3 animate-pulse"
              />
              {{
                isCapturingKey
                  ? 'Recording... Press your desired key combination now'
                  : 'Click the button above and press your desired key combination (including modifiers)'
              }}
            </p>
          </div>

          <div
            v-if="newShortcut.key && newShortcut.key !== 'Press a key...'"
            class="bg-muted rounded-lg p-3"
          >
            <p class="text-sm font-medium">Preview:</p>
            <Badge variant="secondary" class="mt-2 font-mono text-base">
              {{ getShortcutDisplay(newShortcut) }}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showEditShortcutDialog = false">Cancel</Button>
          <Button @click="saveShortcut">Save Shortcut</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
