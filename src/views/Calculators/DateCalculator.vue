<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Calculate the difference between two dates or add/subtract time from a specific date.
    </p>
    <Card class="route-transition-animation w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:calendar-range" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Date Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="difference">Date Difference</TabsTrigger>
            <TabsTrigger value="add-subtract">Add/Subtract Time</TabsTrigger>
          </TabsList>

          <!-- Date Difference Tab -->
          <TabsContent value="difference" class="mt-4 space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label class="flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:calendar-start" class="text-primary" />
                  Start Date
                </Label>
                <Popover v-model:open="startDateOpen">
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="
                        cn(
                          'w-full justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground',
                        )
                      "
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{ startDate ? startDate.toDateString() : 'Pick a date' }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      v-model="startDateValue"
                      :initial-focus="true"
                      @update:model-value="startDateOpen = false"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div class="space-y-2">
                <Label class="flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:calendar-end" class="text-primary" />
                  End Date
                </Label>
                <Popover v-model:open="endDateOpen">
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="
                        cn(
                          'w-full justify-start text-left font-normal',
                          !endDate && 'text-muted-foreground',
                        )
                      "
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{ endDate ? endDate.toDateString() : 'Pick a date' }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      v-model="endDateValue"
                      :initial-focus="true"
                      @update:model-value="endDateOpen = false"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button @click="calculateDiff" class="h-12 w-full text-lg font-semibold">
              <Icon icon="mdi:calculator-variant" class="mr-2" />
              Calculate Difference
            </Button>

            <div v-if="diff" ref="diffResultRef" class="mt-4 space-y-3">
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div class="bg-muted/50 rounded-lg border p-3 text-center">
                  <p class="text-muted-foreground text-xs">Years</p>
                  <p class="text-2xl font-bold">{{ diff.years }}</p>
                </div>
                <div class="bg-muted/50 rounded-lg border p-3 text-center">
                  <p class="text-muted-foreground text-xs">Months</p>
                  <p class="text-2xl font-bold">{{ diff.months }}</p>
                </div>
                <div class="bg-muted/50 rounded-lg border p-3 text-center">
                  <p class="text-muted-foreground text-xs">Days</p>
                  <p class="text-2xl font-bold">{{ diff.days }}</p>
                </div>
                <div class="bg-muted/50 rounded-lg border p-3 text-center">
                  <p class="text-muted-foreground text-xs">Hours</p>
                  <p class="text-2xl font-bold">{{ diff.hours }}</p>
                </div>
                <div class="bg-muted/50 rounded-lg border p-3 text-center">
                  <p class="text-muted-foreground text-xs">Minutes</p>
                  <p class="text-2xl font-bold">{{ diff.minutes }}</p>
                </div>
                <div class="bg-muted/50 rounded-lg border p-3 text-center">
                  <p class="text-muted-foreground text-xs">Seconds</p>
                  <p class="text-2xl font-bold">{{ diff.seconds }}</p>
                </div>
              </div>

              <Separator />

              <div class="space-y-2 text-sm">
                <p class="text-muted-foreground">Total Duration:</p>
                <div class="grid gap-2 sm:grid-cols-2">
                  <p>
                    <span class="font-semibold">{{ totalDays }}</span> days
                  </p>
                  <p>
                    <span class="font-semibold">{{ totalWeeks }}</span> weeks
                  </p>
                  <p>
                    <span class="font-semibold">{{ totalHours }}</span> hours
                  </p>
                  <p>
                    <span class="font-semibold">{{ totalMinutes }}</span> minutes
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- Add/Subtract Time Tab -->
          <TabsContent value="add-subtract" class="mt-4 space-y-4">
            <div class="space-y-2">
              <Label class="flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:calendar-today" class="text-primary" />
                Base Date
              </Label>
              <Popover v-model:open="baseDateOpen">
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="
                      cn(
                        'w-full justify-start text-left font-normal',
                        !baseDate && 'text-muted-foreground',
                      )
                    "
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ baseDate ? baseDate.toDateString() : 'Pick a date' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    v-model="baseDateValue"
                    :initial-focus="true"
                    @update:model-value="baseDateOpen = false"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label>Operation</Label>
                <Select v-model="operation">
                  <SelectTrigger class="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add</SelectItem>
                    <SelectItem value="subtract">Subtract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label>Unit</Label>
                <Select v-model="timeUnit">
                  <SelectTrigger class="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="space-y-2">
              <Label>Amount</Label>
              <Input
                v-model.number="timeAmount"
                type="number"
                min="0"
                placeholder="Enter amount"
                class="w-full"
              />
            </div>

            <Button @click="calculateAddSubtract" class="h-12 w-full text-lg font-semibold">
              <Icon icon="mdi:calculator-variant" class="mr-2" />
              Calculate Result
            </Button>

            <div v-if="resultDate" ref="addSubtractResultRef" class="mt-4 space-y-3">
              <div class="bg-muted/50 rounded-lg border p-4 text-center">
                <p class="text-muted-foreground mb-2 text-sm">Result Date</p>
                <p class="text-2xl font-bold">{{ resultDate.toDateString() }}</p>
                <p class="text-muted-foreground mt-1 text-xs">
                  {{ resultDate.toLocaleString() }}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { animate } from 'animejs'
