<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()

const emit = defineEmits<{
  showFeedback: [message: string, type: 'success' | 'error' | 'info']
  updateSelectedTheme: [theme: string]
}>()

const props = defineProps<{
  themes: any[]
  selectedTheme: string
}>()

// Custom Theme Creator
const showCustomThemeDialog = ref(false)
const customThemeName = ref('')
const editingThemeValue = ref<string | null>(null)
const customThemeColors = ref({
  light: {
    primary: '#e84a77',
    background: '#fafafa',
    card: '#ffffff',
    accent: '#f86d8d',
  },
  dark: {
    primary: '#e84a77',
    background: '#0f172a',
    card: '#1e293b',
    accent: '#f86d8d',
  },
})

const systemThemes = computed(() => props.themes.filter((t) => !(t as any).isCustom))
const customThemes = computed(() => props.themes.filter((t) => (t as any).isCustom))

// Quick Access Themes
const quickAccessThemes = ref<string[]>([])

// Load quick access themes from localStorage on mount
const loadQuickAccessThemes = () => {
  const saved = localStorage.getItem('quickAccessThemes')
  if (saved) {
    try {
      quickAccessThemes.value = JSON.parse(saved)
    } catch (e) {
      // Default to first 6 system themes
      quickAccessThemes.value = systemThemes.value.slice(0, 6).map((t: any) => t.value)
    }
  } else {
    // Default to first 6 system themes
    quickAccessThemes.value = systemThemes.value.slice(0, 6).map((t: any) => t.value)
  }
}

loadQuickAccessThemes()

// Toggle theme in quick access
const toggleQuickAccess = (themeValue: string) => {
  const index = quickAccessThemes.value.indexOf(themeValue)
  if (index >= 0) {
    // Remove from quick access
    quickAccessThemes.value.splice(index, 1)
  } else {
    // Add to quick access
    if (quickAccessThemes.value.length < 6) {
      quickAccessThemes.value.push(themeValue)
    } else {
      emit('showFeedback', 'Maximum 6 themes allowed in quick access', 'error')
      return
    }
  }
  localStorage.setItem('quickAccessThemes', JSON.stringify(quickAccessThemes.value))

  // Dispatch custom event to notify Theming component
  window.dispatchEvent(new CustomEvent('quickAccessThemesUpdated'))

  emit('showFeedback', 'Quick access updated', 'success')
}

const isInQuickAccess = (themeValue: string) => quickAccessThemes.value.includes(themeValue)

function openCustomThemeCreator() {
  showCustomThemeDialog.value = true
  customThemeName.value = ''
  editingThemeValue.value = null
  customThemeColors.value = {
    light: {
      primary: '#e84a77',
      background: '#fafafa',
      card: '#ffffff',
      accent: '#f86d8d',
    },
    dark: {
      primary: '#e84a77',
      background: '#0f172a',
      card: '#1e293b',
      accent: '#f86d8d',
    },
  }
}

function editCustomTheme(theme: any) {
  showCustomThemeDialog.value = true
  customThemeName.value = theme.name
  editingThemeValue.value = theme.value
  customThemeColors.value = JSON.parse(JSON.stringify(theme.colors))
}

