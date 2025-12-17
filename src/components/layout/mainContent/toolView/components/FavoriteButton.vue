<template>
  <Button
    variant="outline"
    class="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden px-4 py-2"
    @click="toggleFavorite"
    ref="btnRef"
  >
    <span class="relative inline-block">
      <Icon
        icon="material-symbols:star-rounded"
        :class="[
          'text-4xl transition-all duration-300 ease-in-out',
          isFavorite
            ? 'drop-shadow-glow scale-[1.2] text-amber-500'
            : 'scale-100 text-gray-300/70 group-hover:text-amber-500',
        ]"
        ref="iconRef"
      />

      <span v-if="showBurst" class="pointer-events-none absolute inset-0" ref="burstRef"></span>
    </span>
  </Button>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue'
import { animate } from 'animejs'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { getCategories } from '@/data/tools/_index'

interface Props {
  currentRoute: RouteLocationNormalizedLoaded
}

const props = defineProps<Props>()

const favoriteCards = inject<any>('favoriteCards') // global favorite cards list
const favoriteCardsUpdated = inject<any>('favoriteCardsUpdated') // reactive ref to track updates
const toggleFavoriteGlobal = inject<any>('toggleFavorite') // global toggle function

const iconRef = ref<HTMLElement | null>(null)
const burstRef = ref<HTMLElement | null>(null) // for burst animation when favoriting
const showBurst = ref(false)

const currentCardInfo = computed(() => {
  const categories = getCategories()
  for (const category of categories) {
    const card = category.cards?.find((c: any) => c.path === props.currentRoute.path)
    if (card) {
      return { card, category }
    }
  }
  return null
})

// check if current card is in favorites
const isFavorite = computed(() => {
  if (!favoriteCards?.value || !currentCardInfo.value) return false
  return favoriteCards.value.some(
    (favCard: any) => favCard.card.title === currentCardInfo.value!.card.title,
  )
})

// Watch for changes to the favoriteCards list and trigger reactivity updates
// This ensures the isFavorite computed property re-evaluates when favorites change elsewhere
watch(
  () => favoriteCardsUpdated?.value,
  () => {
    // This will trigger re-computation of isFavorite
  },
)

function toggleFavorite() {
  if (!currentCardInfo.value || !toggleFavoriteGlobal) return

  const wasAlreadyFavorite = isFavorite.value

  toggleFavoriteGlobal(currentCardInfo.value.card, currentCardInfo.value.category)

  // Only animate if the state was not already favorite
  if (!wasAlreadyFavorite) {
    animateFavorite()
  }
}

function animateFavorite() {
  // Animate scale on icon
  if (iconRef.value) {
    animate(iconRef.value, {
      scale: [
        { value: 2, duration: 200, easing: 'easeOutExpo' },
        { value: 1.2, duration: 200, easing: 'easeOutElastic(1, .5)' },
      ],
    })
  }

  // Burst animation
  if (burstRef.value) {
    showBurst.value = true
    burstRef.value.innerHTML = ''
    const burst = document.createElement('span')
    burst.className = 'absolute inset-0 rounded-full bg-amber-300 opacity-60'
    burstRef.value.appendChild(burst)

    animate(burst, {
      scale: [0.2, 2.5],
      opacity: [0.6, 0],
      easing: 'easeOutCubic',
      duration: 500,
      complete: () => {
        showBurst.value = false
        burstRef.value!.innerHTML = ''
      },
    })
  }
}
</script>

<style scoped>
.drop-shadow-glow {
  filter: drop-shadow(0 0 6px #fbbf24aa) drop-shadow(0 0 12px #fbbf2477);
}
</style>
