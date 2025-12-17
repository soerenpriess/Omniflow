<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Create strong, cryptographically secure passwords with customizable length and character
      types. Includes security analysis and brute-force resistance estimates.
    </p>
    <Card class="route-transition-animation w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="material-symbols:password" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Password Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Password Length -->
        <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
          <Label for="length" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:ruler" class="text-primary" />
            Length
          </Label>
          <Input
            id="length"
            type="number"
            min="4"
            max="64"
            v-model.number="length"
            class="bg-background w-full text-lg font-medium"
            @input="updateSecurityLevel"
          />
        </div>

        <!-- Character Types -->
        <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
          <Label class="mb-3 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:checkbox-multiple-marked" class="text-primary" />
            Character Types
          </Label>
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="useLower" @change="updateSecurityLevel" />
              Lowercase
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="useUpper" @change="updateSecurityLevel" />
              Uppercase
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="useNumbers" @change="updateSecurityLevel" />
              Numbers
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="useSymbols" @change="updateSecurityLevel" />
              Symbols
            </label>
          </div>
        </div>
        <!-- Security Level Indicator -->
        <div class="from-primary/5 to-primary/10 mb-4 rounded-lg border bg-gradient-to-br p-4">
          <div class="flex items-center gap-2">
            <span class="text-sm">Security level:</span>
            <span
              :class="{
                'text-green-600': securityLevel === 2,
                'text-amber-600': securityLevel === 1,
                'text-red-600': securityLevel === 0,
              }"
            >
              {{ securityText }}
            </span>
          </div>
          <div class="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              class="h-full rounded-full transition-all duration-300"
              :style="{
                width: `${securityPercent}%`,
                backgroundColor: securityColor,
              }"
            ></div>
          </div>
        </div>

        <!-- Generate Button -->
        <Button
          class="h-12 w-full text-lg font-semibold"
          @click="generatePassword"
          :disabled="!anySelected"
        >
          <Icon icon="mdi:refresh" class="mr-2" />
          Generate
        </Button>

        <!-- Password Result -->
        <div v-if="password" class="mt-4 flex flex-col gap-2">
          <Label>Password</Label>
          <Input v-model="password" readonly class="w-full font-mono" />
          <Button size="sm" variant="outline" @click="copyToClipboard(password)">
            {{ copied ? 'Copied!' : 'Copy' }}
          </Button>
        </div>
        <!-- Info Card -->
        <Transition name="fade">
          <Card
            v-if="password"
            class="mt-6 w-full rounded-xl border p-4 text-sm shadow-md transition-all"
          >
            <CardHeader>
              <CardTitle class="text-base font-semibold">Brute-Force Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="mb-2">
                <span class="font-medium">Possible combinations:</span>
                <span class="ml-2 font-mono">{{ formattedCombinations }}</span>
              </div>
              <div class="mb-2">
                <span class="font-medium">Speed (supercomputer):</span>
                <span class="ml-2 font-mono">
                  {{ formatNumber(attemptsPerSecond) }} passwords/sec
                </span>
              </div>
              <div class="mb-2">
                <span class="font-medium">Estimated time to crack:</span>
                <span class="ml-2 font-mono">{{ crackTimeDisplay }}</span>
              </div>
              <div class="mt-2 text-xs text-gray-600">
                <p>
                  The estimate is based on a supercomputer capable of testing approximately
                  {{ formatNumber(attemptsPerSecond) }} passwords per second.<br />
                  The more diverse the character types and the longer the password, the more secure
                  it is against brute-force attacks.
                </p>
              </div>
            </CardContent>
          </Card>
        </Transition>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icon } from '@iconify/vue'

const length = ref(16)
const useLower = ref(true)
const useUpper = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(true)
const password = ref('')
const copied = ref(false)

const anySelected = computed(
  () => useLower.value || useUpper.value || useNumbers.value || useSymbols.value,
)

// Security assessment
const securityLevel = ref(0)
const securityText = computed(() => {
  if (securityLevel.value === 2) return 'Very strong'
  if (securityLevel.value === 1) return 'Medium'
  return 'Weak'
})
const securityColor = computed(() => {
  if (securityLevel.value === 2) return '#16a34a' // green
  if (securityLevel.value === 1) return '#d97706' // orange
  return '#dc2626' // red
})
const securityPercent = computed(() => {
  if (securityLevel.value === 2) return 100
  if (securityLevel.value === 1) return 65
  return 30
})

function updateSecurityLevel() {
  let score = 0
  const variety = [useLower.value, useUpper.value, useNumbers.value, useSymbols.value].filter(
    Boolean,
  ).length
  if (length.value >= 12 && variety >= 3) score = 2
  else if (length.value >= 8 && variety >= 2) score = 1
  else score = 0
  securityLevel.value = score
}
updateSecurityLevel()

function generatePassword() {
  const lowers = 'abcdefghijklmnopqrstuvwxyz'
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?'
  let chars = ''
  if (useLower.value) chars += lowers
  if (useUpper.value) chars += uppers
  if (useNumbers.value) chars += numbers
  if (useSymbols.value) chars += symbols
  if (!chars) return
  let result = ''
  const array = new Uint32Array(length.value)
  window.crypto.getRandomValues(array)
  for (let i = 0; i < length.value; i++) {
    result += chars[array[i] % chars.length]
  }
  password.value = result
  updateSecurityLevel()
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

// --- Brute-force calculation ---
const attemptsPerSecond = 1_000_000_000_000 // 1 trillion/sec

const charsetSize = computed(() => {
  let size = 0
  if (useLower.value) size += 26
  if (useUpper.value) size += 26
  if (useNumbers.value) size += 10
  if (useSymbols.value) size += 28
  return size
})

const possibleCombinations = computed(() => {
  if (charsetSize.value === 0) return 0n
  return BigInt(charsetSize.value) ** BigInt(length.value)
})

function formatBigInt(num: bigint): string {
  if (num < 1_000_000_000_000_000n) return num.toLocaleString('en-US')
  const exp = num.toString().length - 1
  const mantissa = Number(num / 10n ** BigInt(exp - 2)) / 100
  return mantissa.toFixed(2) + 'e+' + exp
}

const formattedCombinations = computed(() => formatBigInt(possibleCombinations.value))

const crackTimeSeconds = computed(() => {
  if (possibleCombinations.value === 0n) return 0
  return Number(possibleCombinations.value / 2n) / attemptsPerSecond
})

function formatDuration(seconds: number): string {
  if (seconds < 1) return '< 1 second'
  const units = [
    { label: 'years', secs: 365.25 * 24 * 3600 },
    { label: 'months', secs: 30.44 * 24 * 3600 },
    { label: 'days', secs: 24 * 3600 },
    { label: 'hours', secs: 3600 },
    { label: 'minutes', secs: 60 },
    { label: 'seconds', secs: 1 },
  ]
  let res = []
  for (const { label, secs } of units) {
    if (seconds >= secs) {
      const val = Math.floor(seconds / secs)
      seconds -= val * secs
      res.push(`${val} ${label}`)
    }
  }
  return res.length ? res.join(', ') : '< 1 second'
}

const crackTimeDisplay = computed(() => {
  if (crackTimeSeconds.value === 0) return '-'
  if (crackTimeSeconds.value > 1000 * 365.25 * 24 * 3600) return 'more than 1000 years'
  return formatDuration(crackTimeSeconds.value)
})

function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
