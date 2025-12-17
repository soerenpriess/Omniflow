<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Roll virtual dice for games and decisions
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-3xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:dice-6" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Dice Roller
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Dice Selection -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Select Dice Type</Label>
          <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <Button
              v-for="die in diceTypes"
              :key="die.sides"
              @click="selectedDice = die.sides"
              :variant="selectedDice === die.sides ? 'default' : 'outline'"
              class="flex h-16 flex-col items-center justify-center sm:h-20"
            >
              <Icon :icon="die.icon" class="mb-1 h-6 w-6 sm:h-8 sm:w-8" />
              <span class="text-xs font-semibold">D{{ die.sides }}</span>
            </Button>
          </div>
        </div>

        <!-- Number of Dice -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Number of Dice: {{ numberOfDice }}</Label>
          <Slider v-model="numberOfDice" :min="1" :max="10" :step="1" />
        </div>

        <!-- Roll Button -->
        <Button
          @click="rollDice"
          class="h-12 w-full text-base sm:h-14 sm:text-lg"
          :disabled="isRolling"
        >
          <Icon icon="mdi:dice-multiple" class="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
          {{ isRolling ? 'Rolling...' : 'Roll Dice' }}
        </Button>

        <!-- Results -->
        <div v-if="results.length > 0" class="space-y-3">
          <!-- Individual Results -->
          <div class="bg-muted/30 rounded-lg border p-3 sm:p-4">
            <Label class="mb-2 text-xs font-semibold sm:text-sm">Individual Rolls</Label>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(result, index) in results"
                :key="index"
                class="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg font-bold shadow-lg sm:h-14 sm:w-14 sm:text-lg"
                :class="{ 'animate-bounce': isRolling }"
              >
                {{ result }}
              </div>
            </div>
          </div>

          <!-- Total -->
          <div
            class="rounded-lg border bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white sm:p-6"
          >
            <div class="text-center">
              <p class="mb-1 text-xs opacity-90 sm:text-sm">Total</p>
              <p class="text-4xl font-bold sm:text-5xl">{{ total }}</p>
            </div>
          </div>

          <!-- Statistics -->
          <div class="grid grid-cols-2 gap-2 sm:gap-3">
            <div class="bg-muted/30 rounded-lg border p-2 text-center sm:p-3">
              <p class="text-muted-foreground mb-1 text-[10px] sm:text-xs">Average</p>
              <p class="text-lg font-semibold sm:text-xl">{{ average }}</p>
            </div>
            <div class="bg-muted/30 rounded-lg border p-2 text-center sm:p-3">
              <p class="text-muted-foreground mb-1 text-[10px] sm:text-xs">Range</p>
              <p class="text-lg font-semibold sm:text-xl">{{ min }} - {{ max }}</p>
            </div>
          </div>
        </div>

        <!-- History -->
        <div v-if="history.length > 0" class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs font-semibold sm:text-sm">Roll History</Label>
            <Button @click="clearHistory" variant="ghost" size="sm" class="h-6 text-xs">
              <Icon icon="mdi:delete-sweep" class="mr-1 h-3 w-3" />
              Clear
            </Button>
          </div>
          <ScrollArea class="h-32 rounded-lg border">
            <div class="space-y-1 p-2">
              <div
                v-for="(roll, index) in history.slice().reverse()"
                :key="index"
                class="text-muted-foreground hover:bg-muted/50 flex items-center justify-between rounded p-2 text-xs sm:text-sm"
              >
                <span>{{ roll.dice }}x D{{ roll.sides }}</span>
                <span class="font-mono font-semibold">{{ roll.results.join(', ') }}</span>
                <span class="text-primary font-bold">= {{ roll.total }}</span>
              </div>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Icon } from '@iconify/vue'

const diceTypes = [
  { sides: 4, icon: 'mdi:dice-4' },
  { sides: 6, icon: 'mdi:dice-6' },
  { sides: 8, icon: 'mdi:dice-d8' },
  { sides: 10, icon: 'mdi:dice-d10' },
  { sides: 12, icon: 'mdi:dice-d12' },
  { sides: 20, icon: 'mdi:dice-d20' },
]

const selectedDice = ref(6)
const numberOfDice = ref([1])
const results = ref<number[]>([])
const isRolling = ref(false)

interface RollHistory {
  dice: number
  sides: number
  results: number[]
  total: number
}

const history = ref<RollHistory[]>([])

const total = computed(() => results.value.reduce((sum, val) => sum + val, 0))
const average = computed(() =>
  results.value.length ? (total.value / results.value.length).toFixed(1) : 0,
)
const min = computed(() => (results.value.length ? Math.min(...results.value) : 0))
const max = computed(() => (results.value.length ? Math.max(...results.value) : 0))

function rollDice() {
  isRolling.value = true
  results.value = []

  // Animate rolling
  const rollAnimation = setInterval(() => {
    results.value = Array.from(
      { length: numberOfDice.value[0] },
      () => Math.floor(Math.random() * selectedDice.value) + 1,
    )
  }, 50)

  // Stop after animation
  setTimeout(() => {
    clearInterval(rollAnimation)

    // Final roll
    const finalResults = Array.from(
      { length: numberOfDice.value[0] },
      () => Math.floor(Math.random() * selectedDice.value) + 1,
    )
    results.value = finalResults
    isRolling.value = false

    // Add to history
    history.value.push({
      dice: numberOfDice.value[0],
      sides: selectedDice.value,
      results: finalResults,
      total: finalResults.reduce((sum, val) => sum + val, 0),
    })

    // Keep only last 20 rolls
    if (history.value.length > 20) {
      history.value.shift()
    }
  }, 500)
}

function clearHistory() {
  history.value = []
}
</script>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 0.5s ease-in-out infinite;
}
</style>
