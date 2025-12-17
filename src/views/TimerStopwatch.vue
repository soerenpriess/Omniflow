<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Track time with a countdown timer or stopwatch
    </p>
    <Card class="route-transition-animation w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:timer" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Timer & Stopwatch
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Mode Toggle -->
        <div class="flex gap-2">
          <Button
            @click="mode = 'timer'"
            :variant="mode === 'timer' ? 'default' : 'outline'"
            class="flex-1"
          >
            <Icon icon="mdi:timer" class="mr-2 h-4 w-4" />
            Timer
          </Button>
          <Button
            @click="mode = 'stopwatch'"
            :variant="mode === 'stopwatch' ? 'default' : 'outline'"
            class="flex-1"
          >
            <Icon icon="mdi:timer-play" class="mr-2 h-4 w-4" />
            Stopwatch
          </Button>
          <Button @click="toggleKioskMode" :variant="kioskMode ? 'default' : 'outline'">
            <Icon icon="mdi:fullscreen" class="h-4 w-4" />
          </Button>
        </div>

        <!-- Timer Mode -->
        <div v-if="mode === 'timer'" class="space-y-6">
          <!-- Time Display -->
          <div class="text-center">
            <div class="font-mono text-7xl font-bold">{{ formatTime(totalTimerSeconds) }}</div>
            <p
              v-if="!timerRunning && totalTimerSeconds === 0"
              class="text-muted-foreground mt-2 text-sm"
            >
              Time's up! 🎉
            </p>
          </div>

          <!-- Time Input -->
          <div v-if="!timerRunning" class="grid grid-cols-3 gap-4">
            <div class="space-y-2">
              <Label>Hours</Label>
              <Input
                v-model.number="timerHours"
                type="number"
                min="0"
                max="23"
                class="text-center font-mono text-2xl"
              />
            </div>
            <div class="space-y-2">
              <Label>Minutes</Label>
              <Input
                v-model.number="timerMinutes"
                type="number"
                min="0"
                max="59"
                class="text-center font-mono text-2xl"
              />
            </div>
            <div class="space-y-2">
              <Label>Seconds</Label>
              <Input
                v-model.number="timerSeconds"
                type="number"
                min="0"
                max="59"
                class="text-center font-mono text-2xl"
              />
            </div>
          </div>

          <!-- Quick Presets -->
          <div v-if="!timerRunning" class="grid grid-cols-4 gap-2">
            <Button @click="setTimer(1 * 60)" variant="outline" size="sm">1m</Button>
            <Button @click="setTimer(5 * 60)" variant="outline" size="sm">5m</Button>
            <Button @click="setTimer(10 * 60)" variant="outline" size="sm">10m</Button>
            <Button @click="setTimer(15 * 60)" variant="outline" size="sm">15m</Button>
            <Button @click="setTimer(25 * 60)" variant="outline" size="sm">25m</Button>
            <Button @click="setTimer(30 * 60)" variant="outline" size="sm">30m</Button>
            <Button @click="setTimer(45 * 60)" variant="outline" size="sm">45m</Button>
            <Button @click="setTimer(60 * 60)" variant="outline" size="sm">1h</Button>
          </div>

          <!-- Sound Settings -->
          <div v-if="!timerRunning" class="space-y-3">
            <Collapsible v-model:open="soundSettingsOpen">
              <CollapsibleTrigger as-child>
                <Button variant="outline" size="sm" class="h-8 w-full justify-between text-xs">
                  <span class="flex items-center gap-2">
                    <Icon icon="mdi:volume-high" class="h-4 w-4" />
                    Sound Settings
                  </span>
                  <Icon icon="mdi:chevron-down" class="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent class="mt-2 space-y-3">
                <!-- Built-in Sounds -->
                <div class="space-y-2">
                  <Label class="text-xs">Built-in Sounds</Label>
                  <div class="grid grid-cols-2 gap-2">
                    <Button
                      v-for="sound in builtInSounds"
                      :key="sound.id"
                      @click="selectSound(sound.id)"
                      :variant="selectedSound === sound.id ? 'default' : 'outline'"
                      size="sm"
                      class="h-auto flex-col py-2"
                    >
                      <Icon :icon="sound.icon" class="mb-1 h-5 w-5" />
                      <span class="text-xs">{{ sound.name }}</span>
                    </Button>
                  </div>
                  <Button @click="testSound" variant="ghost" size="sm" class="w-full text-xs">
                    <Icon icon="mdi:play" class="mr-1 h-3 w-3" />
                    Test Sound
                  </Button>
                </div>

                <!-- Custom Sounds -->
                <div class="space-y-2">
                  <Label class="text-xs">Custom Sounds</Label>
                  <div class="space-y-2">
                    <div
                      v-for="(sound, index) in customSounds"
                      :key="'custom-' + index"
                      class="flex items-center gap-2"
                    >
                      <Button
                        @click="selectSound('custom-' + index)"
                        :variant="selectedSound === 'custom-' + index ? 'default' : 'outline'"
                        size="sm"
                        class="flex-1 justify-start text-xs"
                      >
                        <Icon icon="mdi:music" class="mr-2 h-4 w-4" />
                        {{ sound.name }}
                      </Button>
                      <Button
                        @click="deleteCustomSound(index)"
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8"
                      >
                        <Icon icon="mdi:delete" class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <input
                    ref="soundFileInput"
                    type="file"
                    accept="audio/*"
                    class="hidden"
                    @change="handleSoundUpload"
                  />
                  <Button
                    @click="soundFileInput?.click()"
                    variant="outline"
                    size="sm"
                    class="w-full text-xs"
                  >
                    <Icon icon="mdi:upload" class="mr-2 h-4 w-4" />
                    Upload Custom Sound
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <!-- Controls -->
          <div class="flex gap-2">
            <Button
              @click="startTimer"
              v-if="!timerRunning"
              class="flex-1"
              :disabled="totalTimerSeconds === 0"
            >
              <Icon icon="mdi:play" class="mr-2 h-5 w-5" />
              Start
            </Button>
            <Button @click="pauseTimer" v-else class="flex-1" variant="secondary">
              <Icon icon="mdi:pause" class="mr-2 h-5 w-5" />
              Pause
            </Button>
            <Button @click="resetTimer" variant="outline">
              <Icon icon="mdi:refresh" class="h-5 w-5" />
            </Button>
          </div>
        </div>

        <!-- Stopwatch Mode -->
        <div v-else class="space-y-6">
          <!-- Time Display -->
          <div class="text-center">
            <div class="font-mono text-7xl font-bold">{{ formatTime(stopwatchSeconds) }}</div>
            <p class="text-muted-foreground mt-2 text-sm">
              {{ stopwatchMilliseconds.toString().padStart(2, '0') }} ms
            </p>
          </div>

          <!-- Laps -->
          <div v-if="laps.length > 0" class="space-y-2">
            <div class="flex items-center justify-between">
              <Label>Laps ({{ laps.length }})</Label>
              <Button @click="clearLaps" size="sm" variant="ghost">
                <Icon icon="mdi:delete" class="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
            <ScrollArea class="h-32 rounded-lg border">
              <div class="space-y-1 p-2">
                <div
                  v-for="(lap, index) in laps.slice().reverse()"
                  :key="laps.length - index"
                  class="hover:bg-muted/50 flex items-center justify-between rounded p-2"
                >
                  <span class="text-sm font-medium">Lap {{ laps.length - index }}</span>
                  <span class="font-mono text-sm">{{ formatTime(lap.time) }}.{{ lap.ms }}</span>
                </div>
              </div>
            </ScrollArea>
          </div>

          <!-- Controls -->
          <div class="flex gap-2">
            <Button @click="startStopwatch" v-if="!stopwatchRunning" class="flex-1">
              <Icon icon="mdi:play" class="mr-2 h-5 w-5" />
              Start
            </Button>
            <Button @click="pauseStopwatch" v-else class="flex-1" variant="secondary">
              <Icon icon="mdi:pause" class="mr-2 h-5 w-5" />
              Pause
            </Button>
            <Button @click="recordLap" v-if="stopwatchRunning" variant="outline">
              <Icon icon="mdi:flag" class="mr-2 h-5 w-5" />
              Lap
            </Button>
            <Button @click="resetStopwatch" variant="outline">
              <Icon icon="mdi:refresh" class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Kiosk Mode Overlay -->
  <Teleport to="body">
    <div
      v-if="kioskMode"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
    >
      <!-- Exit Kiosk Mode Button -->
      <Button
        @click="toggleKioskMode"
        variant="ghost"
        size="icon"
        class="absolute top-2 right-2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 sm:top-4 sm:right-4 sm:h-12 sm:w-12"
      >
        <Icon icon="mdi:close" class="h-5 w-5 text-white sm:h-6 sm:w-6" />
      </Button>

      <!-- Timer Display -->
      <div
        v-if="mode === 'timer'"
        class="flex -rotate-90 flex-col items-center justify-center px-4 text-white sm:rotate-0"
      >
        <div class="font-mono text-[8rem] leading-none font-bold sm:text-[12rem] lg:text-[20rem]">
          {{ formatTime(totalTimerSeconds) }}
        </div>
        <p
          v-if="!timerRunning && totalTimerSeconds === 0"
          class="mt-4 text-2xl sm:mt-6 sm:text-3xl lg:mt-8 lg:text-4xl"
        >
          Time's up! 🎉
        </p>
      </div>

      <!-- Stopwatch Display -->
      <div
        v-else
        class="flex -rotate-90 flex-col items-center justify-center px-4 text-white sm:rotate-0"
      >
        <div class="font-mono text-[8rem] leading-none font-bold sm:text-[12rem] lg:text-[20rem]">
          {{ formatTime(stopwatchSeconds) }}
        </div>
        <p class="mt-2 font-mono text-3xl opacity-70 sm:mt-3 sm:text-4xl lg:mt-4 lg:text-6xl">
          .{{ stopwatchMilliseconds.toString().padStart(2, '0') }}
        </p>
      </div>

      <!-- Kiosk Controls for Timer -->
      <div
        v-if="mode === 'timer'"
        class="absolute bottom-4 flex gap-2 px-4 sm:bottom-6 sm:gap-3 lg:bottom-8 lg:gap-4"
      >
        <Button
          @click="startTimer"
          v-if="!timerRunning && totalTimerSeconds > 0"
          size="lg"
          class="h-12 px-4 text-base sm:h-14 sm:px-6 sm:text-lg lg:h-16 lg:px-8 lg:text-xl"
        >
          <Icon
            icon="mdi:play"
            class="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6 lg:mr-3 lg:h-8 lg:w-8"
          />
          <span class="hidden sm:inline">Start</span>
        </Button>
        <Button
          @click="pauseTimer"
          v-else-if="timerRunning"
          size="lg"
          variant="secondary"
          class="h-12 px-4 text-base sm:h-14 sm:px-6 sm:text-lg lg:h-16 lg:px-8 lg:text-xl"
        >
          <Icon
            icon="mdi:pause"
            class="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6 lg:mr-3 lg:h-8 lg:w-8"
          />
          <span class="hidden sm:inline">Pause</span>
        </Button>
        <Button
          @click="resetTimer"
          size="lg"
          variant="outline"
          class="h-12 px-4 text-base sm:h-14 sm:px-6 sm:text-lg lg:h-16 lg:px-8 lg:text-xl"
        >
          <Icon
            icon="mdi:refresh"
            class="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6 lg:mr-3 lg:h-8 lg:w-8"
          />
          <span class="hidden sm:inline">Reset</span>
        </Button>
      </div>

      <!-- Kiosk Controls for Stopwatch -->
      <div
        v-else
        class="absolute bottom-4 flex gap-2 px-4 sm:bottom-6 sm:gap-3 lg:bottom-8 lg:gap-4"
      >
        <Button
          @click="startStopwatch"
          v-if="!stopwatchRunning"
          size="lg"
          class="h-12 px-4 text-base sm:h-14 sm:px-6 sm:text-lg lg:h-16 lg:px-8 lg:text-xl"
        >
          <Icon
            icon="mdi:play"
            class="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6 lg:mr-3 lg:h-8 lg:w-8"
          />
          <span class="hidden sm:inline">Start</span>
        </Button>
        <Button
          @click="pauseStopwatch"
          v-else
          size="lg"
          variant="secondary"
          class="h-12 px-4 text-base sm:h-14 sm:px-6 sm:text-lg lg:h-16 lg:px-8 lg:text-xl"
        >
          <Icon
            icon="mdi:pause"
            class="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6 lg:mr-3 lg:h-8 lg:w-8"
          />
          <span class="hidden sm:inline">Pause</span>
        </Button>
        <Button
          @click="recordLap"
          v-if="stopwatchRunning"
          size="lg"
          variant="outline"
          class="h-12 px-4 text-base sm:h-14 sm:px-6 sm:text-lg lg:h-16 lg:px-8 lg:text-xl"
        >
          <Icon
            icon="mdi:flag"
            class="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6 lg:mr-3 lg:h-8 lg:w-8"
          />
          <span class="hidden sm:inline">Lap</span>
        </Button>
        <Button
          @click="resetStopwatch"
          size="lg"
          variant="outline"
          class="h-12 px-4 text-base sm:h-14 sm:px-6 sm:text-lg lg:h-16 lg:px-8 lg:text-xl"
        >
          <Icon
            icon="mdi:refresh"
            class="mr-2 h-5 w-5 sm:mr-2.5 sm:h-6 sm:w-6 lg:mr-3 lg:h-8 lg:w-8"
          />
          <span class="hidden sm:inline">Reset</span>
        </Button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Icon } from '@iconify/vue'

