<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mode = useColorMode()
const theme = ref<string>('default')

// All available themes (system themes)
const allThemes = [
  { value: 'default', label: 'Default Pink', icon: 'mdi:palette', color: '#e84a77' },
  { value: 'ocean', label: 'Ocean Blue', icon: 'mdi:waves', color: '#0ea5e9' },
  { value: 'forest', label: 'Forest Green', icon: 'mdi:tree', color: '#22c55e' },
  { value: 'sunset', label: 'Sunset Orange', icon: 'mdi:white-balance-sunny', color: '#f97316' },
  { value: 'purple', label: 'Purple Dream', icon: 'mdi:star-four-points', color: '#a855f7' },
  { value: 'rose', label: 'Rose Garden', icon: 'mdi:flower', color: '#f43f5e' },
]

// Custom themes from localStorage
const customThemes = ref<any[]>([])

// Quick access theme values (max 6)
const quickAccessThemeValues = ref<string[]>([])

// Combined theme definitions (filtered by quick access)
const themes = computed(() => {
  // Load all available themes (system + custom)
  const availableThemes = [
    ...allThemes,
    ...customThemes.value.map((customTheme) => ({
      value: customTheme.value,
      label: customTheme.name,
      icon: 'mdi:palette-advanced',
      color: customTheme.colors.light.primary,
    })),
  ]

  // Filter by quick access selection
  return availableThemes.filter((t) => quickAccessThemeValues.value.includes(t.value))
})

// Load custom themes and quick access selection from localStorage
const loadThemes = () => {
  const savedCustomThemes = localStorage.getItem('customThemes')
  if (savedCustomThemes) {
    try {
      customThemes.value = JSON.parse(savedCustomThemes)
    } catch (e) {
      customThemes.value = []
    }
  }

  // Load quick access themes
  const savedQuickAccess = localStorage.getItem('quickAccessThemes')
  if (savedQuickAccess) {
    try {
      quickAccessThemeValues.value = JSON.parse(savedQuickAccess)
    } catch (e) {
      // Default to first 6 system themes
      quickAccessThemeValues.value = allThemes.slice(0, 6).map((t) => t.value)
    }
  } else {
    // Default to first 6 system themes
    quickAccessThemeValues.value = allThemes.slice(0, 6).map((t) => t.value)
  }

  // Load active theme
  const savedTheme = localStorage.getItem('app-theme')
  if (savedTheme) {
    theme.value = savedTheme
  }
}

onMounted(() => {
  loadThemes()

  // Listen for custom storage events
  window.addEventListener('quickAccessThemesUpdated', loadThemes)

  // Listen for storage events
  window.addEventListener('storage', (e) => {
    if (e.key === 'quickAccessThemes' || e.key === 'customThemes') {
      loadThemes()
    }
  })
})

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener('quickAccessThemesUpdated', loadThemes)
  window.removeEventListener('storage', loadThemes)
})

const setTheme = (newTheme: string) => {
  theme.value = newTheme

  // Get all theme values to remove
  const allThemeValues = [
    ...allThemes.map((theme) => theme.value),
    ...customThemes.value.map((customTheme: any) => customTheme.value),
  ].filter((v) => v !== 'default')

  // Remove all theme classes
  document.documentElement.classList.remove(...allThemeValues)

  // Add new theme class if not default
  if (newTheme !== 'default') {
    document.documentElement.classList.add(newTheme)
  }

  // Save to localStorage
  localStorage.setItem('app-theme', newTheme)
}
</script>

<template>
  <div>
    <!-- Combined Appearance Menu -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="gap-2">
          <Icon
            icon="fa6-solid:sun"
            class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
          />
          <Icon
            icon="fa6-solid:moon"
            class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
          />
          <span class="sr-only">Toggle appearance</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <!-- Light/Dark Mode Section -->
        <DropdownMenuItem @click="mode = 'light'" class="gap-2">
          <Icon icon="fa6-solid:sun" class="h-4 w-4" />
          <span>Light</span>
          <Icon v-if="mode === 'light'" icon="mdi:check" class="text-primary ml-auto h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem @click="mode = 'dark'" class="gap-2">
          <Icon icon="fa6-solid:moon" class="h-4 w-4" />
          <span>Dark</span>
          <Icon v-if="mode === 'dark'" icon="mdi:check" class="text-primary ml-auto h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem @click="mode = 'auto'" class="gap-2">
          <Icon icon="mdi:laptop" class="h-4 w-4" />
          <span>System</span>
          <Icon v-if="mode === 'auto'" icon="mdi:check" class="text-primary ml-auto h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <!-- Theme Options -->
        <DropdownMenuItem
          v-for="themeOption in themes"
          :key="themeOption.value"
          @click="setTheme(themeOption.value)"
          class="gap-3"
        >
          <div
            class="h-4 w-4 rounded-full border-2 border-gray-300"
            :style="{ backgroundColor: themeOption.color }"
          ></div>
          <Icon :icon="themeOption.icon" class="h-4 w-4" />
          <span>{{ themeOption.label }}</span>
          <Icon
            v-if="theme === themeOption.value && quickAccessThemeValues.includes(themeOption.value)"
            icon="mdi:check"
            class="text-primary ml-auto h-4 w-4"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
