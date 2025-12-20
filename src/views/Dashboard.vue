<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
import { ref, inject, type Ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import RouteTransitionWrapper from '@/components/RouteTransitionWrapper.vue'
import { Button } from '@/components/ui/button'
import DashboardControlBar from '@/components/layout/mainContent/dashboardView/DashboardControlBar.vue'
import { getCategories } from '@/data/tools/_index'
import type { Category } from '@/types/Category'
import { useLocalStorage } from '@vueuse/core'

const router = useRouter()

const hoveredCard = ref<string | null>(null)
const sortBy = useLocalStorage<'none' | 'name-asc' | 'name-desc' | 'favorites'>(
  'dashboard-sort-by',
  'none',
)
const viewMode = useLocalStorage<'category' | 'all'>('dashboard-view-mode', 'category')

const categoriesData: Category[] = getCategories()

const favoriteCards = inject<Ref<any[]>>('favoriteCards')!
const toggleFavorite = inject<Function>('toggleFavorite')!

const transitionRef = ref<InstanceType<typeof RouteTransitionWrapper>>()

function isFavorite(title: string) {
  return favoriteCards.value.some((favCard) => favCard.card.title === title)
}

// Computed property for sorted/filtered categories
const categories = computed(() => {
  if (viewMode.value === 'category') {
    // Category view with sorting within each category
    return categoriesData.map((category) => {
      const sortedCards = [...category.cards]

      if (sortBy.value === 'name-asc') {
        sortedCards.sort((a, b) => a.title.localeCompare(b.title))
      } else if (sortBy.value === 'name-desc') {
        sortedCards.sort((a, b) => b.title.localeCompare(a.title))
      } else if (sortBy.value === 'favorites') {
        sortedCards.sort((a, b) => {
          const aFav = isFavorite(a.title) ? 1 : 0
          const bFav = isFavorite(b.title) ? 1 : 0
          return bFav - aFav
        })
      }

      return { ...category, cards: sortedCards }
    })
  } else {
    // All cards view
    const allCards: any[] = []
    categoriesData.forEach((category) => {
      category.cards.forEach((card) => {
        allCards.push({
          ...card,
          categoryInfo: category,
        })
      })
    })

    // Sort all cards
    if (sortBy.value === 'name-asc') {
      allCards.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy.value === 'name-desc') {
      allCards.sort((a, b) => b.title.localeCompare(a.title))
    } else if (sortBy.value === 'favorites') {
      allCards.sort((a, b) => {
        const aFav = isFavorite(a.title) ? 1 : 0
        const bFav = isFavorite(b.title) ? 1 : 0
        return bFav - aFav
      })
    }

    return [
      {
        title: 'All Tools',
        hoverColor: '#8B5CF6',
        cards: allCards,
        waveDesign: {
          waveColors: ['#8B5CF626', '#A78BFA1F', '#C4B5FD14'],
          waveHeights: [10, 6, 5],
          waveAmplitudes: [1, -2, -3],
        },
      },
    ]
  }
})

const totalToolsCount = computed(() => {
  return categoriesData.reduce((acc, cat) => {
    const activeCards = cat.cards.filter((card) => card.isActive) // only count active cards
    return acc + activeCards.length
  }, 0)
})

// Scroll position state
const SCROLL_POSITION_KEY = 'dashboard-scroll-position'
const scrollContainer = ref<HTMLElement | null>(null)

function saveScrollPosition() {
  const container = scrollContainer.value
  if (container) {
    const scrollPosition = container.scrollTop
    sessionStorage.setItem(SCROLL_POSITION_KEY, scrollPosition.toString())
  }
}

function restoreScrollPosition() {
  const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY)
  const container = scrollContainer.value
  if (savedPosition && container) {
    container.scrollTop = parseInt(savedPosition)
  }
}

function leaveRoute(path: string) {
  saveScrollPosition()
  transitionRef.value?.playExitAnimation(() => {
    router.push(path)
  })
}

// Also save scroll position on scroll events
let scrollTimeout: number | null = null
function handleScroll() {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = window.setTimeout(() => {
    saveScrollPosition()
  }, 100)
}

