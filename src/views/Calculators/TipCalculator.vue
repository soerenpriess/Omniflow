<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Calculate tips and split bills easily. Enter your bill amount, tip percentage, and number of
      people to see the total amount and cost per person instantly.
    </p>
    <Card class="route-transition-animation w-full max-w-lg rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:cash-multiple" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Tip Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Bill Amount Input -->
          <div
            class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all sm:col-span-2"
          >
            <Label for="bill" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:receipt-text" class="text-primary" />
              Bill Amount
            </Label>
            <Input
              id="bill"
              v-model.number="bill"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter bill amount"
              class="bg-background text-lg font-medium"
            />
          </div>

          <!-- Tip Percentage Input -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="tip" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:percent" class="text-primary" />
              Tip (%)
            </Label>
            <Input
              id="tip"
              v-model.number="tip"
              type="number"
              min="0"
              placeholder="e.g., 15"
              class="bg-background text-lg font-medium"
            />
          </div>

          <!-- Number of People Input -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="people" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:account-group" class="text-primary" />
              Number of People
            </Label>
            <Input
              id="people"
              v-model.number="people"
              type="number"
              min="1"
              placeholder="e.g., 2"
              class="bg-background text-lg font-medium"
            />
          </div>
        </div>

        <!-- Calculate Button -->
        <Button @click="calculate" class="mt-6 h-12 w-full text-lg font-semibold">
          <Icon icon="mdi:calculator-variant" class="mr-2" />
          Calculate
        </Button>

        <!-- Result Display -->
        <div
          v-if="total > 0"
          class="border-primary/20 from-primary/5 to-primary/10 mt-6 space-y-3 rounded-lg border-2 bg-gradient-to-br p-4"
        >
          <div class="flex items-center justify-between text-lg">
            <span class="flex items-center gap-2 font-medium">
              <Icon icon="mdi:cash-plus" class="text-primary" />
              Total Tip:
            </span>
            <span class="text-xl font-bold">${{ tipAmount.toFixed(2) }}</span>
          </div>
          <div class="flex items-center justify-between text-lg">
            <span class="flex items-center gap-2 font-medium">
              <Icon icon="mdi:cash-multiple" class="text-primary" />
              Total Amount:
            </span>
            <span class="text-primary text-2xl font-bold">${{ total.toFixed(2) }}</span>
          </div>
          <div v-if="people > 1" class="flex items-center justify-between text-lg">
            <span class="flex items-center gap-2 font-medium">
              <Icon icon="mdi:account-cash" class="text-primary" />
              Per Person:
            </span>
            <span class="text-xl font-bold">${{ perPerson.toFixed(2) }}</span>
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

const bill = ref(0)
const tip = ref(15)
const people = ref(1)
const tipAmount = ref(0)
const total = ref(0)
const perPerson = ref(0)

function calculate() {
  tipAmount.value = bill.value * (tip.value / 100)
  total.value = bill.value + tipAmount.value
  perPerson.value = total.value / people.value
}
</script>
