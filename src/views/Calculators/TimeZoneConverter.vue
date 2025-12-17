<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert times between different time zones around the world
    </p>
    <Card class="route-transition-animation max-h-[90vh] w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:earth" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Time Zone Converter
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4 overflow-y-auto">
        <div class="flex w-full flex-col justify-between sm:flex-row">
          <!-- Source Time Zone -->
          <div class="space-y-2">
            <Label>From Time Zone</Label>
            <Select v-model="sourceTimeZone">
              <SelectTrigger>
                <SelectValue placeholder="Select source time zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="tz in timeZones" :key="tz.value" :value="tz.value">
                  {{ tz.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Source Date & Time Input -->
          <div class="mt-4 space-y-2 sm:mt-0">
            <Label>Date & Time</Label>
            <Popover v-model:open="sourceDateOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="
                    cn(
                      'justify-start text-left font-normal',
                      !sourceDate && 'text-muted-foreground',
                    )
                  "
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{
                    sourceDate
                      ? `${sourceDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })} at ${sourceHour}:${sourceMinute}`
                      : 'Pick date and time'
                  }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <div class="space-y-3 p-3">
                  <Calendar
                    v-model="sourceDateValue"
                    :initial-focus="true"
                    @update:model-value="handleDateChange"
                  />
                  <Separator />
                  <div class="space-y-2">
                    <Label class="text-sm font-medium">Time</Label>
                    <div class="flex gap-2">
                      <Select v-model="sourceHour" @update:model-value="convertTime">
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
                      <Select v-model="sourceMinute" @update:model-value="convertTime">
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
          </div>
        </div>

        <Separator />

        <!-- Target Time Zones -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <Label>Convert To</Label>
            <Button @click="addTargetTimeZone" size="sm" variant="outline">
              <Icon icon="mdi:plus" class="mr-1 h-4 w-4" />
              Add Time Zone
            </Button>
          </div>

          <ScrollArea class="h-[300px] w-full sm:h-[350px]">
            <div class="space-y-2 pr-2 sm:pr-4">
              <div
                v-for="(target, index) in targetTimeZones"
                :key="index"
                class="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:gap-1"
              >
                <div class="flex-1 space-y-1.5">
                  <Select v-model="target.timeZone" @update:modelValue="convertTime">
                    <SelectTrigger class="h-9">
                      <SelectValue placeholder="Select target time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="tz in timeZones" :key="tz.value" :value="tz.value">
                        {{ tz.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div v-if="target.convertedTime" class="text-center">
                    <p class="text-2xl font-bold">{{ target.convertedTime }}</p>
                    <p class="text-muted-foreground text-xs">{{ target.convertedDate }}</p>
                  </div>
                </div>
                <Button
                  @click="removeTargetTimeZone(index)"
                  size="icon"
                  variant="ghost"
                  class="text-destructive hover:text-destructive self-end sm:self-auto"
                >
                  <Icon icon="mdi:close" class="h-5 w-5" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-wrap gap-2">
          <Button @click="setCurrentTime" size="sm" variant="outline">
            <Icon icon="mdi:clock" class="mr-1 h-4 w-4" />
            Current Time
          </Button>
          <Button @click="clearAll" size="sm" variant="outline">
            <Icon icon="mdi:refresh" class="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Icon } from '@iconify/vue'
import { CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { DateValue } from '@internationalized/date'

const sourceTimeZone = ref('UTC')
const sourceDate = ref<Date>(new Date())
const sourceDateValue = ref<DateValue>()
const sourceDateOpen = ref(false)
const sourceHour = ref('12')
const sourceMinute = ref('00')

interface TargetTimeZone {
  timeZone: string
  convertedTime: string
  convertedDate: string
}

const targetTimeZones = ref<TargetTimeZone[]>([
  { timeZone: 'America/New_York', convertedTime: '', convertedDate: '' },
  { timeZone: 'Europe/London', convertedTime: '', convertedDate: '' },
])

const timeZones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time) +0' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST) +1/+2' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST) +0/+1' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST) +1/+2' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow (MSK) +3' },
  { value: 'America/New_York', label: 'America/New York (EST/EDT) -5/-4' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT) -6/-5' },
  { value: 'America/Denver', label: 'America/Denver (MST/MDT) -7/-6' },
  { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST/PDT) -8/-7' },
  { value: 'America/Toronto', label: 'America/Toronto (EST/EDT) -5/-4' },
  { value: 'America/Mexico_City', label: 'America/Mexico City (CST/CDT) -6/-5' },
  { value: 'America/Sao_Paulo', label: 'America/São Paulo (BRT) -3' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST) +9' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST) +8' },
  { value: 'Asia/Hong_Kong', label: 'Asia/Hong Kong (HKT) +8' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT) +8' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST) +4' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST) +5:30' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT/AEST) +10/+11' },
  { value: 'Australia/Melbourne', label: 'Australia/Melbourne (AEDT/AEST) +10/+11' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZDT/NZST) +12/+13' },
]

function setCurrentTime() {
  const now = new Date()
  sourceDate.value = now
  sourceHour.value = String(now.getHours()).padStart(2, '0')
  sourceMinute.value = String(now.getMinutes()).padStart(2, '0')
  convertTime()
}

function handleDateChange() {
  if (sourceDateValue.value) {
    sourceDate.value = new Date(
      sourceDateValue.value.year,
      sourceDateValue.value.month - 1,
      sourceDateValue.value.day,
    )
  }
  sourceDateOpen.value = false
  convertTime()
}

function convertTime() {
  if (!sourceDate.value || !sourceHour.value || !sourceMinute.value) return

  try {
    // Create date string in ISO format for the source timezone
    const year = sourceDate.value.getFullYear()
    const month = String(sourceDate.value.getMonth() + 1).padStart(2, '0')
    const day = String(sourceDate.value.getDate()).padStart(2, '0')
    const dateTimeString = `${year}-${month}-${day}T${sourceHour.value}:${sourceMinute.value}:00`

    // Parse the input as if it's in the source timezone
    // We need to create a date that represents the time in the source timezone
    const sourceDateObj = new Date(dateTimeString)

    // Get offset of source timezone
    const sourceOffset = getTimezoneOffset(sourceTimeZone.value, sourceDateObj)

    // Adjust to get the actual UTC time
    const utcTime = sourceDateObj.getTime() - sourceOffset

    targetTimeZones.value.forEach((target) => {
      if (target.timeZone) {
        // Convert UTC time to target timezone
        const targetDate = new Date(utcTime)

        target.convertedTime = targetDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: target.timeZone,
        })

        target.convertedDate = targetDate.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          timeZone: target.timeZone,
        })
      }
    })
  } catch (error) {
    console.error('Error converting time:', error)
  }
}

function getTimezoneOffset(timeZone: string, date: Date): number {
  // Get the time string in the specified timezone
  const tzString = date.toLocaleString('en-US', { timeZone, timeZoneName: 'short' })

  // Create a date object from that string
  const tzDate = new Date(tzString)

  // Return the difference in milliseconds
  return date.getTime() - tzDate.getTime()
}

function addTargetTimeZone() {
  targetTimeZones.value.unshift({
    timeZone: '',
    convertedTime: '',
    convertedDate: '',
  })
}

function removeTargetTimeZone(index: number) {
  targetTimeZones.value.splice(index, 1)
}

function clearAll() {
  setCurrentTime()
  targetTimeZones.value = [
    { timeZone: 'America/New_York', convertedTime: '', convertedDate: '' },
    { timeZone: 'Europe/London', convertedTime: '', convertedDate: '' },
  ]
}

onMounted(() => {
  setCurrentTime()
})
</script>
