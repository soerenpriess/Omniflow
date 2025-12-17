<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Calculate your Body Mass Index (BMI) to assess your weight category.
    </p>
    <Card class="route-transition-animation w-full max-w-lg rounded-2xl shadow-lg">
      <CardHeader class="space-y-3">
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
            <Icon icon="mdi:scale-bathroom" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            BMI Calculator
          </CardTitle>
          <!-- Metric toggle -->
          <div class="bg-muted/50 flex items-center gap-3 rounded-full px-3 py-1.5">
            <span
              class="text-sm transition-colors"
              :class="
                unitSystem === 'metric' ? 'text-primary font-semibold' : 'text-muted-foreground'
              "
            >
              Metric
            </span>
            <button
              @click="toggleUnitSystem"
              class="focus-visible:ring-ring relative h-6 w-11 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              :class="unitSystem === 'imperial' ? 'bg-primary' : 'bg-input'"
              type="button"
              role="switch"
              :aria-checked="unitSystem === 'imperial'"
            >
              <span
                class="bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform"
                :class="unitSystem === 'imperial' ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
            <span
              class="text-sm transition-colors"
              :class="
                unitSystem === 'imperial' ? 'text-primary font-semibold' : 'text-muted-foreground'
              "
            >
              Imperial
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Weight Input -->
        <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
          <Label for="weight" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:weight-kilogram" class="text-primary" />
            Weight {{ unitSystem === 'metric' ? '(kg)' : '(lbs)' }}
          </Label>
          <Input
            id="weight"
            v-model.number="weight"
            type="number"
            min="0"
            step="0.1"
            :placeholder="`Enter weight in ${unitSystem === 'metric' ? 'kg' : 'lbs'}`"
            class="bg-background text-lg font-medium"
            :class="{ 'border-red-500': weightError }"
          />
          <p v-if="weightError" class="mt-1 text-xs text-red-500">Please enter a valid weight.</p>
        </div>

        <!-- Height Input -->
        <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
          <Label for="height" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:human-male-height" class="text-primary" />
            Height {{ unitSystem === 'metric' ? '(cm)' : '(ft/in)' }}
          </Label>
          <div v-if="unitSystem === 'metric'">
            <Input
              id="height"
              v-model.number="height"
              type="number"
              min="0"
              step="0.1"
              placeholder="Enter height in cm"
              class="bg-background text-lg font-medium"
              :class="{ 'border-red-500': heightError }"
            />
          </div>
          <div v-else class="flex gap-3">
            <div class="flex-1">
              <Input
                id="heightFt"
                v-model.number="heightFt"
                type="number"
                min="0"
                placeholder="Feet"
                class="bg-background text-lg font-medium"
                :class="{ 'border-red-500': heightError }"
              />
            </div>
            <div class="flex-1">
              <Input
                id="heightIn"
                v-model.number="heightIn"
                type="number"
                min="0"
                max="11"
                placeholder="Inches"
                class="bg-background text-lg font-medium"
                :class="{ 'border-red-500': heightError }"
              />
            </div>
          </div>
          <p v-if="heightError" class="mt-1 text-xs text-red-500">Please enter a valid height.</p>
        </div>

        <!-- Calculate Button -->
        <Button @click="calculateBMI" class="h-12 w-full text-lg font-semibold">
          <Icon icon="mdi:calculator-variant" class="mr-2" />
          Calculate BMI
        </Button>

        <!-- Result Display -->
        <transition name="fade">
          <div
            v-if="showResult"
            ref="resultRef"
            class="rounded-lg border-2 p-6 text-center"
            :class="[
              bmi && bmi < 18.5 ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : '',
              bmi && bmi >= 18.5 && bmi < 25
                ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20'
                : '',
              bmi && bmi >= 25 && bmi < 30
                ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'
                : '',
              bmi && bmi >= 30 ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : '',
            ]"
          >
            <div class="flex flex-col items-center gap-3">
              <Icon :icon="bmiIcon" class="text-6xl" :class="bmiColor" />
              <div>
                <p class="text-3xl font-bold" :class="bmiColor">{{ bmi?.toFixed(1) }}</p>
                <p class="text-muted-foreground text-sm">Body Mass Index</p>
              </div>
              <div
                class="mt-2 rounded-full px-4 py-2"
                :class="[
                  bmi && bmi < 18.5 ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : '',
                  bmi && bmi >= 18.5 && bmi < 25
                    ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                    : '',
                  bmi && bmi >= 25 && bmi < 30
                    ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                    : '',
                  bmi && bmi >= 30 ? 'bg-red-500/20 text-red-700 dark:text-red-300' : '',
                ]"
              >
                <p class="text-lg font-semibold">{{ bmiCategory }}</p>
              </div>
            </div>
          </div>
        </transition>
      </CardContent>
    </Card>
  </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { animate } from 'animejs'
