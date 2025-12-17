<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert between different units of measurement instantly. Choose from length, weight,
      temperature, volume, and more. Get accurate conversions with detailed calculation paths.
    </p>
    <Card class="route-transition-animation w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="vaadin:scale" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Unit Converter
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Unit Type Selection -->
        <div class="rounded-lg border p-4">
          <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:category" class="text-primary" />
            Category
          </Label>
          <Select v-model="unitType">
            <SelectTrigger class="bg-background flex w-full rounded-lg p-3 text-base font-medium">
              <Icon :icon="unitTypeIcons[unitType]" class="mr-2" />
              <SelectValue placeholder="Select unit type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="type in Object.values(UnitType)" :key="type" :value="type">
                <div class="flex items-center gap-2">
                  <Icon :icon="unitTypeIcons[type]" />
                  <span>{{ type.charAt(0).toUpperCase() + type.slice(1) }}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- From Unit -->
        <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
          <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:arrow-up-circle" class="text-primary" />
            From
          </Label>
          <div class="flex w-full flex-col gap-3 sm:flex-row">
            <Input
              ref="innerRef"
              v-model="inputValue"
              type="number"
              placeholder="Enter value"
              class="bg-background w-full rounded-lg p-3 text-lg font-medium sm:flex-1"
            />
            <Select v-model="inputUnit">
              <SelectTrigger
                class="bg-background w-full rounded-lg p-3 text-base font-medium sm:w-40 sm:flex-shrink-0"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="unit in getUnits(unitType)" :key="unit" :value="unit">
                  <span class="font-medium">{{ unit }}</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Swap Button -->
        <div class="flex w-full items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            class="h-10 w-10 rounded-full transition-transform hover:scale-110 hover:rotate-180"
            @click="swapUnits"
          >
            <Icon icon="mdi:swap-vertical" class="text-xl" />
          </Button>
        </div>

        <!-- To Unit -->
        <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
          <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:arrow-down-circle" class="text-primary" />
            To
          </Label>
          <div class="flex w-full flex-col gap-3 sm:flex-row">
            <div
              class="bg-primary/5 flex w-full items-center rounded-lg border-2 border-dashed p-3 sm:flex-1"
            >
              <span v-if="outputValue" class="w-full text-lg font-bold">
                {{ outputValue }}
              </span>
              <span v-else class="text-muted-foreground w-full text-base">
                Result will appear here
              </span>
            </div>
            <Select v-model="outputUnit">
              <SelectTrigger
                class="bg-background w-full rounded-lg p-3 text-base font-medium sm:w-40 sm:flex-shrink-0"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="unit in getUnits(unitType)" :key="unit" :value="unit">
                  <span class="font-medium">{{ unit }}</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Convert Button -->
        <Button @click="convertUnits" class="h-12 w-full text-lg font-semibold">
          <Icon icon="mdi:calculator-variant" class="mr-2" />
          Convert
        </Button>
      </CardContent>
    </Card>

    <Alert v-if="explanation" class="mt-4 w-full">
      <Icon icon="mdi:calculator" class="h-24 w-24 text-2xl" />
      <AlertTitle>Calculation path</AlertTitle>
      <AlertDescription>
        <div class="text-sm whitespace-pre-line">
          {{ explanation }}
        </div>
      </AlertDescription>
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { UnitType, UnitTypeIcons, UnitMap } from '@/enums/unitsEnum'

const innerRef = ref<HTMLInputElement | null>(null)
defineExpose({
  focus: () => innerRef.value?.focus(),
})
const unitType = ref<UnitType>(UnitType.LENGTH)
const inputValue = ref(0)
const outputValue = ref(0)
const inputUnit = ref('')
const outputUnit = ref('')
const explanation = ref('')

const unitTypeIcons = UnitTypeIcons
const unitMap = UnitMap

const getUnits = (type: UnitType) => {
  return Object.keys(unitMap[type] || {})
}

watch(
  [unitType],
  () => {
    inputUnit.value = getUnits(unitType.value)[0] || ''
    outputUnit.value = getUnits(unitType.value)[1] || ''
  },
  { immediate: true },
)

