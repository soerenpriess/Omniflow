<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Create cron expressions visually for task scheduling
    </p>
    <Card class="route-transition-animation mb-2 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-4">
      <CardHeader class="pb-1 sm:pb-2">
        <CardTitle
          class="flex items-center gap-1 text-sm font-semibold sm:gap-1.5 sm:text-base lg:text-lg"
        >
          <Icon
            icon="mdi:calendar-clock"
            class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
          />
          Cron Expression Generator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-2 sm:space-y-3">
        <!-- Quick Presets -->
        <div class="space-y-1">
          <Label class="text-[12px] sm:text-xs">Quick Presets</Label>
          <div class="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            <Button @click="loadPreset('everyMinute')" size="sm" variant="outline">
              Every Minute
            </Button>
            <Button @click="loadPreset('everyHour')" size="sm" variant="outline">
              Every Hour
            </Button>
            <Button @click="loadPreset('everyDay')" size="sm" variant="outline"> Every Day </Button>
            <Button @click="loadPreset('everyWeek')" size="sm" variant="outline">
              Every Week
            </Button>
            <Button @click="loadPreset('everyMonth')" size="sm" variant="outline">
              Every Month
            </Button>
            <Button @click="loadPreset('weekdays')" size="sm" variant="outline"> Weekdays </Button>
          </div>
        </div>

        <!-- Manual Configuration -->
        <div class="space-y-1">
          <Label class="text-[12px] sm:text-xs">Configure Schedule</Label>

          <div class="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Minute -->
            <div class="flex flex-col gap-0.5">
              <Label class="text-muted-foreground text-[9px]">Minute (0-59)</Label>
              <div class="flex gap-1">
                <Select v-model="minuteType">
                  <SelectTrigger class="h-8 w-20 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Every</SelectItem>
                    <SelectItem value="specific">Specific</SelectItem>
                    <SelectItem value="interval">Every N</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  v-if="minuteType !== '*'"
                  v-model.number="minuteValue"
                  type="number"
                  min="0"
                  max="59"
                  class="h-8 flex-1 text-[12px]"
                />
              </div>
            </div>

            <!-- Hour -->
            <div class="flex flex-col gap-0.5">
              <Label class="text-muted-foreground text-[9px]">Hour (0-23)</Label>
              <div class="flex gap-1">
                <Select v-model="hourType">
                  <SelectTrigger class="h-8 w-20 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Every</SelectItem>
                    <SelectItem value="specific">Specific</SelectItem>
                    <SelectItem value="interval">Every N</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  v-if="hourType !== '*'"
                  v-model.number="hourValue"
                  type="number"
                  min="0"
                  max="23"
                  class="h-8 flex-1 text-[12px]"
                />
              </div>
            </div>

            <!-- Day of Month -->
            <div class="flex flex-col gap-0.5">
              <Label class="text-muted-foreground text-[9px]">Day (1-31)</Label>
              <div class="flex gap-1">
                <Select v-model="dayType">
                  <SelectTrigger class="h-8 w-20 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Every</SelectItem>
                    <SelectItem value="specific">Specific</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  v-if="dayType === 'specific'"
                  v-model.number="dayValue"
                  type="number"
                  min="1"
                  max="31"
                  class="h-8 flex-1 text-[12px]"
                />
              </div>
            </div>

            <!-- Month -->
            <div class="flex flex-col gap-0.5">
              <Label class="text-muted-foreground text-[9px]">Month</Label>
              <div class="flex gap-1">
                <Select v-model="monthType">
                  <SelectTrigger class="h-8 w-20 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Every</SelectItem>
                    <SelectItem value="specific">Specific</SelectItem>
                  </SelectContent>
                </Select>
                <Select v-if="monthType === 'specific'" v-model="monthValue">
                  <SelectTrigger class="h-8 flex-1 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Jan</SelectItem>
                    <SelectItem value="2">Feb</SelectItem>
                    <SelectItem value="3">Mar</SelectItem>
                    <SelectItem value="4">Apr</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">Jun</SelectItem>
                    <SelectItem value="7">Jul</SelectItem>
                    <SelectItem value="8">Aug</SelectItem>
                    <SelectItem value="9">Sep</SelectItem>
                    <SelectItem value="10">Oct</SelectItem>
                    <SelectItem value="11">Nov</SelectItem>
                    <SelectItem value="12">Dec</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <!-- Day of Week -->
            <div class="flex flex-col gap-0.5 sm:col-span-2 lg:col-span-1">
              <Label class="text-muted-foreground text-[9px]">Weekday</Label>
              <div class="flex gap-1">
                <Select v-model="weekdayType">
                  <SelectTrigger class="h-8 w-20 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">Every</SelectItem>
                    <SelectItem value="specific">Specific</SelectItem>
                  </SelectContent>
                </Select>
                <Select v-if="weekdayType === 'specific'" v-model="weekdayValue">
                  <SelectTrigger class="h-8 flex-1 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sun</SelectItem>
                    <SelectItem value="1">Mon</SelectItem>
                    <SelectItem value="2">Tue</SelectItem>
                    <SelectItem value="3">Wed</SelectItem>
                    <SelectItem value="4">Thu</SelectItem>
                    <SelectItem value="5">Fri</SelectItem>
                    <SelectItem value="6">Sat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <!-- Generated Expression -->
        <div class="bg-primary/10 border-primary/20 rounded-lg border p-2.5 sm:p-3">
          <div class="mb-1 flex items-center justify-between">
            <Label class="text-xs font-semibold">Cron Expression</Label>
            <Button @click="copyCron" size="sm" variant="ghost">
              <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" class="mr-1 h-3 w-3" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <p class="font-mono text-base font-bold sm:text-lg">{{ cronExpression }}</p>
          <p class="text-muted-foreground mt-1 text-[12px] sm:text-xs">{{ description }}</p>
        </div>

        <!-- Next Run Times -->
        <div class="bg-muted/30 rounded-lg border p-2">
          <Label class="mb-1 text-[12px] font-semibold">Next 5 Executions</Label>
          <div class="space-y-0.5">
            <div
              v-for="(time, index) in nextExecutions"
              :key="index"
              class="flex items-center gap-2 text-[12px] sm:text-xs"
            >
              <Icon icon="mdi:clock-outline" class="text-primary h-3 w-3" />
              <span class="font-mono">{{ time }}</span>
            </div>
          </div>
        </div>

        <!-- Syntax Reference -->
        <div class="bg-muted/30 rounded-lg border p-2">
          <Label class="mb-1 text-[12px] font-semibold">Cron Syntax Reference</Label>
          <div class="space-y-0.5 text-[12px]">
            <p class="font-mono">
              <span class="text-primary">*</span>
              <span class="text-muted-foreground"> = Any value</span>
            </p>
            <p class="font-mono">
              <span class="text-primary">,</span>
              <span class="text-muted-foreground"> = Value list separator (e.g., 1,3,5)</span>
            </p>
            <p class="font-mono">
              <span class="text-primary">-</span>
              <span class="text-muted-foreground"> = Range of values (e.g., 1-5)</span>
            </p>
            <p class="font-mono">
              <span class="text-primary">/</span>
              <span class="text-muted-foreground"> = Step values (e.g., */5)</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icon } from '@iconify/vue'