onMounted(() => {
  // Find the scroll container (parent with overflow-y-auto)
  let parent = transitionRef.value?.$el?.parentElement
  while (parent) {
    const style = window.getComputedStyle(parent)
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      scrollContainer.value = parent
      break
    }
    parent = parent.parentElement
  }

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
    restoreScrollPosition()
  }
})

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
  if (scrollTimeout) clearTimeout(scrollTimeout)
  saveScrollPosition()
})

function getTripleWaveBackground(colors: string[], heights: number[], amplitudes: number[]) {
  const svgs = colors.map((color, i) => {
    const height = heights[i]
    const amplitude = amplitudes[i]
    const cp1 = 360 + i * 50
    const cp2 = 1080 - i * 50
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${height}" viewBox="0 0 1440 ${height}" preserveAspectRatio="none">
        <path fill="${color}" d="
          M0,${height / 2}
          C${cp1},${height / 2 + amplitude} ${cp2},${height / 2 - amplitude} 1440,${height / 2}
          L1440,${height}
          L0,${height}
          Z
        "/>
      </svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  })
  return svgs.join(', ')
}
</script>

<template>
  <RouteTransitionWrapper ref="transitionRef">
    <div class="w-full space-y-4 p-4 sm:space-y-8 sm:p-8">
      <DashboardControlBar
        :total-tools-count="totalToolsCount"
        v-model:view-mode="viewMode"
        v-model:sort-by="sortBy"
        class="route-transition-animation"
      />

      <div
        v-for="(category, cIndex) in categories"
        :key="cIndex"
        class="relative w-full space-y-4"
        :class="{
          'border-border border-b pb-8': category.title === 'Welcome to Omniflow',
        }"
      >
        <h2 class="route-transition-animation flex items-center gap-3 text-3xl font-bold">
          <div
            class="h-8 w-1 rounded-full"
            :style="{
              background: `linear-gradient(to bottom, ${category.hoverColor}, ${category.hoverColor}99)`,
            }"
          ></div>
          {{ category.title }}
        </h2>

        <div class="flex w-full flex-wrap gap-4 pb-2">
          <template v-if="viewMode === 'category'">
            <Card
              v-for="(card, i) in category.cards"
              :key="i"
              class="route-transition-animation relative h-35 w-full cursor-pointer overflow-hidden transition-all ease-in-out min-[385px]:h-42 min-[385px]:w-42 sm:h-60 sm:w-60"
              :style="{
                backgroundImage: getTripleWaveBackground(
                  category.waveDesign.waveColors,
                  category.waveDesign.waveHeights,
                  category.waveDesign.waveAmplitudes,
                ),
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom',
                backgroundSize: '200% 100%',
                '--hover-ring-color': category.hoverColor,
              }"
              @mouseover="hoveredCard = `${category.title}-${i}`"
              @mouseleave="hoveredCard = null"
              @click="card.isActive ? card.path && leaveRoute(card.path) : null"
              :class="{
                'custom-ring-1 scale-105':
                  hoveredCard === `${category.title}-${i}` && card.isActive,
              }"
            >
              <CardHeader class="flex h-full flex-col items-center p-1 text-center sm:p-4">
                <Icon
                  :icon="card.icon"
                  class="text-opacity-80 h-14 w-14 text-[color:var(--hover-color)] sm:h-14 sm:w-14"
                />
                <Button
                  v-if="card.isActive && card.isFavoritable !== false"
                  class="group absolute top-3 right-3 cursor-pointer p-1 text-xs transition-all ease-in-out"
                  variant="ghost"
                  @click.stop="toggleFavorite(card, category)"
                >
                  <Icon
                    icon="material-symbols:star-rounded"
                    :class="[
                      'h-5 w-5 transition-all',
                      isFavorite(card.title)
                        ? 'drop-shadow-glow text-amber-500'
                        : 'text-gray-100/10 group-hover:text-amber-500',
                    ]"
                  />
                </Button>
                <CardTitle class="text-md mt-2 sm:text-lg md:hidden">{{
                  card.title.length > 16 ? card.title.slice(0, 16) + '…' : card.title
                }}</CardTitle>
                <CardTitle class="text-md mt-2 hidden sm:text-lg md:block">{{
                  card.title
                }}</CardTitle>
                <CardDescription class="mt-1 text-[9px] sm:text-xs md:hidden">{{
                  card.description.length > 32
                    ? card.description.slice(0, 32) + '…'
                    : card.description
                }}</CardDescription>
                <CardDescription class="mt-1 hidden text-[9px] sm:text-xs md:block">{{
                  card.description
                }}</CardDescription>
              </CardHeader>
              <div
                v-if="!card.isActive"
                class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl backdrop-blur-sm"
              >
                <Icon icon="mdi:lock" class="h-8 w-8 text-white opacity-80" />
              </div>
            </Card>
          </template>
          <template v-else>
            <Card
              v-for="(card, i) in category.cards"
              :key="i"
              class="route-transition-animation relative h-35 w-full cursor-pointer overflow-hidden transition-all ease-in-out min-[385px]:h-42 min-[385px]:w-42 sm:h-60 sm:w-60"
              :style="{
                backgroundImage: getTripleWaveBackground(
                  card.categoryInfo.waveDesign.waveColors,
                  card.categoryInfo.waveDesign.waveHeights,
                  card.categoryInfo.waveDesign.waveAmplitudes,
                ),
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom',
                backgroundSize: '200% 100%',
                '--hover-ring-color': card.categoryInfo.hoverColor,
              }"
              @mouseover="hoveredCard = `all-${i}`"
              @mouseleave="hoveredCard = null"
              @click="card.isActive ? card.path && leaveRoute(card.path) : null"
              :class="{
                'custom-ring-1 scale-105': hoveredCard === `all-${i}` && card.isActive,
              }"
            >
              <CardHeader class="flex h-full flex-col items-center p-1 text-center sm:p-4">
                <Icon
                  :icon="card.icon"
                  class="text-opacity-80 h-14 w-14 text-[color:var(--hover-color)] sm:h-14 sm:w-14"
                />
                <Button
                  v-if="card.isActive && card.isFavoritable !== false"
                  class="group absolute top-3 right-3 cursor-pointer p-1 text-xs transition-all ease-in-out"
                  variant="ghost"
                  @click.stop="toggleFavorite(card, card.categoryInfo)"
                >
                  <Icon
                    icon="material-symbols:star-rounded"
                    :class="[
                      'h-5 w-5 transition-all',
                      isFavorite(card.title)
                        ? 'drop-shadow-glow text-amber-500'
                        : 'text-gray-100/10 group-hover:text-amber-500',
                    ]"
                  />
                </Button>
                <div class="bg-muted/80 absolute top-3 left-3 rounded-full px-2 py-1">
                  <p class="text-xs font-medium">{{ card.categoryInfo.title }}</p>
                </div>
                <CardTitle class="text-md mt-2 sm:text-lg md:hidden">{{
                  card.title.length > 16 ? card.title.slice(0, 16) + '…' : card.title
                }}</CardTitle>
                <CardTitle class="text-md mt-2 hidden sm:text-lg md:block">{{
                  card.title
                }}</CardTitle>
                <CardDescription class="mt-1 text-[9px] sm:text-xs md:hidden">{{
                  card.description.length > 32
                    ? card.description.slice(0, 32) + '…'
                    : card.description
                }}</CardDescription>
                <CardDescription class="mt-1 hidden text-[9px] sm:text-xs md:block">{{
                  card.description
                }}</CardDescription>
              </CardHeader>
              <div
                v-if="!card.isActive"
                class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl backdrop-blur-sm"
              >
                <Icon icon="mdi:lock" class="h-8 w-8 text-white opacity-80" />
              </div>
            </Card>
          </template>
        </div>
      </div>
    </div>
  </RouteTransitionWrapper>
</template>

<style scoped>
.drop-shadow-glow {
  filter: drop-shadow(0 0 6px #fbbf24aa) drop-shadow(0 0 12px #fbbf2477);
}
</style>
