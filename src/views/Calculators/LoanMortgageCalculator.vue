<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Calculate your loan or mortgage payments with detailed breakdown.
    </p>
    <Card class="route-transition-animation w-full max-w-xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:home-currency-usd" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Loan / Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <!-- Loan/Mortgage Inputs -->
      <CardContent>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="amount" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:cash" class="text-primary" />Loan Amount
            </Label>
            <Input
              id="amount"
              v-model.number="amount"
              type="number"
              min="0"
              placeholder="Enter loan amount"
              class="bg-background text-lg font-medium"
            />
          </div>
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="rate" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:percent" class="text-primary" />Interest Rate (%)
            </Label>
            <Input
              id="rate"
              v-model.number="rate"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 3.5"
              class="bg-background text-lg font-medium"
            />
          </div>
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="years" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:calendar-range" class="text-primary" />Term (years)
            </Label>
            <Input
              id="years"
              v-model.number="years"
              type="number"
              min="1"
              placeholder="e.g., 30"
              class="bg-background text-lg font-medium"
            />
          </div>
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="type" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:calendar-multiselect" class="text-primary" />Payment Type
            </Label>
            <Select v-model="paymentType">
              <SelectTrigger class="bg-background text-base font-medium">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button @click="calculate" class="mt-6 h-12 w-full text-lg font-semibold">
          <Icon icon="mdi:calculator-variant" class="mr-2" />
          Calculate
        </Button>
      </CardContent>
    </Card>

    <Card
      v-if="payment > 0"
      class="border-primary/20 from-primary/5 to-primary/10 mt-4 w-full max-w-xl rounded-xl border-2 bg-gradient-to-br p-4 shadow-lg sm:p-6"
    >
      <!-- Summary -->
      <div class="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Icon icon="mdi:information-outline" class="text-primary text-2xl" />
        Loan Overview
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <!-- Amount -->
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2 text-gray-600">
            <Icon icon="mdi:bank" class="text-lg" /> Amount:
          </span>
          <span class="font-bold">
            {{
              amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
            $
          </span>
        </div>
        <!-- Interest Rate -->
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2 text-gray-600">
            <Icon icon="mdi:percent" class="text-lg" /> Interest Rate:
          </span>
          <span class="font-bold">
            {{
              rate.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
            %
          </span>
        </div>
        <!-- Term -->
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2 text-gray-600">
            <Icon icon="mdi:calendar-range" class="text-lg" /> Term:
          </span>
          <span class="font-bold"> {{ years }} years </span>
        </div>
        <!-- Payment Interval -->
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2 text-gray-600">
            <Icon icon="mdi:calendar-multiselect" class="text-lg" /> Payment Interval:
          </span>
          <span class="font-bold capitalize">
            {{ paymentType === 'monthly' ? 'monthly' : 'yearly' }}
          </span>
        </div>
      </div>

      <hr class="my-2 border-blue-200" />

      <!-- Payments -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between text-lg">
          <span class="flex items-center gap-2 font-medium text-gray-600">
            <Icon icon="mdi:cash-multiple" class="text-xl" />
            Payment per {{ paymentType === 'monthly' ? 'month' : 'year' }}:
          </span>
          <span class="font-bold">
            {{
              (paymentType === 'monthly' ? monthly : yearly).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 3,
              })
            }}
            $
          </span>
        </div>
        <div class="flex items-center justify-between text-lg">
          <span class="flex items-center gap-2 font-medium text-gray-600">
            <Icon icon="mdi:cash" class="text-xl" />
            Total Repayment:
          </span>
          <span class="font-bold">
            {{
              totalPayment.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 3,
              })
            }}
            $
          </span>
        </div>
        <div class="flex items-center justify-between text-lg">
          <span class="flex items-center gap-2 font-medium text-gray-600">
            <Icon icon="mdi:chart-line" class="text-xl" />
            Total Interest:
          </span>
          <span class="font-bold">
            {{
              totalInterest.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 3,
              })
            }}
            $
          </span>
        </div>
        <div class="flex items-center justify-between text-lg">
          <span class="flex items-center gap-2 font-medium text-gray-600">
            <Icon icon="mdi:percent-circle" class="text-xl" />
            Interest Percentage:
          </span>
          <span class="font-bold">
            {{
              ((totalInterest / amount) * 100).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
            %
          </span>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="mt-3 text-sm text-gray-500">
        <ul class="ml-6 list-disc">
          <li>The total repayment includes the loan amount and all interest payments.</li>
          <li>The interest percentage shows the share of the loan sum paid as interest.</li>
          <li>A longer term or higher interest rate increases your total interest payment.</li>
        </ul>
      </div>
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Icon } from '@iconify/vue'

const amount = ref(0)
const rate = ref(3.5)
const years = ref(30)
const paymentType = ref<'monthly' | 'yearly'>('monthly')
const payment = ref(0)
const totalPayment = ref(0)
const totalInterest = ref(0)
const monthly = ref(0)
const yearly = ref(0)

function calculate() {
  const principal = amount.value
  const interestRate = rate.value / 100
  const n = years.value
  const periods = paymentType.value === 'monthly' ? n * 12 : n
  const r = paymentType.value === 'monthly' ? interestRate / 12 : interestRate

  if (principal > 0 && r >= 0 && periods > 0) {
    const pmt = r === 0 ? principal / periods : (principal * r) / (1 - Math.pow(1 + r, -periods))
    payment.value = pmt
    monthly.value = paymentType.value === 'monthly' ? pmt : pmt / 12
    yearly.value = paymentType.value === 'yearly' ? pmt : pmt * 12
    totalPayment.value = pmt * periods
    totalInterest.value = totalPayment.value - principal
  }
}
</script>