const copied = ref(false)
const minuteType = ref('*')
const minuteValue = ref(0)
const hourType = ref('*')
const hourValue = ref(0)
const dayType = ref('*')
const dayValue = ref(1)
const monthType = ref('*')
const monthValue = ref('1')
const weekdayType = ref('*')
const weekdayValue = ref('0')

const presets: Record<string, any> = {
  everyMinute: { minute: '*', hour: '*', day: '*', month: '*', weekday: '*' },
  everyHour: { minute: '0', hour: '*', day: '*', month: '*', weekday: '*' },
  everyDay: { minute: '0', hour: '0', day: '*', month: '*', weekday: '*' },
  everyWeek: { minute: '0', hour: '0', day: '*', month: '*', weekday: '0' },
  everyMonth: { minute: '0', hour: '0', day: '1', month: '*', weekday: '*' },
  weekdays: { minute: '0', hour: '9', day: '*', month: '*', weekday: '1-5' },
}

const cronExpression = computed(() => {
  const minute =
    minuteType.value === '*'
      ? '*'
      : minuteType.value === 'interval'
        ? `*/${minuteValue.value}`
        : String(minuteValue.value)
  const hour =
    hourType.value === '*'
      ? '*'
      : hourType.value === 'interval'
        ? `*/${hourValue.value}`
        : String(hourValue.value)
  const day = dayType.value === '*' ? '*' : String(dayValue.value)
  const month = monthType.value === '*' ? '*' : monthValue.value
  const weekday = weekdayType.value === '*' ? '*' : weekdayValue.value

  return `${minute} ${hour} ${day} ${month} ${weekday}`
})

const description = computed(() => {
  const parts: string[] = []

  if (minuteType.value === 'interval') {
    parts.push(`every ${minuteValue.value} minutes`)
  } else if (minuteType.value === 'specific') {
    parts.push(`at minute ${minuteValue.value}`)
  }

  if (hourType.value === 'interval') {
    parts.push(`every ${hourValue.value} hours`)
  } else if (hourType.value === 'specific') {
    parts.push(`at ${hourValue.value}:00`)
  }

  if (dayType.value === 'specific') {
    parts.push(`on day ${dayValue.value}`)
  }

  if (monthType.value === 'specific') {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    parts.push(`in ${months[parseInt(monthValue.value) - 1]}`)
  }

  if (weekdayType.value === 'specific') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    parts.push(`on ${days[parseInt(weekdayValue.value)]}`)
  }

  return parts.length > 0 ? parts.join(', ') : 'Every minute'
})

