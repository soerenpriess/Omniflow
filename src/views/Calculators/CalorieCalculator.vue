<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Calculate your daily calorie needs based on activity level.
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-2xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:food-apple" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Calorie Calculator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Gender Selection -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Gender</Label>
          <div class="grid grid-cols-2 gap-2">
            <Button
              @click="gender = 'male'"
              :variant="gender === 'male' ? 'default' : 'outline'"
              class="h-9 text-xs sm:h-10 sm:text-sm"
            >
              <Icon icon="mdi:gender-male" class="mr-1.5 h-4 w-4" />
              Male
            </Button>
            <Button
              @click="gender = 'female'"
              :variant="gender === 'female' ? 'default' : 'outline'"
              class="h-9 text-xs sm:h-10 sm:text-sm"
            >
              <Icon icon="mdi:gender-female" class="mr-1.5 h-4 w-4" />
              Female
            </Button>
          </div>
        </div>

        <!-- Age -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Age (years)</Label>
          <Input v-model.number="age" type="number" min="1" max="120" class="h-9 sm:h-10" />
        </div>

        <!-- Weight -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Weight</Label>
          <div class="flex gap-2">
            <Input v-model.number="weight" type="number" min="1" class="h-9 flex-1 sm:h-10" />
            <Button
              @click="weightUnit = weightUnit === 'kg' ? 'lbs' : 'kg'"
              variant="outline"
              class="h-9 w-16 text-xs sm:h-10 sm:w-20 sm:text-sm"
            >
              {{ weightUnit }}
            </Button>
          </div>
        </div>

        <!-- Height -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Height</Label>
          <div class="flex gap-2">
            <Input v-model.number="height" type="number" min="1" class="h-9 flex-1 sm:h-10" />
            <Button
              @click="heightUnit = heightUnit === 'cm' ? 'ft' : 'cm'"
              variant="outline"
              class="h-9 w-16 text-xs sm:h-10 sm:w-20 sm:text-sm"
            >
              {{ heightUnit }}
            </Button>
          </div>
        </div>

        <!-- Activity Level -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Activity Level</Label>
          <Select v-model="activityLevel">
            <SelectTrigger class="h-9 w-full text-xs sm:h-10 sm:text-sm">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent class="w-full">
              <SelectItem value="1.2">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="1.375">Lightly Active (1-3 days/week)</SelectItem>
              <SelectItem value="1.55">Moderately Active (3-5 days/week)</SelectItem>
              <SelectItem value="1.725">Very Active (6-7 days/week)</SelectItem>
              <SelectItem value="1.9">Super Active (physical job or 2x/day)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Calculate Button -->
        <Button @click="calculate" class="h-9 w-full text-xs sm:h-10 sm:text-sm">
          <Icon icon="mdi:calculator" class="mr-2 h-4 w-4" />
          Calculate
        </Button>

        <!-- Results -->
        <div v-if="results" class="bg-muted/30 space-y-2 rounded-lg border p-3 sm:space-y-3 sm:p-4">
          <div class="space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-xs sm:text-sm"
                >BMR (Basal Metabolic Rate)</span
              >
              <span class="text-sm font-semibold sm:text-base">{{ results.bmr }} cal/day</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-xs sm:text-sm">Maintenance Calories</span>
              <span class="text-primary text-base font-bold sm:text-lg"
                >{{ results.maintenance }} cal/day</span
              >
            </div>
          </div>
          <div class="border-t pt-2 sm:pt-3">
            <Label class="mb-2 text-xs font-semibold sm:text-sm">Goals</Label>
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-xs sm:text-sm">Weight Loss (0.5 kg/week)</span>
                <span class="text-xs font-semibold sm:text-sm">{{ results.loss }} cal/day</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs sm:text-sm">Weight Gain (0.5 kg/week)</span>
                <span class="text-xs font-semibold sm:text-sm">{{ results.gain }} cal/day</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icon } from '@iconify/vue'

const gender = ref<'male' | 'female'>('male')
const age = ref(30)
const weight = ref(70)
const weightUnit = ref<'kg' | 'lbs'>('kg')
const height = ref(170)
const heightUnit = ref<'cm' | 'ft'>('cm')
const activityLevel = ref('1.55')

interface Results {
  bmr: number
  maintenance: number
  loss: number
  gain: number
}

const results = ref<Results | null>(null)

function calculate() {
  if (!age.value || !weight.value || !height.value) {
    return
  }

  // Convert to metric
  const weightKg = weightUnit.value === 'kg' ? weight.value : weight.value * 0.453592
  const heightCm = heightUnit.value === 'cm' ? height.value : height.value * 30.48

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number
  if (gender.value === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age.value + 5
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age.value - 161
  }

  // Calculate maintenance calories
  const maintenance = Math.round(bmr * parseFloat(activityLevel.value))

  // Calculate weight loss/gain calories
  const loss = Math.round(maintenance - 500) // 0.5kg per week
  const gain = Math.round(maintenance + 500) // 0.5kg per week

  results.value = {
    bmr: Math.round(bmr),
    maintenance,
    loss,
    gain,
  }
}
</script>
