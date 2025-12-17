<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert between Roman numerals and Arabic numbers. Works with numbers from 1 to 3999.
    </p>
    <Card class="route-transition-animation w-full max-w-xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:roman-numeral-7" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Roman Numeral Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <!-- Input Arabic Number -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="arabic" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:numeric" class="text-primary" />
              Arabic Number (1-3999)
            </Label>
            <Input
              id="arabic"
              v-model.number="arabicInput"
              @input="convertToRoman"
              type="number"
              min="1"
              max="3999"
              placeholder="Enter a number..."
              class="bg-background text-lg font-medium"
            />
          </div>

          <!-- Swap Icon -->
          <div class="flex items-center justify-center">
            <Icon icon="mdi:swap-vertical" class="text-primary h-8 w-8" />
          </div>

          <!-- Input Roman Numeral -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="roman" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:alpha" class="text-primary" />
              Roman Numeral
            </Label>
            <Input
              id="roman"
              v-model="romanInput"
              @input="convertToArabic"
              type="text"
              placeholder="Enter Roman numeral..."
              class="bg-background text-lg font-medium uppercase"
            />
          </div>

          <!-- Result Display -->
          <div
            v-if="result"
            class="border-primary/20 from-primary/5 to-primary/10 rounded-lg border-2 bg-gradient-to-br p-6"
          >
            <div class="text-center">
              <p class="text-muted-foreground mb-2 text-sm">Conversion Result:</p>
              <p class="text-primary text-4xl font-bold">{{ result }}</p>
            </div>
          </div>
          <div class="bg-muted/30 rounded-lg border p-4">
            <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:information" class="text-primary" />
              Roman Numeral Guide
            </Label>
            <div class="grid grid-cols-7 gap-2 text-center text-xs">
              <div
                v-for="symbol in romanSymbols"
                :key="symbol.roman"
                class="bg-background rounded p-2"
              >
                <p class="font-bold">{{ symbol.roman }}</p>
                <p class="text-muted-foreground">{{ symbol.value }}</p>
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
import { Icon } from '@iconify/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const arabicInput = ref<number | null>(null)
const romanInput = ref('')
const result = ref('')

const romanSymbols = [
  { roman: 'I', value: 1 },
  { roman: 'V', value: 5 },
  { roman: 'X', value: 10 },
  { roman: 'L', value: 50 },
  { roman: 'C', value: 100 },
  { roman: 'D', value: 500 },
  { roman: 'M', value: 1000 },
]

const romanValues: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
}

function convertToRoman() {
  romanInput.value = ''
  const num = arabicInput.value

  if (!num || num < 1 || num > 3999) {
    result.value = ''
    return
  }

  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

  let remaining = num
  let roman = ''

  for (let i = 0; i < values.length; i++) {
    while (remaining >= values[i]) {
      roman += symbols[i]
      remaining -= values[i]
    }
  }

  result.value = roman
  romanInput.value = roman
}

function convertToArabic() {
  arabicInput.value = null
  const roman = romanInput.value.toUpperCase().trim()

  if (!roman || !/^[IVXLCDM]+$/.test(roman)) {
    result.value = ''
    return
  }

  let total = 0

  for (let i = 0; i < roman.length; i++) {
    const current = romanValues[roman[i]]
    const next = romanValues[roman[i + 1]]

    if (next && current < next) {
      total -= current
    } else {
      total += current
    }
  }

  if (total < 1 || total > 3999) {
    result.value = 'Invalid'
    return
  }

  result.value = total.toString()
  arabicInput.value = total
}
</script>
