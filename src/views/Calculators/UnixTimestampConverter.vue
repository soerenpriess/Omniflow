<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert between Unix timestamps and human-readable dates
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:clock-outline" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Unix Timestamp Converter
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Current Timestamp -->
        <div class="bg-primary/10 border-primary/20 rounded-lg border p-3">
          <div class="mb-2 flex items-center justify-between">
            <Label class="text-xs font-semibold sm:text-sm">Current Timestamp</Label>
            <Button @click="copyTimestamp(currentTimestamp)" size="sm" variant="ghost" class="h-6">
              <Icon :icon="copiedCurrent ? 'mdi:check' : 'mdi:content-copy'" class="h-3 w-3" />
            </Button>
          </div>
          <p class="font-mono text-lg font-bold sm:text-xl">{{ currentTimestamp }}</p>
          <p class="text-muted-foreground mt-1 text-xs">{{ currentDate }}</p>
        </div>

        <!-- Timestamp to Date -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Timestamp to Date</Label>
          <div class="flex gap-2">
            <Input
              v-model="timestampInput"
              type="number"
              placeholder="1609459200"
              class="font-mono"
              @input="convertTimestampToDate"
            />
            <Button @click="timestampInput = String(currentTimestamp)" variant="outline">
              <Icon icon="mdi:clock" class="h-4 w-4" />
            </Button>
          </div>
          <div v-if="timestampResult" class="bg-muted/30 rounded-lg border p-3">
            <div class="space-y-1 text-xs sm:text-sm">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Local Time:</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono">{{ timestampResult.local }}</span>
                  <Button
                    @click="copyText(timestampResult.local)"
                    size="sm"
                    variant="ghost"
                    class="h-5 w-5 p-0"
                  >
                    <Icon icon="mdi:content-copy" class="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">UTC:</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono">{{ timestampResult.utc }}</span>
                  <Button
                    @click="copyText(timestampResult.utc)"
                    size="sm"
                    variant="ghost"
                    class="h-5 w-5 p-0"
                  >
                    <Icon icon="mdi:content-copy" class="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">ISO 8601:</span>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[10px] sm:text-xs">{{ timestampResult.iso }}</span>
                  <Button
                    @click="copyText(timestampResult.iso)"
                    size="sm"
                    variant="ghost"
                    class="h-5 w-5 p-0"
                  >
                    <Icon icon="mdi:content-copy" class="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Relative:</span>
                <span>{{ timestampResult.relative }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Date to Timestamp -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Date to Timestamp</Label>
          <Popover v-model:open="datePickerOpen">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="
                  cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground',
                  )
                "
              >
                <Icon icon="mdi:calendar" class="mr-2 h-4 w-4" />
                {{
                  selectedDate
                    ? `${selectedDate.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })} at ${hours}:${minutes}`
                    : 'Pick date and time'
                }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <div class="space-y-3 p-3">
                <Calendar
                  v-model="dateValue"
                  :initial-focus="true"
                  @update:model-value="handleDateChange"
                />
                <Separator />
                <div class="space-y-2">
                  <Label class="text-sm font-medium">Time</Label>
                  <div class="flex gap-2">
                    <Select v-model="hours" @update:model-value="convertDateToTimestamp">
                      <SelectTrigger class="flex-1">
                        <SelectValue placeholder="HH" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="h in 24"
                          :key="h - 1"
                          :value="String(h - 1).padStart(2, '0')"
                        >
                          {{ String(h - 1).padStart(2, '0') }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <span class="flex items-center text-xl font-bold">:</span>
                    <Select v-model="minutes" @update:model-value="convertDateToTimestamp">
                      <SelectTrigger class="flex-1">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="m in 60"
                          :key="m - 1"
                          :value="String(m - 1).padStart(2, '0')"
                        >
                          {{ String(m - 1).padStart(2, '0') }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <div v-if="dateResult" class="bg-muted/30 rounded-lg border p-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-muted-foreground text-xs">Unix Timestamp</p>
                <p class="font-mono text-lg font-bold">{{ dateResult.timestamp }}</p>
              </div>
              <Button @click="copyTimestamp(dateResult.timestamp)" size="sm" variant="ghost">
                <Icon :icon="copiedDate ? 'mdi:check' : 'mdi:content-copy'" class="h-4 w-4" />
              </Button>
            </div>
            <p class="text-muted-foreground mt-2 text-xs">{{ dateResult.formatted }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Quick Actions</Label>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button @click="setQuickDate('now')" size="sm" variant="outline">
              <Icon icon="mdi:clock" class="mr-1 h-3 w-3" />
              Now
            </Button>
            <Button @click="setQuickDate('hour')" size="sm" variant="outline">
              <Icon icon="mdi:clock-plus" class="mr-1 h-3 w-3" />
              +1 Hour
            </Button>
            <Button @click="setQuickDate('day')" size="sm" variant="outline">
              <Icon icon="mdi:calendar-plus" class="mr-1 h-3 w-3" />
              +1 Day
            </Button>
            <Button @click="setQuickDate('week')" size="sm" variant="outline">
              <Icon icon="mdi:calendar-week" class="mr-1 h-3 w-3" />
              +1 Week
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'

const currentTimestamp = ref(Math.floor(Date.now() / 1000))
const currentDate = ref('')
const timestampInput = ref('')
const dateValue = ref<any>(undefined)
const hours = ref('00')
const minutes = ref('00')
const copiedCurrent = ref(false)
const copiedDate = ref(false)
const datePickerOpen = ref(false)

const selectedDate = computed(() => {
  return dateValue.value ? new Date(dateValue.value.toString()) : null
})

interface TimestampResult {
  local: string
  utc: string
  iso: string
  relative: string
}

const timestampResult = ref<TimestampResult | null>(null)

interface DateResult {
  timestamp: number
  formatted: string
}

const dateResult = ref<DateResult | null>(null)

let interval: number

function updateCurrent() {
  currentTimestamp.value = Math.floor(Date.now() / 1000)
  const now = new Date()
  currentDate.value = now.toLocaleString(undefined, {
    dateStyle: 'full',
    timeStyle: 'long',
  })
}

function handleDateChange() {
  convertDateToTimestamp()
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp * 1000
  const absDiff = Math.abs(diff)

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  const future = diff < 0

  if (years > 0)
    return future
      ? `in ${years} year${years > 1 ? 's' : ''}`
      : `${years} year${years > 1 ? 's' : ''} ago`
  if (months > 0)
    return future
      ? `in ${months} month${months > 1 ? 's' : ''}`
      : `${months} month${months > 1 ? 's' : ''} ago`
  if (days > 0)
    return future ? `in ${days} day${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0)
    return future
      ? `in ${hours} hour${hours > 1 ? 's' : ''}`
      : `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0)
    return future
      ? `in ${minutes} minute${minutes > 1 ? 's' : ''}`
      : `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'just now'
}

function convertTimestampToDate() {
  if (!timestampInput.value) {
    timestampResult.value = null
    return
  }

  const timestamp = parseInt(timestampInput.value)
  if (isNaN(timestamp)) {
    timestampResult.value = null
    return
  }

  const date = new Date(timestamp * 1000)

  timestampResult.value = {
    local: date.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' }),
    utc: date.toUTCString(),
    iso: date.toISOString(),
    relative: getRelativeTime(timestamp),
  }
}

function convertDateToTimestamp() {
  if (!selectedDate.value) {
    return
  }

  const date = new Date(selectedDate.value)
  const h = parseInt(hours.value) || 0
  const m = parseInt(minutes.value) || 0
  date.setHours(h, m, 0, 0)

  const timestamp = Math.floor(date.getTime() / 1000)

  dateResult.value = {
    timestamp,
    formatted: date.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' }),
  }
}

function setQuickDate(type: string) {
  const now = new Date()

  switch (type) {
    case 'now':
      break
    case 'hour':
      now.setHours(now.getHours() + 1)
      break
    case 'day':
      now.setDate(now.getDate() + 1)
      break
    case 'week':
      now.setDate(now.getDate() + 7)
      break
  }

  dateValue.value = now
  hours.value = String(now.getHours()).padStart(2, '0')
  minutes.value = String(now.getMinutes()).padStart(2, '0')
  convertDateToTimestamp()
}

function copyTimestamp(timestamp: number) {
  navigator.clipboard.writeText(String(timestamp))
  if (timestamp === currentTimestamp.value) {
    copiedCurrent.value = true
    setTimeout(() => {
      copiedCurrent.value = false
    }, 1500)
  } else {
    copiedDate.value = true
    setTimeout(() => {
      copiedDate.value = false
    }, 1500)
  }
}

function copyText(text: string) {
  navigator.clipboard.writeText(text)
}

onMounted(() => {
  updateCurrent()
  interval = window.setInterval(updateCurrent, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>
