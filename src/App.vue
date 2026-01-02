<script setup lang="ts">
import Sidebar from '@/components/layout/sidebar/Sidebar.vue'
import TopBar from '@/components/layout/topbar/TopBar.vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { ref, watch, provide, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'
import { keyboardService } from '@/services/keyboardService'
import RouteTransitionWrapper from '@/components/RouteTransitionWrapper.vue'
import ToolViewHeader from '@/components/layout/mainContent/toolView/ToolViewHeader.vue'
import SplashScreen from './SplashScreen.vue'

const route = useRoute()
const router = useRouter()
const mode = useColorMode()
const transitionRef = ref<InstanceType<typeof RouteTransitionWrapper>>()
const showSplashScreen = ref(true)
const favoriteCards = ref<any[]>([])
const favoriteCardsUpdated = ref(false)

provide('favoriteCards', favoriteCards)
provide('favoriteCardsUpdated', favoriteCardsUpdated)
provide('toggleFavorite', (card: any, category: any) => {
  const i = favoriteCards.value.findIndex((favCard: any) => favCard.card.title === card.title)
  if (i > -1) {
    favoriteCards.value.splice(i, 1)
  } else {
    favoriteCards.value.push({ card, category })
  }
  favoriteCardsUpdated.value = !favoriteCardsUpdated.value
})

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
    customThemes.forEach((theme: any) => {
      applyCustomThemeStyles(theme)
    })
  }
}

onMounted(() => {
  const saved = localStorage.getItem('favoriteCards')
  if (saved) favoriteCards.value = JSON.parse(saved)

  const savedTheme = localStorage.getItem('app-theme') || 'default'

  if (savedTheme !== 'default') {
    document.documentElement.classList.add(savedTheme)
  }

  loadCustomThemes()

  const showSplashScreenPreference = localStorage.getItem('showSplashScreen')
  const hasSeenWelcomeThisSession = sessionStorage.getItem('hasSeenWelcome')

  if (showSplashScreenPreference === 'false' || hasSeenWelcomeThisSession === 'true') {
    showSplashScreen.value = false
  }

  keyboardService.setRouter(router)
  keyboardService.setColorMode(mode)
  keyboardService.startListening()
})

function handleWelcomeComplete() {
  showSplashScreen.value = false
  sessionStorage.setItem('hasSeenWelcome', 'true')
}

onUnmounted(() => {
  keyboardService.stopListening()
})

watch(
  favoriteCards,
  (newVal) => {
    localStorage.setItem('favoriteCards', JSON.stringify(newVal))
  },
  { deep: true },
)
</script>

<template>
  <SplashScreen v-if="showSplashScreen" @complete="handleWelcomeComplete" />
  <SidebarProvider :class="{ 'main-content-enter': !showSplashScreen }">
    <Sidebar />
    <SidebarInset>
      <TopBar class="flex-shrink-0" />
      <div class="relative flex-1 overflow-x-hidden overflow-y-auto">
        <div class="relative h-full w-full max-w-full">
          <RouterView
            v-slot="{ Component, route: currentRoute }"
            class="relative flex h-full w-full flex-col"
            :class="{ 'items-center justify-center': route.meta.showHeader !== false }"
          >
            <RouteTransitionWrapper ref="transitionRef">
              <ToolViewHeader
                v-if="currentRoute.meta.showHeader !== false"
                :transitionRef="transitionRef"
              />
              <component
                :is="Component"
                :key="route.fullPath"
                class="page flex-1"
                :class="{ 'pt-2': currentRoute.meta.showHeader !== false }"
              />
            </RouteTransitionWrapper>
          </RouterView>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
.page {
  transition: all 0.6s ease;
}

.main-content-enter {
  animation: slideInFromRight 0.6s ease-out;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