const mode = ref<'timer' | 'stopwatch'>('timer')
const kioskMode = ref(false)
const soundSettingsOpen = ref(false)
const soundFileInput = ref<HTMLInputElement | null>(null)

// Sound state
interface Sound {
  id: string
  name: string
  icon: string
}

interface CustomSound {
  name: string
  url: string
}

const builtInSounds = ref<Sound[]>([
  { id: 'beep', name: 'Beep', icon: 'mdi:bell' },
  { id: 'chime', name: 'Chime', icon: 'mdi:bell-ring' },
  { id: 'alarm', name: 'Alarm', icon: 'mdi:alarm' },
  { id: 'ding', name: 'Ding', icon: 'mdi:bell-alert' },
])

const selectedSound = ref('beep')
const customSounds = ref<CustomSound[]>([])

// Timer state
const timerHours = ref(0)
const timerMinutes = ref(0)
const timerSeconds = ref(0)
const timerRunning = ref(false)
let timerInterval: number | null = null

// Computed total timer seconds
const totalTimerSeconds = computed(() => {
  return timerHours.value * 3600 + timerMinutes.value * 60 + timerSeconds.value
})

// Stopwatch state
const stopwatchSeconds = ref(0)
const stopwatchMilliseconds = ref(0)
const stopwatchRunning = ref(false)
let stopwatchInterval: number | null = null

