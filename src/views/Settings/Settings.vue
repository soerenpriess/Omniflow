<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Icon } from '@iconify/vue'
import GeneralSettings from './views/GeneralSettings.vue'
import AppearanceSettings from './views/AppearanceSettings.vue'
import DataSettings from './views/DataSettings.vue'

const activeTab = ref('general')
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error' | 'info'>('success')

function showFeedback(message: string, type: 'success' | 'error' | 'info' = 'success') {
  feedbackMessage.value = message
  feedbackType.value = type
  setTimeout(() => {
    feedbackMessage.value = ''
  }, 3000)
}

// Theme configurations with light and dark colors
const themes = [
  {
    name: 'Default Pink',
    value: 'default',
    description: 'Original Omniflow theme',
    colors: {
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
    },
  },
  {
    name: 'Ocean Blue',
    value: 'ocean',
    description: 'Calm and professional',
    colors: {
      light: {
        primary: '#3b82f6',
        background: '#f8fafc',
        card: '#ffffff',
        accent: '#0ea5e9',
      },
      dark: {
        primary: '#3b82f6',
        background: '#0f172a',
        card: '#1e293b',
        accent: '#0ea5e9',
      },
    },
  },
  {
    name: 'Forest Green',
    value: 'forest',
    description: 'Natural and refreshing',
    colors: {
      light: {
        primary: '#10b981',
        background: '#fafaf9',
        card: '#ffffff',
        accent: '#059669',
      },
      dark: {
        primary: '#10b981',
        background: '#1c1917',
        card: '#292524',
        accent: '#059669',
      },
    },
  },
  {
    name: 'Sunset Orange',
    value: 'sunset',
    description: 'Warm and energetic',
    colors: {
      light: {
        primary: '#f59e0b',
        background: '#fefcfb',
        card: '#ffffff',
        accent: '#ea580c',
      },
      dark: {
        primary: '#f59e0b',
        background: '#1c1917',
        card: '#292524',
        accent: '#ea580c',
      },
    },
  },
  {
    name: 'Purple Dream',
    value: 'purple',
    description: 'Creative and elegant',
    colors: {
      light: {
        primary: '#8b5cf6',
        background: '#faf5ff',
        card: '#ffffff',
        accent: '#7c3aed',
      },
      dark: {
        primary: '#8b5cf6',
        background: '#1e1b4b',
        card: '#312e81',
        accent: '#7c3aed',
      },
    },
  },
  {
    name: 'Rose Garden',
    value: 'rose',
    description: 'Soft and sophisticated',
    colors: {
      light: {
        primary: '#fb7185',
        background: '#fef2f2',
        card: '#ffffff',
        accent: '#f43f5e',
      },
      dark: {
        primary: '#fb7185',
        background: '#1f2937',
        card: '#374151',
        accent: '#f43f5e',
      },
    },
    isCustom: false,
  },
]

const selectedTheme = ref('default')

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

function loadCustomThemes() {
  const savedThemes = localStorage.getItem('customThemes')
  if (savedThemes) {
    const customThemes = JSON.parse(savedThemes)
    const baseThemes = themes.filter((t) => !(t as any).isCustom)
    themes.length = 0
    themes.push(...baseThemes, ...customThemes)

    customThemes.forEach((theme: any) => {
      applyCustomThemeStyles(theme)
    })
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme') || 'default'
  selectedTheme.value = savedTheme

  if (savedTheme !== 'default') {
    document.documentElement.classList.add(savedTheme)
  }

  loadCustomThemes()
})
</script>

<template>
  <div class="bg-background flex h-full flex-col overflow-hidden">
    <!-- Feedback Alert -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform opacity-0 translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-2"
    >
      <Alert
        v-if="feedbackMessage"
        class="fixed top-4 right-4 z-50 w-96"
        :class="{
          'border-green-500 bg-green-500': feedbackType === 'success',
          'border-red-500 bg-red-500': feedbackType === 'error',
          'border-blue-500 bg-blue-500': feedbackType === 'info',
        }"
      >
        <Icon
          :icon="
            feedbackType === 'success'
              ? 'mdi:check-circle'
              : feedbackType === 'error'
                ? 'mdi:alert-circle'
                : 'mdi:information'
          "
          class="h-4 w-4"
        />
        <AlertDescription class="text-white">{{ feedbackMessage }}</AlertDescription>
      </Alert>
    </transition>

    <!-- Header -->
    <div class="bg-card/50 flex-shrink-0 border-b backdrop-blur-sm">
      <div class="flex items-center gap-4 px-6 py-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Settings</h1>
          <p class="text-muted-foreground text-sm">
            Manage your preferences and customize your experience
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex min-h-0 flex-1 flex-col">
      <Tabs v-model="activeTab" class="flex h-full flex-col">
        <!-- Tab List -->
        <div class="bg-card/95 flex-shrink-0 border-b px-6 backdrop-blur-sm">
          <TabsList class="inline-flex h-auto bg-transparent p-1">
            <TabsTrigger value="general" class="gap-2">
              <Icon icon="mdi:information-outline" class="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" class="gap-2">
              <Icon icon="mdi:palette-outline" class="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="data" class="gap-2">
              <Icon icon="mdi:database-outline" class="h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>
        </div>

        <!-- Tab Contents -->
        <div class="flex-1 overflow-y-auto">
          <div class="mx-auto max-w-4xl p-6">
            <!-- General Tab -->
            <TabsContent value="general" class="m-0">
              <GeneralSettings @show-feedback="showFeedback" />
            </TabsContent>

            <!-- Appearance Tab -->
            <TabsContent value="appearance" class="m-0">
              <AppearanceSettings
                :themes="themes"
                :selected-theme="selectedTheme"
                @show-feedback="showFeedback"
                @update-selected-theme="selectedTheme = $event"
              />
            </TabsContent>

            <!-- Data Tab -->
            <TabsContent value="data" class="m-0">
              <DataSettings @show-feedback="showFeedback" />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  </div>
</template>
