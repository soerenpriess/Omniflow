<script setup lang="ts">
import { SidebarTrigger } from '@/components/ui/sidebar'
import Theming from '@/components/layout/topbar/Theming.vue'
import { Icon } from '@iconify/vue'
import draggable from 'vuedraggable'
import { inject, ref } from 'vue'
import router from '@/router/_index'

const hoveredCard = ref<string | null>(null)
const favoriteCards = inject<any>('favoriteCards')
const favoriteCardsUpdated = inject<any>('favoriteCardsUpdated')
const scrollContainer = ref<HTMLElement | null>(null)

function leaveRoute(path: string) {
  router.push(path)
}

function handleWheel(event: WheelEvent) {
  if (!scrollContainer.value) return

  // Horizontal scroll whit Mousewheel
  if (event.deltaY !== 0) {
    event.preventDefault()
    scrollContainer.value.scrollLeft += event.deltaY
  }
}

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

function onDragEnd() {
  if (favoriteCardsUpdated) {
    favoriteCardsUpdated.value = !favoriteCardsUpdated.value
  }
}
</script>

<template>
  <header
    class="bg-background z-50 flex h-14 w-full max-w-full flex-shrink-0 items-center gap-2 border-b px-2 sm:h-16 sm:gap-3 sm:px-3 md:h-18"
  >
    <!-- left: SidebarTrigger -->
    <SidebarTrigger class="flex-shrink-0 cursor-pointer" />

    <!-- middle: Favorites Container -->
    <div class="hidden h-1 w-1 flex-shrink-0 rounded-full bg-white md:block"></div>
    <div class="hidden flex-shrink-0 items-center gap-2 md:flex">
      <p class="text-sm lg:text-base">Favorites</p>
      <Icon icon="material-symbols:star-rounded" class="h-4 w-4 text-amber-500 lg:h-5 lg:w-5" />
    </div>
    <div
      ref="scrollContainer"
      class="scrollbar-hide min-w-0 flex-1 overflow-x-auto overflow-y-hidden"
      @wheel="handleWheel"
    >
      <div class="flex items-center gap-2 sm:gap-3">
        <div v-if="!favoriteCards || favoriteCards.length === 0" class="flex items-center">
          <p class="text-muted-foreground text-xs sm:text-sm">No favorites yet</p>
        </div>
        <draggable
          v-else
          v-model="favoriteCards"
          item-key="card.title"
          tag="transition-group"
          class="flex flex-nowrap items-center gap-2 p-2"
          :component-data="{ tag: 'div', name: 'fade' }"
          :delay="200"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          @end="onDragEnd"
        >
          <template #item="{ element, index }">
            <div
              :key="element.card.title"
              class="bg-card border-secondary flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all ease-in-out sm:h-12 sm:w-12"
              :class="{
                'custom-ring-1 scale-105': hoveredCard === `${element.category.title}-${index}`,
              }"
              :style="{
                backgroundImage: getTripleWaveBackground(
                  element.category.waveDesign.waveColors,
                  element.category.waveDesign.waveHeights,
                  element.category.waveDesign.waveAmplitudes,
                ),
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0% bottom',
                backgroundSize: '200% 100%',
                '--hover-ring-color': element.category.hoverColor,
              }"
              @mouseover="hoveredCard = `${element.category.title}-${index}`"
              @mouseleave="hoveredCard = null"
              @click="element.card.path && leaveRoute(element.card.path)"
            >
              <Icon
                :icon="element.card.icon"
                class="text-opacity-80 h-5 w-5 text-[color:var(--hover-color)] sm:h-6 sm:w-6 md:h-7 md:w-7"
              />
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- right: Theming -->
    <Theming class="flex-shrink-0" />
  </header>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.fade-move {
  transition: transform 0.3s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
