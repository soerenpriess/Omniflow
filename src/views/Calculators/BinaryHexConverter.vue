<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert between Binary, Decimal, and Hexadecimal
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:numeric" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Binary / Hex Converter
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Input Type -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Input Type</Label>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button
              @click="inputType = 'binary'"
              :variant="inputType === 'binary' ? 'default' : 'outline'"
              class="h-9 text-xs sm:h-10 sm:text-sm"
            >
              <Icon icon="mdi:numeric-0-box" class="mr-1.5 h-4 w-4" />
              Binary
            </Button>
            <Button
              @click="inputType = 'decimal'"
              :variant="inputType === 'decimal' ? 'default' : 'outline'"
              class="h-9 text-xs sm:h-10 sm:text-sm"
            >
              <Icon icon="mdi:numeric" class="mr-1.5 h-4 w-4" />
              Decimal
            </Button>
            <Button
              @click="inputType = 'hex'"
              :variant="inputType === 'hex' ? 'default' : 'outline'"
              class="h-9 text-xs sm:h-10 sm:text-sm"
            >
              <Icon icon="mdi:alpha-x-box" class="mr-1.5 h-4 w-4" />
              Hexadecimal
            </Button>
            <Button
              @click="inputType = 'octal'"
              :variant="inputType === 'octal' ? 'default' : 'outline'"
              class="h-9 text-xs sm:h-10 sm:text-sm"
            >
              <Icon icon="mdi:numeric-8-box" class="mr-1.5 h-4 w-4" />
              Octal
            </Button>
          </div>
        </div>

        <!-- Input -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs sm:text-sm">
              {{
                inputType === 'binary'
                  ? 'Binary'
                  : inputType === 'decimal'
                    ? 'Decimal'
                    : inputType === 'hex'
                      ? 'Hexadecimal'
                      : 'Octal'
              }}
              Input
            </Label>
            <Button @click="input = ''" variant="ghost" size="sm" class="h-6 text-xs">
              <Icon icon="mdi:close" class="mr-1 h-3 w-3" />
              Clear
            </Button>
          </div>
          <Input
            v-model="input"
            @input="convert"
            :placeholder="getPlaceholder()"
            class="h-12 font-mono text-base sm:h-14 sm:text-lg"
          />
          <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
        </div>

        <!-- Convert Button -->
        <Button @click="convert" class="h-9 w-full text-xs sm:h-10 sm:text-sm">
          <Icon icon="mdi:swap-horizontal" class="mr-2 h-4 w-4" />
          Convert
        </Button>

        <!-- Results -->
        <div v-if="results" class="space-y-2 sm:space-y-3">
          <!-- Binary -->
          <div class="bg-muted/30 rounded-lg border p-2 sm:p-3">
            <div class="mb-1.5 flex items-center justify-between">
              <Label class="text-xs font-semibold sm:text-sm">Binary (Base 2)</Label>
              <Button
                @click="copyToClipboard(results.binary, 'binary')"
                variant="ghost"
                size="sm"
                class="h-6 text-xs"
              >
                <Icon
                  :icon="copiedType === 'binary' ? 'mdi:check' : 'mdi:content-copy'"
                  class="mr-1 h-3 w-3"
                />
                {{ copiedType === 'binary' ? 'Copied!' : 'Copy' }}
              </Button>
            </div>
            <div class="bg-background rounded p-2 font-mono text-xs break-all sm:text-sm">
              {{ results.binary }}
            </div>
          </div>

          <!-- Decimal -->
          <div class="bg-muted/30 rounded-lg border p-2 sm:p-3">
            <div class="mb-1.5 flex items-center justify-between">
              <Label class="text-xs font-semibold sm:text-sm">Decimal (Base 10)</Label>
              <Button
                @click="copyToClipboard(results.decimal, 'decimal')"
                variant="ghost"
                size="sm"
                class="h-6 text-xs"
              >
                <Icon
                  :icon="copiedType === 'decimal' ? 'mdi:check' : 'mdi:content-copy'"
                  class="mr-1 h-3 w-3"
                />
                {{ copiedType === 'decimal' ? 'Copied!' : 'Copy' }}
              </Button>
            </div>
            <div class="bg-background rounded p-2 font-mono text-xs break-all sm:text-sm">
              {{ results.decimal }}
            </div>
          </div>

          <!-- Hexadecimal -->
          <div class="bg-muted/30 rounded-lg border p-2 sm:p-3">
            <div class="mb-1.5 flex items-center justify-between">
              <Label class="text-xs font-semibold sm:text-sm">Hexadecimal (Base 16)</Label>
              <Button
                @click="copyToClipboard(results.hex, 'hex')"
                variant="ghost"
                size="sm"
                class="h-6 text-xs"
              >
                <Icon
                  :icon="copiedType === 'hex' ? 'mdi:check' : 'mdi:content-copy'"
                  class="mr-1 h-3 w-3"
                />
                {{ copiedType === 'hex' ? 'Copied!' : 'Copy' }}
              </Button>
            </div>
            <div class="bg-background rounded p-2 font-mono text-xs break-all sm:text-sm">
              {{ results.hex }}
            </div>
          </div>

          <!-- Octal (Bonus) -->
          <div class="bg-muted/30 rounded-lg border p-2 sm:p-3">
            <div class="mb-1.5 flex items-center justify-between">
              <Label class="text-xs font-semibold sm:text-sm">Octal (Base 8)</Label>
              <Button
                @click="copyToClipboard(results.octal, 'octal')"
                variant="ghost"
                size="sm"
                class="h-6 text-xs"
              >
                <Icon
                  :icon="copiedType === 'octal' ? 'mdi:check' : 'mdi:content-copy'"
                  class="mr-1 h-3 w-3"
                />
                {{ copiedType === 'octal' ? 'Copied!' : 'Copy' }}
              </Button>
            </div>
            <div class="bg-background rounded p-2 font-mono text-xs break-all sm:text-sm">
              {{ results.octal }}
            </div>
          </div>
        </div>

        <!-- Reference Table -->
        <div class="bg-muted/30 rounded-lg border p-2 sm:p-3">
          <Label class="mb-2 text-xs font-semibold sm:text-sm">Quick Reference (0-15)</Label>
          <div class="grid grid-cols-4 gap-1 text-center text-[10px] sm:text-xs">
            <div class="font-semibold">Dec</div>
            <div class="font-semibold">Bin</div>
            <div class="font-semibold">Oct</div>
            <div class="font-semibold">Hex</div>
            <template v-for="i in 16" :key="i">
              <div>{{ i - 1 }}</div>
              <div class="font-mono">{{ (i - 1).toString(2).padStart(4, '0') }}</div>
              <div class="font-mono">{{ (i - 1).toString(8) }}</div>
              <div class="font-mono">{{ (i - 1).toString(16).toUpperCase() }}</div>
            </template>
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
import { Icon } from '@iconify/vue'

