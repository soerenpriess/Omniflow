<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Flip a virtual coin and track your results. Perfect for making quick decisions!
    </p>
    <Card class="route-transition-animation w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:cash-multiple" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Coin Flip Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col items-center gap-6">
          <div class="relative h-56 w-56">
            <div
              class="absolute inset-0 flex items-center justify-center"
              :class="flipping ? 'animate-coin-flip' : ''"
              :style="{ '--flip-duration': `${flipDuration[0]}ms` }"
            >
              <div
                class="relative h-48 w-48 rounded-full transition-all duration-500"
                :class="[
                  flipping ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl',
                  result === 'heads'
                    ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600'
                    : result === 'tails'
                      ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500'
                      : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800',
                ]"
              >
                <div
                  class="absolute inset-0 rounded-full border-8"
                  :class="[
                    result === 'heads'
                      ? 'border-amber-300'
                      : result === 'tails'
                        ? 'border-gray-200'
                        : 'border-gray-600',
                  ]"
                ></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <Icon
                    v-if="result === 'heads'"
                    icon="mdi:crown"
                    class="h-24 w-24 text-amber-900"
                  />
                  <Icon
                    v-else-if="result === 'tails'"
                    icon="mdi:numeric-1"
                    class="h-24 w-24 text-gray-700"
                  />
                  <Icon v-else icon="mdi:help-circle-outline" class="h-24 w-24 text-gray-400" />
                </div>
                <div
                  v-if="!flipping"
                  class="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-50"
                ></div>
              </div>
            </div>
          </div>
          <div v-if="result && !flipping" class="animate-fade-in text-center">
            <p
              class="text-5xl font-bold capitalize"
              :class="[result === 'heads' ? 'text-amber-500' : 'text-gray-400']"
            >
              {{ result }}!
            </p>
          </div>
          <div class="w-full space-y-3">
            <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
              <div class="mb-3 flex items-center justify-between">
                <Label class="flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:timer-outline" class="text-primary" />
                  Flip Duration
                </Label>
                <span class="text-primary text-sm font-bold"
                  >{{ (flipDuration[0] / 1000).toFixed(1) }}s</span
                >
              </div>
              <Slider v-model="flipDuration" :min="500" :max="3000" :step="100" class="w-full" />
            </div>
          </div>
          <Button @click="flip" :disabled="flipping" class="h-12 w-full text-lg font-semibold">
            <Icon icon="mdi:sync" class="mr-2" />
            Flip Coin
          </Button>
          <div
            v-if="history.length > 0"
            class="border-primary/20 from-primary/5 to-primary/10 w-full space-y-3 rounded-lg border-2 bg-gradient-to-br p-4"
          >
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center">
                <p class="text-muted-foreground text-sm">Heads</p>
                <p class="text-2xl font-bold">{{ heads }}</p>
              </div>
              <div class="text-center">
                <p class="text-muted-foreground text-sm">Tails</p>
                <p class="text-2xl font-bold">{{ tails }}</p>
              </div>
            </div>
            <div class="text-center">
              <p class="text-muted-foreground text-sm">Total Flips: {{ history.length }}</p>
            </div>
            <Button @click="showGraph = !showGraph" variant="ghost" size="sm" class="w-full">
              <Icon :icon="showGraph ? 'mdi:chart-bar-off' : 'mdi:chart-bar'" class="mr-2" />
              {{ showGraph ? 'Hide' : 'Show' }} Distribution
            </Button>
            <div v-if="showGraph" class="animate-fade-in space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="flex items-center gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-amber-500"></div>
                    Heads
                  </span>
                  <span class="font-bold">{{ headsPercentage.toFixed(1) }}%</span>
                </div>
                <div class="bg-muted relative h-6 w-full overflow-hidden rounded-full">
                  <div
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                    :style="{ width: `${headsPercentage}%` }"
                  ></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="flex items-center gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-gray-400"></div>
                    Tails
                  </span>
                  <span class="font-bold">{{ tailsPercentage.toFixed(1) }}%</span>
                </div>
                <div class="bg-muted relative h-6 w-full overflow-hidden rounded-full">
                  <div
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-300 to-gray-500 transition-all duration-500"
                    :style="{ width: `${tailsPercentage}%` }"
                  ></div>
                </div>
              </div>
              <div class="border-primary/20 mt-3 rounded-lg border p-3">
                <Label class="mb-2 flex items-center gap-2 text-xs font-medium">
                  <Icon icon="mdi:history" class="text-primary" />
                  Last 20 Flips
                </Label>
                <div class="flex flex-wrap gap-1">
                  <div
                    v-for="(flip, index) in history.slice(-20).reverse()"
                    :key="index"
                    class="flex h-6 w-6 items-center justify-center rounded-full border-2"
                    :class="[
                      flip === 'heads'
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-gray-400 bg-gray-400/20',
                    ]"
                    :title="flip"
                  >
                    <Icon
                      :icon="flip === 'heads' ? 'mdi:crown' : 'mdi:numeric-1'"
                      class="h-3 w-3"
                      :class="flip === 'heads' ? 'text-amber-700' : 'text-gray-600'"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button @click="reset" variant="outline" size="sm" class="w-full">
              <Icon icon="mdi:refresh" class="mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

const result = ref<'heads' | 'tails' | null>(null)
const flipping = ref(false)
const history = ref<string[]>([])
const flipDuration = ref([1000])
const showGraph = ref(false)

const heads = computed(() => history.value.filter((r) => r === 'heads').length)
const tails = computed(() => history.value.filter((r) => r === 'tails').length)

const headsPercentage = computed(() => {
  if (history.value.length === 0) return 0
  return (heads.value / history.value.length) * 100
})

const tailsPercentage = computed(() => {
  if (history.value.length === 0) return 0
  return (tails.value / history.value.length) * 100
})

function flip() {
  flipping.value = true
  result.value = null

  setTimeout(() => {
    const outcome = Math.random() < 0.5 ? 'heads' : 'tails'
    result.value = outcome
    history.value.push(outcome)
    flipping.value = false
  }, flipDuration.value[0])
}

function reset() {
  history.value = []
  result.value = null
}

function handleKeyPress(event: KeyboardEvent) {
  if ((event.code === 'Space' || event.key === ' ') && !flipping.value) {
    event.preventDefault()
    flip()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
@keyframes coin-flip {
  0% {
    transform: rotateY(0deg) rotateX(0deg);
  }
  25% {
    transform: rotateY(180deg) rotateX(180deg) scale(1.1);
  }
  50% {
    transform: rotateY(360deg) rotateX(360deg) scale(1);
  }
  75% {
    transform: rotateY(540deg) rotateX(540deg) scale(1.1);
  }
  100% {
    transform: rotateY(720deg) rotateX(720deg) scale(1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-coin-flip {
  animation: coin-flip var(--flip-duration, 1s) ease-in-out;
  transform-style: preserve-3d;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
