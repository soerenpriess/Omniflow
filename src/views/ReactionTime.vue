<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Test your reaction time! Click the button as quickly as possible when the color changes.
    </p>
    <Card class="route-transition-animation w-full max-w-lg rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:clock-fast" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Reaction Time Tester
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col items-center gap-6">
          <div
            @click="handleClick"
            class="flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-4 transition-all duration-300"
            :class="{
              'border-red-500 bg-red-500/20': state === 'waiting',
              'border-green-500 bg-green-500/20': state === 'ready',
              'border-blue-500 bg-blue-500/20': state === 'idle',
            }"
          >
            <div class="text-center">
              <p class="text-2xl font-bold">
                {{ stateText }}
              </p>
              <p v-if="state === 'idle'" class="text-muted-foreground mt-2">Click to start</p>
              <p
                v-if="lastTime > 0 && state === 'idle'"
                class="text-primary mt-4 text-4xl font-bold"
              >
                {{ lastTime }}ms
              </p>
            </div>
          </div>
          <div
            v-if="times.length > 0"
            class="border-primary/20 from-primary/5 to-primary/10 w-full space-y-3 rounded-lg border-2 bg-gradient-to-br p-4"
          >
            <div class="grid grid-cols-3 gap-3 text-center">
              <div>
                <p class="text-muted-foreground text-sm">Average</p>
                <p class="text-primary text-2xl font-bold">{{ averageTime }}ms</p>
              </div>
              <div>
                <p class="text-muted-foreground text-sm">Best</p>
                <p class="text-2xl font-bold text-green-600">{{ bestTime }}ms</p>
              </div>
              <div>
                <p class="text-muted-foreground text-sm">Attempts</p>
                <p class="text-2xl font-bold">{{ times.length }}</p>
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
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const state = ref<'idle' | 'waiting' | 'ready'>('idle')
const startTime = ref(0)
const lastTime = ref(0)
const times = ref<number[]>([])

const stateText = computed(() => {
  if (state.value === 'idle') return 'Click to Start'
  if (state.value === 'waiting') return 'Wait for green...'
  return 'CLICK NOW!'
})

const averageTime = computed(() => {
  if (times.value.length === 0) return 0
  return Math.round(times.value.reduce((a, b) => a + b, 0) / times.value.length)
})

const bestTime = computed(() => {
  if (times.value.length === 0) return 0
  return Math.min(...times.value)
})

function handleClick() {
  if (state.value === 'idle') {
    state.value = 'waiting'
    const delay = 2000 + Math.random() * 3000
    setTimeout(() => {
      state.value = 'ready'
      startTime.value = Date.now()
    }, delay)
  } else if (state.value === 'waiting') {
    state.value = 'idle'
  } else if (state.value === 'ready') {
    lastTime.value = Date.now() - startTime.value
    times.value.push(lastTime.value)
    state.value = 'idle'
  }
}

function reset() {
  times.value = []
  lastTime.value = 0
  state.value = 'idle'
}
</script>
