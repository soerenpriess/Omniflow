<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert between different cryptocurrencies in real-time.
    </p>
    <Card class="route-transition-animation w-full max-w-lg rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="bx:bitcoin" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Crypto Converter
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- From Crypto -->
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
              class="bg-background w-full rounded-lg p-3 text-lg font-medium sm:flex-1"
            />
            <Combobox v-model="fromCurrency">
              <ComboboxAnchor as-child>
                <ComboboxTrigger as-child>
                  <Button
                    variant="outline"
                    class="w-full justify-between text-left font-medium sm:w-40 sm:flex-shrink-0"
                  >
                    {{ fromCurrency ? fromCurrency.value.toUpperCase() : 'Select' }}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </ComboboxTrigger>
              </ComboboxAnchor>
              <ComboboxList class="w-full">
                <div class="relative items-center">
                  <ComboboxInput
                    class=""
                    placeholder="Search currency..."
                    @input="onFromQueryChange"
                  />
                </div>
                <ComboboxEmpty>No currency found.</ComboboxEmpty>
                <ComboboxGroup class="h-92 overflow-auto">
                  <ComboboxItem
                    v-for="currency in filteredFromCurrencyList"
                    :key="currency.value"
                    :value="currency"
                  >
                    <p class="font-medium">{{ currency.value.toUpperCase() }}</p>
                    <p class="text-muted-foreground ml-2 text-sm">{{ currency.label }}</p>
                    <ComboboxItemIndicator>
                      <Check class="ml-auto h-4 w-4" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
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

        <!-- To Crypto -->
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
            <Combobox v-model="toCurrency">
              <ComboboxAnchor as-child>
                <ComboboxTrigger as-child>
                  <Button
                    variant="outline"
                    class="w-full justify-between text-left font-medium sm:w-40 sm:flex-shrink-0"
                  >
                    {{ toCurrency ? toCurrency.value.toUpperCase() : 'Select' }}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </ComboboxTrigger>
              </ComboboxAnchor>
              <ComboboxList class="w-full">
                <div class="relative w-full max-w-xl items-center">
                  <ComboboxInput
                    class=""
                    placeholder="Search currency..."
                    @input="onToQueryChange"
                  />
                  <span class="absolute inset-y-0 left-0 flex items-center justify-center px-3">
                    <Search class="text-muted-foreground size-4" />
                  </span>
                </div>
                <ComboboxEmpty>No currency found.</ComboboxEmpty>
                <ComboboxGroup class="h-92 overflow-auto">
                  <ComboboxItem
                    v-for="currency in filteredToCurrencyList"
                    :key="currency.value"
                    :value="currency"
                  >
                    <p class="font-medium">{{ currency.value.toUpperCase() }}</p>
                    <p class="text-muted-foreground ml-2 text-sm">{{ currency.label }}</p>
                    <ComboboxItemIndicator>
                      <Check class="ml-auto h-4 w-4" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
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
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Icon } from '@iconify/vue'
import { Check, ChevronsUpDown, Search } from 'lucide-vue-next'
import { CryptoCurrency, cryptoCurrencyNames } from '@/enums/cryptoCurrencyEnum'
import { fetchExchangeRate } from '@/services/currencyService'

const amount = ref<number | undefined>(1)

const currencyOptions = Object.values(CryptoCurrency).map((code) => ({
  value: code,
  label: cryptoCurrencyNames[code as CryptoCurrency] ?? code.toUpperCase(),
}))

const fromCurrency = ref<(typeof currencyOptions)[0] | null>(
  currencyOptions.find((c) => c.value === CryptoCurrency.BTC) ?? null,
)
const toCurrency = ref<(typeof currencyOptions)[0] | null>(
  currencyOptions.find((c) => c.value === CryptoCurrency.ETH) ?? null,
)

const fromQuery = ref('')
const toQuery = ref('')

const converted = ref('')
const explanation = ref('')
const loading = ref(false)
const error = ref('')

const filteredFromCurrencyList = computed(() => {
  if (!fromQuery.value) return currencyOptions
  return currencyOptions.filter(
    (c) =>
      c.label.toLowerCase().includes(fromQuery.value.toLowerCase()) ||
      c.value.toLowerCase().includes(fromQuery.value.toLowerCase()),
  )
})

const filteredToCurrencyList = computed(() => {
  if (!toQuery.value) return currencyOptions
  return currencyOptions.filter(
    (c) =>
      c.label.toLowerCase().includes(toQuery.value.toLowerCase()) ||
      c.value.toLowerCase().includes(toQuery.value.toLowerCase()),
  )
})

async function convert() {
  if (!amount.value || !fromCurrency.value || !toCurrency.value) return
  loading.value = true
  error.value = ''
  converted.value = ''

  try {
    const rate = await fetchExchangeRate(fromCurrency.value.value, toCurrency.value.value)
    const result = amount.value * rate
    converted.value = result.toFixed(6)

    explanation.value =
      `${amount.value} ${fromCurrency.value.label} (${fromCurrency.value.value.toUpperCase()})` +
      ` × ${rate.toFixed(6)} (exchange rate)\n` +
      `= ${result.toFixed(6)} ${toCurrency.value.label} (${toCurrency.value.value.toUpperCase()})`
  } catch (e: any) {
    error.value = e.message || 'Conversion failed.'
    converted.value = ''
    explanation.value = ''
  } finally {
    loading.value = false
  }
}

function onFromQueryChange(event: Event) {
  const target = event.target as HTMLInputElement
  fromQuery.value = target.value
}

function onToQueryChange(event: Event) {
  const target = event.target as HTMLInputElement
  toQuery.value = target.value
}

function swapCurrencies() {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
}
</script>