interface Lap {
  time: number
  ms: number
}
const laps = ref<Lap[]>([])

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds].map((v) => v.toString().padStart(2, '0')).join(':')
}

// Timer functions
function setTimer(seconds: number) {
  timerHours.value = Math.floor(seconds / 3600)
  timerMinutes.value = Math.floor((seconds % 3600) / 60)
  timerSeconds.value = seconds % 60
}

function startTimer() {
  if (totalTimerSeconds.value === 0) return

  timerRunning.value = true

  timerInterval = window.setInterval(() => {
    if (timerSeconds.value > 0) {
      timerSeconds.value--
    } else if (timerMinutes.value > 0) {
      timerMinutes.value--
      timerSeconds.value = 59
    } else if (timerHours.value > 0) {
      timerHours.value--
      timerMinutes.value = 59
      timerSeconds.value = 59
    } else {
      // Timer finished
      pauseTimer()
      // Play sound notification
      playNotification()
    }
  }, 1000)
}

function pauseTimer() {
  timerRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resetTimer() {
  pauseTimer()
  timerHours.value = 0
  timerMinutes.value = 0
  timerSeconds.value = 0
}

// Stopwatch functions
function startStopwatch() {
  stopwatchRunning.value = true

  stopwatchInterval = window.setInterval(() => {
    stopwatchMilliseconds.value += 1

    if (stopwatchMilliseconds.value >= 100) {
      stopwatchMilliseconds.value = 0
      stopwatchSeconds.value++
    }
  }, 10)
}

function pauseStopwatch() {
  stopwatchRunning.value = false
  if (stopwatchInterval) {
    clearInterval(stopwatchInterval)
    stopwatchInterval = null
  }
}

function resetStopwatch() {
  pauseStopwatch()
  stopwatchSeconds.value = 0
  stopwatchMilliseconds.value = 0
  laps.value = []
}

function recordLap() {
  laps.value.push({
    time: stopwatchSeconds.value,
    ms: stopwatchMilliseconds.value,
  })
}

function clearLaps() {
  laps.value = []
}

function selectSound(soundId: string) {
  selectedSound.value = soundId
}

function testSound() {
  playNotification()
}

function handleSoundUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      customSounds.value.push({
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: url,
      })
      selectedSound.value = 'custom-' + (customSounds.value.length - 1)
    }
    reader.readAsDataURL(file)
  }
  if (target) target.value = ''
}