const nextExecutions = computed(() => {
  const executions: string[] = []
  let current = new Date()

  for (let i = 0; i < 5; i++) {
    current = getNextExecution(current)
    executions.push(current.toLocaleString())
  }

  return executions
})

function getNextExecution(from: Date): Date {
  const next = new Date(from)
  next.setSeconds(0)
  next.setMilliseconds(0)

  next.setMinutes(next.getMinutes() + 1)

  // Find the next valid execution time
  let attempts = 0
  while (attempts < 100000) {
    attempts++

    // Check minute
    if (minuteType.value === 'specific' && next.getMinutes() !== minuteValue.value) {
      if (next.getMinutes() > minuteValue.value) {
        next.setHours(next.getHours() + 1)
      }
      next.setMinutes(minuteValue.value)
      continue
    } else if (minuteType.value === 'interval') {
      const interval = minuteValue.value
      if (next.getMinutes() % interval !== 0) {
        const nextMinute = Math.ceil(next.getMinutes() / interval) * interval
        if (nextMinute >= 60) {
          next.setHours(next.getHours() + 1)
          next.setMinutes(0)
        } else {
          next.setMinutes(nextMinute)
        }
        continue
      }
    }

    // Check hour
    if (hourType.value === 'specific' && next.getHours() !== hourValue.value) {
      if (next.getHours() > hourValue.value) {
        next.setDate(next.getDate() + 1)
      }
      next.setHours(hourValue.value)
      next.setMinutes(minuteType.value === 'specific' ? minuteValue.value : 0)
      continue
    } else if (hourType.value === 'interval') {
      const interval = hourValue.value
      if (next.getHours() % interval !== 0) {
        const nextHour = Math.ceil(next.getHours() / interval) * interval
        if (nextHour >= 24) {
          next.setDate(next.getDate() + 1)
          next.setHours(0)
        } else {
          next.setHours(nextHour)
        }
        next.setMinutes(minuteType.value === 'specific' ? minuteValue.value : 0)
        continue
      }
    }

    // Check day
    if (dayType.value === 'specific' && next.getDate() !== dayValue.value) {
      if (next.getDate() > dayValue.value) {
        next.setMonth(next.getMonth() + 1)
      }
      next.setDate(dayValue.value)
      next.setHours(hourType.value === 'specific' ? hourValue.value : 0)
      next.setMinutes(minuteType.value === 'specific' ? minuteValue.value : 0)
      continue
    }

    // Check month
    if (monthType.value === 'specific' && next.getMonth() + 1 !== parseInt(monthValue.value)) {
      const targetMonth = parseInt(monthValue.value) - 1
      if (next.getMonth() > targetMonth) {
        next.setFullYear(next.getFullYear() + 1)
      }
      next.setMonth(targetMonth)
      next.setDate(dayType.value === 'specific' ? dayValue.value : 1)
      next.setHours(hourType.value === 'specific' ? hourValue.value : 0)
      next.setMinutes(minuteType.value === 'specific' ? minuteValue.value : 0)
      continue
    }

    // Check weekday
    if (weekdayType.value === 'specific' && next.getDay() !== parseInt(weekdayValue.value)) {
      next.setDate(next.getDate() + 1)
      next.setHours(hourType.value === 'specific' ? hourValue.value : 0)
      next.setMinutes(minuteType.value === 'specific' ? minuteValue.value : 0)
      continue
    }

    // All conditions met
    break
  }

  return next
}

function loadPreset(preset: string) {
  const config = presets[preset]
  cronExpression.value

  if (config.minute === '*') {
    minuteType.value = '*'
  } else if (config.minute.includes('/')) {
    minuteType.value = 'interval'
    minuteValue.value = parseInt(config.minute.split('/')[1])
  } else {
    minuteType.value = 'specific'
    minuteValue.value = parseInt(config.minute)
  }

  if (config.hour === '*') {
    hourType.value = '*'
  } else {
    hourType.value = 'specific'
    hourValue.value = parseInt(config.hour)
  }

  dayType.value = config.day === '*' ? '*' : 'specific'
  if (dayType.value === 'specific') dayValue.value = parseInt(config.day)

  monthType.value = config.month === '*' ? '*' : 'specific'
  if (monthType.value === 'specific') monthValue.value = config.month

  weekdayType.value = config.weekday === '*' || config.weekday.includes('-') ? '*' : 'specific'
  if (weekdayType.value === 'specific') weekdayValue.value = config.weekday
}

function copyCron() {
  navigator.clipboard.writeText(cronExpression.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>
