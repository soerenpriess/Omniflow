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

const route = useRoute()
const router = useRouter()
const mode = useColorMode()
const transitionRef = ref<InstanceType<typeof RouteTransitionWrapper>>()

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

onMounted(() => {
  const saved = localStorage.getItem('favoriteCards')
  if (saved) favoriteCards.value = JSON.parse(saved)

  keyboardService.setRouter(router)
  keyboardService.setColorMode(mode)
  keyboardService.startListening()
})

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
  <SidebarProvider>
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
</style>