import { Icon } from '@iconify/vue'

const diffResultRef = ref<HTMLElement | null>(null)
const addSubtractResultRef = ref<HTMLElement | null>(null)

const activeTab = ref('difference')
const startDateValue = ref<any>(undefined)
const endDateValue = ref<any>(undefined)
const baseDateValue = ref<any>(undefined)
const diff = ref<null | Record<string, number>>(null)

const startDateOpen = ref(false)
const endDateOpen = ref(false)
const baseDateOpen = ref(false)

// Add/Subtract functionality
const operation = ref<'add' | 'subtract'>('add')
const timeUnit = ref<'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes'>('days')
const timeAmount = ref<number>(1)
const resultDate = ref<Date | null>(null)

function dateValueToDate(dateValue: any): Date | undefined {
  if (!dateValue) return undefined
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
}

const startDate = computed(() => dateValueToDate(startDateValue.value))
const endDate = computed(() => dateValueToDate(endDateValue.value))
const baseDate = computed(() => dateValueToDate(baseDateValue.value))

const totalDays = computed(() => {
  if (!diff.value) return 0
  const { years, months, days } = diff.value
  return Math.floor(years * 365.25 + months * 30.44 + days)
})

const totalWeeks = computed(() => {
  return Math.floor(totalDays.value / 7)
})

const totalHours = computed(() => {
  if (!diff.value) return 0
  return totalDays.value * 24 + diff.value.hours
})

const totalMinutes = computed(() => {
  if (!diff.value) return 0
  return totalHours.value * 60 + diff.value.minutes
})

function calculateDiff() {
  if (!startDate.value || !endDate.value) return
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  let delta = Math.abs(end.getTime() - start.getTime()) / 1000

  const years = Math.floor(delta / (365.25 * 24 * 3600))
  delta -= years * 365.25 * 24 * 3600

  const months = Math.floor(delta / (30.44 * 24 * 3600))
  delta -= months * 30.44 * 24 * 3600

  const days = Math.floor(delta / (24 * 3600))
  delta -= days * 24 * 3600

  const hours = Math.floor(delta / 3600)
  delta -= hours * 3600

  const minutes = Math.floor(delta / 60)
  const seconds = Math.floor(delta - minutes * 60)

  diff.value = { years, months, days, hours, minutes, seconds }

  nextTick(() => {
    if (diffResultRef.value) {
      animate(diffResultRef.value, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutQuad',
      })
    }
  })
}

function calculateAddSubtract() {
  if (!baseDate.value || !timeAmount.value) return

  const result = new Date(baseDate.value)
  const amount = operation.value === 'add' ? timeAmount.value : -timeAmount.value

  switch (timeUnit.value) {
    case 'years':
      result.setFullYear(result.getFullYear() + amount)
      break
    case 'months':
      result.setMonth(result.getMonth() + amount)
      break
    case 'weeks':
      result.setDate(result.getDate() + amount * 7)
      break
    case 'days':
      result.setDate(result.getDate() + amount)
      break
    case 'hours':
      result.setHours(result.getHours() + amount)
      break
    case 'minutes':
      result.setMinutes(result.getMinutes() + amount)
      break
  }

  resultDate.value = result

  nextTick(() => {
    if (addSubtractResultRef.value) {
      animate(addSubtractResultRef.value, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutQuad',
      })
    }
  })
}
</script>