const inputType = ref<'binary' | 'decimal' | 'hex' | 'octal'>('decimal')
const input = ref('')
const error = ref('')
const copiedType = ref<string>('')

interface Results {
  binary: string
  decimal: string
  hex: string
  octal: string
}

const results = ref<Results | null>(null)

function getPlaceholder(): string {
  switch (inputType.value) {
    case 'binary':
      return 'e.g., 1010'
    case 'decimal':
      return 'e.g., 42'
    case 'hex':
      return 'e.g., 2A or 0x2A'
    case 'octal':
      return 'e.g., 52 or 0o52'
  }
}

function convert() {
  error.value = ''
  const value = input.value.trim()

  if (!value) {
    results.value = null
    return
  }

  try {
    let decimal: number

    switch (inputType.value) {
      case 'binary':
        if (!/^[01]+$/.test(value)) {
          error.value = 'Invalid binary number (only 0 and 1 allowed)'
          results.value = null
          return
        }
        decimal = parseInt(value, 2)
        break
      case 'decimal':
        if (!/^\d+$/.test(value)) {
          error.value = 'Invalid decimal number (only digits allowed)'
          results.value = null
          return
        }
        decimal = parseInt(value, 10)
        break
      case 'hex':
        const hexValue = value.replace(/^0x/i, '')
        if (!/^[0-9a-f]+$/i.test(hexValue)) {
          error.value = 'Invalid hexadecimal number (only 0-9 and A-F allowed)'
          results.value = null
          return
        }
        decimal = parseInt(hexValue, 16)
        break
      case 'octal':
        const octalValue = value.replace(/^0o/i, '')
        if (!/^[0-7]+$/.test(octalValue)) {
          error.value = 'Invalid octal number (only 0-7 allowed)'
          results.value = null
          return
        }
        decimal = parseInt(octalValue, 8)
        break
    }

    if (isNaN(decimal)) {
      error.value = 'Invalid input'
      results.value = null
      return
    }

    results.value = {
      binary: decimal.toString(2),
      decimal: decimal.toString(10),
      hex: '0x' + decimal.toString(16).toUpperCase(),
      octal: '0o' + decimal.toString(8),
    }
  } catch (err) {
    error.value = 'Conversion error'
    results.value = null
  }
}

function copyToClipboard(text: string, type: string) {
  navigator.clipboard.writeText(text)
  copiedType.value = type
  setTimeout(() => {
    copiedType.value = ''
  }, 1500)
}
</script>
