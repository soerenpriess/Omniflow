<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert between different fiat currencies using real-time exchange rates. Enter an amount,
      select your currencies, and get accurate conversions instantly with detailed rate information.
    </p>
    <Card class="route-transition-animation w-full max-w-lg rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mage:money-exchange" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- From Currency -->
        <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
          <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:arrow-up-circle" class="text-primary" />
            From
          </Label>
          <div class="flex w-full flex-col gap-3 sm:flex-row">
            <Input
              v-model="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              class="bg-background w-full rounded-lg p-3 text-lg font-medium sm:flex-1"
            />
            <Select v-model="fromCurrency">
              <SelectTrigger
                class="bg-background w-full rounded-lg p-3 text-base sm:w-40 sm:flex-shrink-0"
              >
                <SelectValue>
                  <span class="font-medium">{{ fromCurrency }}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in currencyList" :key="c" :value="c">
                  <span class="font-medium">{{ c }}</span>
                  <span class="text-muted-foreground ml-2 text-sm">
                    {{ fiatCurrencyNames[c] }}
                  </span>
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
            @click="swapCurrencies"
          >
            <Icon icon="mdi:swap-vertical" class="text-xl" />
          </Button>
        </div>

        <!-- To Currency -->
        <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
          <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:arrow-down-circle" class="text-primary" />
            To
          </Label>
          <div class="flex w-full flex-col gap-3 sm:flex-row">
            <div
              class="bg-primary/5 flex w-full items-center rounded-lg border-2 border-dashed p-3 sm:flex-1"
            >
              <span v-if="converted" class="w-full text-lg font-bold">
                {{ converted }}
              </span>
              <span v-else class="text-muted-foreground w-full text-base">
                Result will appear here
              </span>
            </div>
            <Select v-model="toCurrency">
              <SelectTrigger
                class="bg-background w-full rounded-lg p-3 text-base sm:w-40 sm:flex-shrink-0"
              >
                <SelectValue>
                  <span class="font-medium">{{ toCurrency }}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in currencyList" :key="c" :value="c">
                  <span class="font-medium">{{ c }}</span>
                  <span class="text-muted-foreground ml-2 text-sm">
                    {{ fiatCurrencyNames[c] }}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Convert Button -->
        <Button
          @click="convert"
          class="h-12 w-full text-lg font-semibold"
          :disabled="loading || !amount"
        >
          <Icon v-if="loading" icon="svg-spinners:ring-resize" class="mr-2" />
          <Icon v-else icon="mdi:currency-exchange" class="mr-2" />
          <span v-if="!loading">Convert</span>
          <span v-else>Converting...</span>
        </Button>
      </CardContent>
    </Card>

    <Alert v-if="error" class="mt-4 w-full">
      <Icon icon="mdi:alert" class="h-6 w-6 text-2xl" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <div class="text-sm whitespace-pre-line">{{ error }}</div>
      </AlertDescription>
    </Alert>
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
import { ref } from 'vue'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FiatCurrency, FiatCurrencyNames } from '@/enums/fiatCurrencyEnum'
import { fetchExchangeRate } from '@/services/currencyService'

const amount = ref<number | undefined>(1)
const fromCurrency = ref<FiatCurrency>(FiatCurrency.EUR)
const toCurrency = ref<FiatCurrency>(FiatCurrency.USD)
const converted = ref('')
const explanation = ref('')
const loading = ref(false)
const error = ref('')
const currencyList = Object.values(FiatCurrency)
const fiatCurrencyNames = FiatCurrencyNames

async function convert() {
  if (!amount.value || !fromCurrency.value || !toCurrency.value) return
  loading.value = true
  error.value = ''
  converted.value = ''

  try {
    const rate = await fetchExchangeRate(fromCurrency.value, toCurrency.value)

    const result = amount.value * rate
    converted.value = result.toFixed(4)

    explanation.value =
      `${amount.value} ${fiatCurrencyNames[fromCurrency.value]} (${fromCurrency.value})` +
      ` × ${rate.toFixed(4)} (exchange rate)\n` +
      `= ${result.toFixed(6)} ${fiatCurrencyNames[toCurrency.value]} (${toCurrency.value})`
  } catch (e: any) {
    error.value = e.message || 'Conversion failed.'
    converted.value = ''
    explanation.value = ''
  } finally {
    loading.value = false
  }
}

function swapCurrencies() {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
}
</script>
