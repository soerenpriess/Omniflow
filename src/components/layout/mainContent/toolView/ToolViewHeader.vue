<template>
  <div class="z-10 flex w-full justify-between px-2 pt-2 sm:px-4 sm:pt-4">
    <BackButton @back="handleBack" />
    <FavoriteButton v-if="showFavoriteButton" :current-route="currentRoute" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackButton from '@/components/layout/mainContent/toolView/components/BackButton.vue'
import FavoriteButton from '@/components/layout/mainContent/toolView/components/FavoriteButton.vue'
import RouteTransitionWrapper from '@/components/RouteTransitionWrapper.vue'

const props = defineProps<{
  transitionRef?: InstanceType<typeof RouteTransitionWrapper> | null
}>()

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route)
const showFavoriteButton = computed(() => route.meta.isFavoritable === true)

function handleBack() {
  props.transitionRef?.playExitAnimation(() => {
    router.push('/')
  })
}
</script>