function deleteCustomSound(index: number) {
  if (selectedSound.value === 'custom-' + index) {
    selectedSound.value = 'beep'
  }
  customSounds.value.splice(index, 1)
}

function playNotification() {
  try {
    // Check if custom sound
    if (selectedSound.value.startsWith('custom-')) {
      const index = parseInt(selectedSound.value.replace('custom-', ''))
      const customSound = customSounds.value[index]
      if (customSound) {
        const audio = new Audio(customSound.url)
        audio.volume = 0.5
        audio.play()
        return
      }
    }

    // Built-in sounds
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    switch (selectedSound.value) {
      case 'beep':
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
        break
      case 'chime':
        oscillator.frequency.value = 1000
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
        break
      case 'alarm':
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.3)
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.6)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.8)
        break
      case 'ding':
        oscillator.frequency.value = 1200
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break
    }
  } catch (error) {
    console.error('Failed to play notification sound')
  }
}

function toggleKioskMode() {
  kioskMode.value = !kioskMode.value
  if (kioskMode.value) {
    document.documentElement.requestFullscreen().catch(() => {
      kioskMode.value = false
    })
  } else {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }
}

// Handle fullscreen changes
function handleFullscreenChange() {
  if (!document.fullscreenElement) {
    kioskMode.value = false
  }
}

document.addEventListener('fullscreenchange', handleFullscreenChange)

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (stopwatchInterval) clearInterval(stopwatchInterval)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>