onMounted(() => {
  focusInput()

  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

function focusInput() {
  nextTick(() => {
    if (innerRef.value) {
      innerRef.value.focus()
    }
  })
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    convertUnits()
  } else if (document.activeElement !== innerRef.value) {
    focusInput()
  }
}

function swapUnits() {
  const temp = inputUnit.value
  inputUnit.value = outputUnit.value
  outputUnit.value = temp

  const tempValue = inputValue.value
  inputValue.value = outputValue.value
  outputValue.value = tempValue
}

function explainConversion(
  value: number,
  from: string,
  to: string,
  baseMap: Record<string, number>,
  baseName: string,
) {
  const baseValue = value * (baseMap[from] ?? 0)
  const result = baseValue / (baseMap[to] ?? 1)
  let explain = `${value} ${from} × ${baseMap[from]} (in ${baseName}) = ${baseValue} ${baseName}\n`
  explain += `${baseValue} ${baseName} ÷ ${baseMap[to]} (in ${baseName}) = ${result} ${to}`
  return { result, explain }
}

const convertUnits = () => {
  const value = inputValue.value
  const from = inputUnit.value
  const to = outputUnit.value
  const type = unitType.value
  let result = value
  let explain = ''

  if (type === UnitType.TEMPERATURE) {
    if (from === '°C' && to === '°F') {
      result = value * 1.8 + 32
      explain = `${value} °C × 1.8 + 32 = ${parseFloat(result.toFixed(6))} °F`
    } else if (from === '°F' && to === '°C') {
      result = (value - 32) / 1.8
      explain = `(${value} °F - 32) ÷ 1.8 = ${parseFloat(result.toFixed(6))} °C`
    } else if (from === '°C' && to === 'K') {
      result = value + 273.15
      explain = `${value} °C + 273.15 = ${parseFloat(result.toFixed(6))} K`
    } else if (from === 'K' && to === '°C') {
      result = value - 273.15
      explain = `${value} K - 273.15 = ${parseFloat(result.toFixed(6))} °C`
    } else if (from === '°F' && to === 'K') {
      result = (value - 32) / 1.8 + 273.15
      explain = `(${value} °F - 32) ÷ 1.8 + 273.15 = ${parseFloat(result.toFixed(6))} K`
    } else if (from === 'K' && to === '°F') {
      result = (value - 273.15) * 1.8 + 32
      explain = `(${value} K - 273.15) × 1.8 + 32 = ${parseFloat(result.toFixed(6))} °F`
    } else {
      result = value
      explain = `${value} ${from} = ${parseFloat(result.toFixed(6))} ${to}`
    }
  } else if (type === UnitType.FUELCONSUMPTION) {
    if (from === 'l/100km' && to === 'mpg') {
      result = 235.215 / value
      explain = `235.215 ÷ ${value} = ${parseFloat(result.toFixed(6))} mpg`
    } else if (from === 'mpg' && to === 'l/100km') {
      result = 235.215 / value
      explain = `235.215 ÷ ${value} = ${parseFloat(result.toFixed(6))} l/100km`
    } else if (from === 'l/100km' && to === 'km/l') {
      result = 100 / value
      explain = `100 ÷ ${value} = ${parseFloat(result.toFixed(6))} km/l`
    } else if (from === 'km/l' && to === 'l/100km') {
      result = 100 / value
      explain = `100 ÷ ${value} = ${parseFloat(result.toFixed(6))} l/100km`
    } else if (from === 'mpg' && to === 'km/l') {
      result = value * 0.425144
      explain = `${value} × 0.425144 = ${parseFloat(result.toFixed(6))} km/l`
    } else if (from === 'km/l' && to === 'mpg') {
      result = value / 0.425144
      explain = `${value} ÷ 0.425144 = ${parseFloat(result.toFixed(6))} mpg`
    } else {
      result = value
      explain = `${value} ${from} = ${parseFloat(result.toFixed(6))} ${to}`
    }
  } else {
    const baseMap = UnitMap[type]
    const baseName = Object.keys(baseMap)[0] || ''
    const r = explainConversion(value, from, to, baseMap, baseName)
    result = parseFloat(r.result.toFixed(6))
    explain = r.explain
  }

  outputValue.value = result
  explanation.value = explain || `${value} ${from} = ${result} ${to}`
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