function saveCustomTheme() {
  if (!customThemeName.value.trim()) {
    emit('showFeedback', 'Please enter a theme name', 'error')
    return
  }

  const themeValue =
    editingThemeValue.value || customThemeName.value.toLowerCase().replace(/\s+/g, '-')

  const customTheme = {
    name: customThemeName.value,
    value: themeValue,
    description: 'Custom theme',
    colors: customThemeColors.value,
    isCustom: true,
  }

  // Load existing custom themes
  const savedThemes = localStorage.getItem('customThemes')
  const customThemesArray = savedThemes ? JSON.parse(savedThemes) : []

  // Check if theme name already exists (and not editing it)
  const existingIndex = customThemesArray.findIndex((t: any) => t.value === themeValue)
  if (existingIndex >= 0) {
    customThemesArray[existingIndex] = customTheme
  } else {
    customThemesArray.push(customTheme)
  }

  localStorage.setItem('customThemes', JSON.stringify(customThemesArray))

  // Apply CSS styles
  applyCustomThemeStyles(customTheme)

  // Close dialog
  showCustomThemeDialog.value = false
  editingThemeValue.value = null

  // Reload themes and apply
  window.location.reload()
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

function applyTheme(theme: string) {
  // Remove all theme classes
  const themeClasses = props.themes.map((t) => t.value).filter((v) => v !== 'default')
  document.documentElement.classList.remove(...themeClasses)

  // Add new theme class if not default
  if (theme !== 'default') {
    document.documentElement.classList.add(theme)
  }

  localStorage.setItem('app-theme', theme)
  emit('updateSelectedTheme', theme)

  const themeName = props.themes.find((t) => t.value === theme)?.name
  emit('showFeedback', `${themeName} theme applied!`, 'success')
}

function deleteCustomTheme(themeValue: string) {
  if (!confirm('Are you sure you want to delete this custom theme?')) return

  const savedThemes = localStorage.getItem('customThemes')
  if (savedThemes) {
    const customThemesArray = JSON.parse(savedThemes)
    const filtered = customThemesArray.filter((t: any) => t.value !== themeValue)
    localStorage.setItem('customThemes', JSON.stringify(filtered))

    // Remove style element
    const styleEl = document.getElementById(`custom-theme-${themeValue}`)
    if (styleEl) {
      styleEl.remove()
    }

    // If deleted theme was active, reset to default
    if (props.selectedTheme === themeValue) {
      applyTheme('default')
    }

    emit('showFeedback', 'Custom theme deleted', 'success')
    window.location.reload()
  }
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Dark Mode</CardTitle>
        <CardDescription>Toggle between light and dark appearance</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex gap-3">
          <Button
            :variant="mode === 'light' ? 'default' : 'outline'"
            @click="mode = 'light'"
            class="gap-2"
          >
            <Icon icon="fa6-solid:sun" class="h-4 w-4" />
            Light
          </Button>
          <Button
            :variant="mode === 'dark' ? 'default' : 'outline'"
            @click="mode = 'dark'"
            class="gap-2"
          >
            <Icon icon="fa6-solid:moon" class="h-4 w-4" />
            Dark
          </Button>
          <Button
            :variant="mode === 'auto' ? 'default' : 'outline'"
            @click="mode = 'auto'"
            class="gap-2"
          >
            <Icon icon="mdi:laptop" class="h-4 w-4" />
            System
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Color Theme</CardTitle>
            <CardDescription
              >Choose your preferred color scheme. Select up to 6 themes for quick access in the
              toolbar.</CardDescription
            >
          </div>
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="gap-1">
              <Icon icon="mdi:star" class="h-3 w-3" />
              {{ quickAccessThemes.length }}/6 Quick Access
            </Badge>
            <Button @click="openCustomThemeCreator" variant="outline" size="sm">
              <Icon icon="mdi:plus" class="mr-2 h-4 w-4" />
              Create Custom
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- System Themes -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon icon="mdi:palette-swatch" class="text-muted-foreground h-5 w-5" />
            <h3 class="text-sm font-semibold">System Themes</h3>
          </div>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="theme in systemThemes"
              :key="theme.value"
              @click="applyTheme(theme.value)"
              class="group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all hover:scale-[1.02]"
              :class="selectedTheme === theme.value ? 'border-primary' : ''"
            >
              <!-- Preview - Light Mode -->
              <div
                v-if="mode === 'light' || mode === 'auto'"
                class="aspect-video p-4"
                :style="{ backgroundColor: theme.colors.light.background }"
              >
                <div class="mb-2 flex items-center justify-between">
                  <div class="flex gap-1.5">
                    <div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <Badge variant="secondary" class="px-1.5 py-0.5 text-[9px]">Light</Badge>
                </div>
                <div class="space-y-1.5">
                  <div
                    class="h-2.5 w-3/4 rounded"
                    :style="{ backgroundColor: theme.colors.light.primary }"
                  ></div>
                  <div
                    class="h-6 w-full rounded shadow-sm"
                    :style="{ backgroundColor: theme.colors.light.card }"
                  ></div>
                  <div class="flex gap-1.5">
                    <div
                      class="h-10 flex-1 rounded shadow-sm"
                      :style="{ backgroundColor: theme.colors.light.card }"
                    ></div>
                    <div
                      class="h-10 w-10 rounded shadow-sm"
                      :style="{ backgroundColor: theme.colors.light.accent }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Preview - Dark Mode -->
              <div
                v-if="mode === 'dark'"
                class="aspect-video p-4"
                :style="{ backgroundColor: theme.colors.dark.background }"
              >
                <div class="mb-2 flex items-center justify-between">
                  <div class="flex gap-1.5">
                    <div class="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></div>
                    <div class="h-2.5 w-2.5 rounded-full bg-green-500/80"></div>
                  </div>
                  <Badge variant="secondary" class="bg-white/10 px-1.5 py-0.5 text-[9px] text-white"
                    >Dark</Badge
                  >
                </div>
                <div class="space-y-1.5">
                  <div
                    class="h-2.5 w-3/4 rounded"
                    :style="{ backgroundColor: theme.colors.dark.primary }"
                  ></div>
                  <div
                    class="h-6 w-full rounded shadow-sm"
                    :style="{ backgroundColor: theme.colors.dark.card }"
                  ></div>
                  <div class="flex gap-1.5">
                    <div
                      class="h-10 flex-1 rounded shadow-sm"
                      :style="{ backgroundColor: theme.colors.dark.card }"
                    ></div>
                    <div
                      class="h-10 w-10 rounded shadow-sm"
                      :style="{ backgroundColor: theme.colors.dark.accent }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Theme Info -->
              <div class="border-border bg-card border-t p-3">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="font-semibold">{{ theme.name }}</p>
                    <p class="text-muted-foreground text-xs">{{ theme.description }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8"
                      @click.stop="toggleQuickAccess(theme.value)"
                      :title="
                        isInQuickAccess(theme.value)
                          ? 'Remove from quick access'
                          : 'Add to quick access'
                      "
                    >
                      <Icon
                        :icon="isInQuickAccess(theme.value) ? 'mdi:star' : 'mdi:star-outline'"
                        :class="[
                          'h-5 w-5 transition-colors',
                          isInQuickAccess(theme.value)
                            ? 'text-amber-500'
                            : 'text-muted-foreground hover:text-amber-500',
                        ]"
                      />
                    </Button>
                    <Icon
                      v-if="selectedTheme === theme.value"
                      icon="mdi:check-circle"
                      class="text-primary h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Themes -->
        <div v-if="customThemes.length > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:palette-advanced" class="text-muted-foreground h-5 w-5" />
              <h3 class="text-sm font-semibold">Custom Themes</h3>
              <Badge variant="secondary" class="text-xs">{{ customThemes.length }}</Badge>
            </div>
          </div>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="theme in customThemes"
              :key="theme.value"
              class="group relative overflow-hidden rounded-lg border-2 transition-all"
              :class="
                selectedTheme === theme.value
                  ? 'border-primary ring-primary ring-2 ring-offset-2'
                  : 'border-border'
              "
            >
              <div @click="applyTheme(theme.value)" class="cursor-pointer">
                <!-- Preview - Light Mode -->
                <div
                  v-if="mode === 'light' || mode === 'auto'"
                  class="aspect-video p-4"
                  :style="{ backgroundColor: theme.colors.light.background }"
                >
                  <div class="mb-2 flex items-center justify-between">
                    <div class="flex gap-1.5">
                      <div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                      <div class="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                      <div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <Badge variant="secondary" class="px-1.5 py-0.5 text-[9px]">Light</Badge>
                  </div>
                  <div class="space-y-1.5">
                    <div
                      class="h-2.5 w-3/4 rounded"
                      :style="{ backgroundColor: theme.colors.light.primary }"
                    ></div>
                    <div
                      class="h-6 w-full rounded shadow-sm"
                      :style="{ backgroundColor: theme.colors.light.card }"
                    ></div>
                    <div class="flex gap-1.5">
                      <div
                        class="h-10 flex-1 rounded shadow-sm"
                        :style="{ backgroundColor: theme.colors.light.card }"
                      ></div>
                      <div
                        class="h-10 w-10 rounded shadow-sm"
                        :style="{ backgroundColor: theme.colors.light.accent }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Preview - Dark Mode -->
                <div
                  v-if="mode === 'dark'"
                  class="aspect-video p-4"
                  :style="{ backgroundColor: theme.colors.dark.background }"
                >
                  <div class="mb-2 flex items-center justify-between">
                    <div class="flex gap-1.5">
                      <div class="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
                      <div class="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></div>
                      <div class="h-2.5 w-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <Badge
                      variant="secondary"
                      class="bg-white/10 px-1.5 py-0.5 text-[9px] text-white"
                      >Dark</Badge
                    >
                  </div>
                  <div class="space-y-1.5">
                    <div
                      class="h-2.5 w-3/4 rounded"
                      :style="{ backgroundColor: theme.colors.dark.primary }"
                    ></div>
                    <div
                      class="h-6 w-full rounded shadow-sm"
                      :style="{ backgroundColor: theme.colors.dark.card }"
                    ></div>
                    <div class="flex gap-1.5">
                      <div
                        class="h-10 flex-1 rounded shadow-sm"
                        :style="{ backgroundColor: theme.colors.dark.card }"
                      ></div>
                      <div
                        class="h-10 w-10 rounded shadow-sm"
                        :style="{ backgroundColor: theme.colors.dark.accent }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Theme Info -->
              <div class="border-border bg-card border-t p-3">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <p class="font-semibold">{{ theme.name }}</p>
                    </div>
                    <p class="text-muted-foreground text-xs">{{ theme.description }}</p>
                  </div>
                  <div class="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8"
                      @click.stop="toggleQuickAccess(theme.value)"
                      :title="
                        isInQuickAccess(theme.value)
                          ? 'Remove from quick access'
                          : 'Add to quick access'
                      "
                    >
                      <Icon
                        :icon="isInQuickAccess(theme.value) ? 'mdi:star' : 'mdi:star-outline'"
                        :class="[
                          'h-5 w-5 transition-colors',
                          isInQuickAccess(theme.value)
                            ? 'text-amber-500'
                            : 'text-muted-foreground hover:text-amber-500',
                        ]"
                      />
                    </Button>
                    <Icon
                      v-if="selectedTheme === theme.value"
                      icon="mdi:check-circle"
                      class="text-primary h-5 w-5"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8"
                      @click.stop="editCustomTheme(theme)"
                    >
                      <Icon
                        icon="mdi:pencil"
                        class="text-muted-foreground h-4 w-4 transition-colors hover:text-blue-500"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8"
                      @click.stop="deleteCustomTheme(theme.value)"
                    >
                      <Icon
                        icon="mdi:delete"
                        class="text-muted-foreground h-4 w-4 transition-colors hover:text-red-500"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Custom Theme Creator Dialog -->
    <Dialog v-model:open="showCustomThemeDialog">
      <DialogContent class="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-2xl">
            {{ editingThemeValue ? 'Edit Custom Theme' : 'Create Custom Theme' }}
          </DialogTitle>
          <DialogDescription> Design your own color theme with live preview </DialogDescription>
        </DialogHeader>

        <div class="space-y-6 py-4">
          <!-- Theme Name -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:tag" class="text-muted-foreground h-5 w-5" />
              <Label for="theme-name" class="text-base font-semibold">Theme Name</Label>
            </div>
            <Input
              id="theme-name"
              v-model="customThemeName"
              placeholder="My Awesome Theme"
              class="h-11 text-base"
            />
          </div>

          <Separator />

          <!-- Preview Section -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:eye" class="text-muted-foreground h-5 w-5" />
              <Label class="text-base font-semibold">Live Preview</Label>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <!-- Light Preview -->
              <div class="space-y-2">
                <p class="text-muted-foreground text-xs font-medium">Light Mode</p>
                <div
                  class="border-border aspect-video rounded-xl border-2 p-4 shadow-lg transition-all"
                  :style="{ backgroundColor: customThemeColors.light.background }"
                >
                  <div class="mb-3 flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500 shadow-sm"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500 shadow-sm"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500 shadow-sm"></div>
                  </div>
                  <div class="space-y-2">
                    <div
                      class="h-3 w-3/4 rounded-md shadow-sm"
                      :style="{ backgroundColor: customThemeColors.light.primary }"
                    ></div>
                    <div
                      class="h-8 w-full rounded-lg shadow-md"
                      :style="{ backgroundColor: customThemeColors.light.card }"
                    ></div>
                    <div class="flex gap-2">
                      <div
                        class="h-12 flex-1 rounded-lg shadow-md"
                        :style="{ backgroundColor: customThemeColors.light.card }"
                      ></div>
                      <div
                        class="h-12 w-12 rounded-lg shadow-md"
                        :style="{ backgroundColor: customThemeColors.light.accent }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Dark Preview -->
              <div class="space-y-2">
                <p class="text-muted-foreground text-xs font-medium">Dark Mode</p>
                <div
                  class="border-border aspect-video rounded-xl border-2 p-4 shadow-lg transition-all"
                  :style="{ backgroundColor: customThemeColors.dark.background }"
                >
                  <div class="mb-3 flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/80 shadow-sm"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/80 shadow-sm"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500/80 shadow-sm"></div>
                  </div>
                  <div class="space-y-2">
                    <div
                      class="h-3 w-3/4 rounded-md shadow-sm"
                      :style="{ backgroundColor: customThemeColors.dark.primary }"
                    ></div>
                    <div
                      class="h-8 w-full rounded-lg shadow-md"
                      :style="{ backgroundColor: customThemeColors.dark.card }"
                    ></div>
                    <div class="flex gap-2">
                      <div
                        class="h-12 flex-1 rounded-lg shadow-md"
                        :style="{ backgroundColor: customThemeColors.dark.card }"
                      ></div>
                      <div
                        class="h-12 w-12 rounded-lg shadow-md"
                        :style="{ backgroundColor: customThemeColors.dark.accent }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Light Mode Colors -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <Icon icon="fa6-solid:sun" class="text-muted-foreground h-5 w-5" />
              <h3 class="text-muted-foreground text-base font-semibold">Light Mode Colors</h3>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="light-primary" class="text-sm font-medium">Primary Color</Label>
                <div class="flex gap-2">
                  <Input
                    id="light-primary"
                    type="color"
                    v-model="customThemeColors.light.primary"
                    class="h-11 w-16 cursor-pointer"
                  />
                  <Input
                    v-model="customThemeColors.light.primary"
                    placeholder="#e84a77"
                    class="h-11 flex-1 font-mono"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="light-accent" class="text-sm font-medium">Accent Color</Label>
                <div class="flex gap-2">
                  <Input
                    id="light-accent"
                    type="color"
                    v-model="customThemeColors.light.accent"
                    class="h-11 w-16 cursor-pointer"
                  />
                  <Input
                    v-model="customThemeColors.light.accent"
                    placeholder="#f86d8d"
                    class="h-11 flex-1 font-mono"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="light-background" class="text-sm font-medium">Background Color</Label>
                <div class="flex gap-2">
                  <Input
                    id="light-background"
                    type="color"
                    v-model="customThemeColors.light.background"
                    class="h-11 w-16 cursor-pointer"
                  />
                  <Input
                    v-model="customThemeColors.light.background"
                    placeholder="#fafafa"
                    class="h-11 flex-1 font-mono"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="light-card" class="text-sm font-medium">Card Color</Label>
                <div class="flex gap-2">
                  <Input
                    id="light-card"
                    type="color"
                    v-model="customThemeColors.light.card"
                    class="h-11 w-16 cursor-pointer"
                  />
                  <Input
                    v-model="customThemeColors.light.card"
                    placeholder="#ffffff"
                    class="h-11 flex-1 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Dark Mode Colors -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <Icon icon="fa6-solid:moon" class="text-muted-foreground h-5 w-5" />
              <h3 class="text-muted-foreground text-base font-semibold">Dark Mode Colors</h3>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="dark-primary" class="text-sm font-medium">Primary Color</Label>
                <div class="flex gap-2">
                  <Input
                    id="dark-primary"
                    type="color"
                    v-model="customThemeColors.dark.primary"
                    class="h-11 w-16 cursor-pointer"
                  />
                  <Input
                    v-model="customThemeColors.dark.primary"
                    placeholder="#e84a77"
                    class="h-11 flex-1 font-mono"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="dark-accent" class="text-sm font-medium">Accent Color</Label>
                <div class="flex gap-2">
                  <Input
                    id="dark-accent"
                    type="color"
                    v-model="customThemeColors.dark.accent"
                    class="h-11 w-16 cursor-pointer"
                  />
                  <Input
                    v-model="customThemeColors.dark.accent"
                    placeholder="#f86d8d"
                    class="h-11 flex-1 font-mono"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="dark-background" class="text-sm font-medium">Background Color</Label>
                <div class="flex gap-2">
                  <Input
                    id="dark-background"
                    type="color"
                    v-model="customThemeColors.dark.background"
                    class="h-11 w-16 cursor-pointer"
                  />
                  <Input
                    v-model="customThemeColors.dark.background"
                    placeholder="#0f172a"
                    class="h-11 flex-1 font-mono"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="dark-card" class="text-sm font-medium">Card Color</Label>
                <div class="flex gap-2">
                  <Input
                    id="dark-card"
                    type="color"
                    v-model="customThemeColors.dark.card"
                    class="h-11 w-16 cursor-pointer"
                  />
                  <Input
                    v-model="customThemeColors.dark.card"
                    placeholder="#1e293b"
                    class="h-11 flex-1 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="gap-2">
          <Button variant="outline" @click="showCustomThemeDialog = false">Cancel</Button>
          <Button @click="saveCustomTheme" class="gap-2">
            <Icon icon="mdi:content-save" class="h-4 w-4" />
            {{ editingThemeValue ? 'Update Theme' : 'Save Theme' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
