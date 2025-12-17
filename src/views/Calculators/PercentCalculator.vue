<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Calculate percentages, increases, decreases, and ratios instantly. Enter values to see
      real-time results for all common percentage calculations in one convenient tool.
    </p>
    <Card class="route-transition-animation w-full max-w-xl rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon
            icon="material-symbols-light:percent-rounded"
            class="text-primary h-5 w-5 sm:h-6 sm:w-6"
          />
          Percentage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <!-- Section 1: Percentage of -->
        <div class="group bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-all">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:calculator-variant" class="text-primary text-lg" />
              <div class="flex flex-wrap items-center gap-1.5 text-sm">
                <span class="text-muted-foreground">What is</span>
                <Input
                  v-model.number="percentage"
                  type="number"
                  placeholder="15"
                  class="h-8 w-16 rounded text-center text-sm"
                />
                <span class="text-muted-foreground">% of</span>
                <Input
                  v-model.number="baseValue"
                  type="number"
                  placeholder="200"
                  class="h-8 w-20 rounded text-center text-sm"
                />
              </div>
            </div>
            <div
              class="bg-primary/5 text-primary flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-base font-bold"
            >
              {{ percentageOfResult }}
            </div>
          </div>
        </div>

        <!-- Section 2: What percentage -->
        <div class="group bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-all">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:percent-outline" class="text-primary text-lg" />
              <div class="flex flex-wrap items-center gap-1.5 text-sm">
                <Input
                  v-model.number="partValue"
                  type="number"
                  placeholder="30"
                  class="h-8 w-16 rounded text-center text-sm"
                />
                <span class="text-muted-foreground">is what % of</span>
                <Input
                  v-model.number="totalValue"
                  type="number"
                  placeholder="150"
                  class="h-8 w-20 rounded text-center text-sm"
                />
              </div>
            </div>
            <div
              class="bg-primary/5 text-primary flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-base font-bold"
            >
              {{ percentageBetweenResult }}%
            </div>
          </div>
        </div>

        <!-- Section 3: Increase -->
        <div class="group bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-all">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:trending-up" class="text-primary text-lg" />
              <div class="flex flex-wrap items-center gap-1.5 text-sm">
                <span class="text-muted-foreground">Increase</span>
                <Input
                  v-model.number="increaseValue"
                  type="number"
                  placeholder="100"
                  class="h-8 w-20 rounded text-center text-sm"
                />
                <span class="text-muted-foreground">by</span>
                <Input
                  v-model.number="increasePercentage"
                  type="number"
                  placeholder="20"
                  class="h-8 w-16 rounded text-center text-sm"
                />
                <span class="text-muted-foreground">%</span>
              </div>
            </div>
            <div
              class="bg-primary/5 text-primary flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-base font-bold"
            >
              {{ increaseResult }}
            </div>
          </div>
        </div>

        <!-- Section 4: Decrease -->
        <div class="group bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-all">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:trending-down" class="text-primary text-lg" />
              <div class="flex flex-wrap items-center gap-1.5 text-sm">
                <span class="text-muted-foreground">Decrease</span>
                <Input
                  v-model.number="decreaseValue"
                  type="number"
                  placeholder="100"
                  class="h-8 w-20 rounded text-center text-sm"
                />
                <span class="text-muted-foreground">by</span>
                <Input
                  v-model.number="decreasePercentage"
                  type="number"
                  placeholder="20"
                  class="h-8 w-16 rounded text-center text-sm"
                />
                <span class="text-muted-foreground">%</span>
              </div>
            </div>
            <div
              class="bg-primary/5 text-primary flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-base font-bold"
            >
              {{ decreaseResult }}
            </div>
          </div>
        </div>

        <!-- Section 5: Original value -->
        <div class="group bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-all">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:help-circle-outline" class="text-primary text-lg" />
              <div class="flex flex-wrap items-center gap-1.5 text-sm">
                <Input
                  v-model.number="partialValue"
                  type="number"
                  placeholder="50"
                  class="h-8 w-16 rounded text-center text-sm"
                />
                <span class="text-muted-foreground">is</span>
                <Input
                  v-model.number="percentValue"
                  type="number"
                  placeholder="25"
                  class="h-8 w-16 rounded text-center text-sm"
                />
                <span class="text-muted-foreground">% of?</span>
              </div>
            </div>
            <div
              class="bg-primary/5 text-primary flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-base font-bold"
            >
              {{ whatIsOriginalResult }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Icon } from '@iconify/vue'

// Percentage of
const percentage = ref(0)
const baseValue = ref(0)
const percentageOfResult = computed(() => {
  return ((percentage.value / 100) * baseValue.value).toFixed(2)
})

// Percentage between
const partValue = ref(0)
const totalValue = ref(0)
const percentageBetweenResult = computed(() => {
  if (totalValue.value === 0) return 0
  return ((partValue.value / totalValue.value) * 100).toFixed(2)
})

// Increase
const increaseValue = ref(0)
const increasePercentage = ref(0)
const increaseResult = computed(() => {
  return (increaseValue.value + increaseValue.value * (increasePercentage.value / 100)).toFixed(2)
})

// Decrease
const decreaseValue = ref(0)
const decreasePercentage = ref(0)
const decreaseResult = computed(() => {
  return (decreaseValue.value - decreaseValue.value * (decreasePercentage.value / 100)).toFixed(2)
})

// What is original
const partialValue = ref(0)
const percentValue = ref(0)
const whatIsOriginalResult = computed(() => {
  if (percentValue.value === 0) return 0
  return (partialValue.value / (percentValue.value / 100)).toFixed(2)
})
</script>