import { Icon } from '@iconify/vue'

const resultRef = ref<HTMLElement | null>(null)

const weight = ref<number | undefined>(undefined)
const height = ref<number | undefined>(undefined)
const heightFt = ref<number | undefined>(undefined)
const heightIn = ref<number | undefined>(undefined)
const bmi = ref<number | null>(null)
const showResult = ref(false)

const unitSystem = ref<'metric' | 'imperial'>('metric')

const weightError = computed(() => weight.value !== undefined && weight.value <= 0)
const heightError = computed(() => {
  if (unitSystem.value === 'metric') {
    return height.value !== undefined && height.value <= 0
  } else {
    return (
      (heightFt.value !== undefined && heightFt.value < 0) ||
      (heightIn.value !== undefined && heightIn.value < 0)
    )
  }
})

const bmiCategory = computed(() => {
  if (!bmi.value) return ''
  if (bmi.value < 18.5) return 'Underweight'
  if (bmi.value < 25) return 'Normal weight'
  if (bmi.value < 30) return 'Overweight'
  return 'Obese'
})

const bmiColor = computed(() => {
  if (!bmi.value) return ''
  if (bmi.value < 18.5) return 'text-blue-500'
  if (bmi.value < 25) return 'text-green-600'
  if (bmi.value < 30) return 'text-yellow-500'
  return 'text-red-600'
})

const bmiIcon = computed(() => {
  if (!bmi.value) return ''
  if (bmi.value < 18.5) return 'mdi:human-handsup' // Underweight: schlanke Person
  if (bmi.value < 25) return 'mdi:emoticon-happy-outline' // Normal: Smiley
  if (bmi.value < 30) return 'mdi:alert-outline' // Overweight: Warnung
  return 'mdi:alert-circle-outline' // Obese: Achtung
})

function toggleUnitSystem() {
  unitSystem.value = unitSystem.value === 'metric' ? 'imperial' : 'metric'

  weight.value = undefined
  height.value = undefined
  heightFt.value = undefined
  heightIn.value = undefined
  showResult.value = false
}

function calculateBMI() {
  if (weightError.value || heightError.value) return

  let weightKg = weight.value
  let heightCm = height.value

  if (unitSystem.value === 'imperial' && weightKg) {
    weightKg = weightKg * 0.453592
  }

  if (unitSystem.value === 'imperial') {
    const ft = heightFt.value || 0
    const inches = heightIn.value || 0
    heightCm = ft * 30.48 + inches * 2.54
  }

  if (weightKg && heightCm && weightKg > 0 && heightCm > 0) {
    bmi.value = weightKg / (heightCm / 100) ** 2
    showResult.value = false
    nextTick(() => {
      showResult.value = true
    })
  }
}

watch(showResult, (visible) => {
  if (visible && resultRef.value) {
    animate(resultRef.value, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 700,
      easing: 'easeOutExpo',
    })
  }
})
</script>
