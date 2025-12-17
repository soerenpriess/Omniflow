<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Test your typing speed and accuracy. Type the given text as quickly and accurately as
      possible!
    </p>
    <Card class="route-transition-animation w-full max-w-4xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center justify-between text-2xl font-semibold">
          <div class="flex items-center gap-2">
            <Icon icon="mdi:keyboard" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            Typing Speed Test
          </div>
          <div v-if="started && !finished" class="flex items-center gap-2">
            <Button
              @click="togglePause"
              variant="outline"
              size="sm"
              class="flex items-center gap-1"
            >
              <Icon :icon="isPaused ? 'mdi:play' : 'mdi:pause'" class="h-4 w-4" />
              {{ isPaused ? 'Resume' : 'Pause' }}
            </Button>
            <Button @click="reset" variant="outline" size="sm" class="flex items-center gap-1">
              <Icon icon="mdi:stop" class="h-4 w-4" />
              Stop
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <!-- Settings Section -->
          <div v-if="!started" class="space-y-5">
            <!-- Mode Selection -->
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="testMode = 'preset'"
                class="group relative overflow-hidden rounded-xl border-2 p-5 text-left transition-all"
                :class="{
                  'border-primary bg-primary/5': testMode === 'preset',
                  'border-border hover:border-primary/50 hover:bg-muted/50': testMode !== 'preset',
                }"
              >
                <div class="relative z-10">
                  <div class="mb-3 flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                      :class="testMode === 'preset' ? 'bg-primary/20' : 'bg-muted'"
                    >
                      <Icon
                        icon="mdi:bookmark-multiple"
                        class="h-5 w-5 transition-colors"
                        :class="testMode === 'preset' ? 'text-primary' : 'text-muted-foreground'"
                      />
                    </div>
                    <div class="flex-1">
                      <h3
                        class="font-semibold"
                        :class="testMode === 'preset' ? 'text-primary' : ''"
                      >
                        Preset Texts
                      </h3>
                    </div>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Choose from curated texts with different difficulty levels
                  </p>
                </div>
              </button>

              <button
                @click="testMode = 'custom'"
                class="group relative overflow-hidden rounded-xl border-2 p-5 text-left transition-all"
                :class="{
                  'border-primary bg-primary/5': testMode === 'custom',
                  'border-border hover:border-primary/50 hover:bg-muted/50': testMode !== 'custom',
                }"
              >
                <div class="relative z-10">
                  <div class="mb-3 flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                      :class="testMode === 'custom' ? 'bg-primary/20' : 'bg-muted'"
                    >
                      <Icon
                        icon="mdi:tune-variant"
                        class="h-5 w-5 transition-colors"
                        :class="testMode === 'custom' ? 'text-primary' : 'text-muted-foreground'"
                      />
                    </div>
                    <div class="flex-1">
                      <h3
                        class="font-semibold"
                        :class="testMode === 'custom' ? 'text-primary' : ''"
                      >
                        Custom Mode
                      </h3>
                    </div>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Configure your own test with custom length and time limits
                  </p>
                </div>
              </button>
            </div>

            <!-- Settings Content -->
            <div v-if="testMode === 'preset'" class="space-y-3">
              <div class="bg-muted/30 rounded-xl border p-5">
                <Label class="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Icon icon="mdi:target" class="text-primary h-5 w-5" />
                  Select Difficulty
                </Label>
                <div class="grid gap-2">
                  <button
                    v-for="level in ['easy', 'medium', 'hard']"
                    :key="level"
                    @click="difficulty = level"
                    class="flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all"
                    :class="{
                      'border-primary bg-primary/5': difficulty === level,
                      'border-border hover:border-primary/30 hover:bg-muted/30':
                        difficulty !== level,
                    }"
                  >
                    <Icon
                      :icon="
                        level === 'easy'
                          ? 'mdi:emoticon-happy-outline'
                          : level === 'medium'
                            ? 'mdi:emoticon-neutral-outline'
                            : 'mdi:emoticon-cool-outline'
                      "
                      class="h-6 w-6"
                      :class="{
                        'text-green-500': level === 'easy',
                        'text-yellow-500': level === 'medium',
                        'text-red-500': level === 'hard',
                      }"
                    />
                    <div class="flex-1">
                      <p class="font-medium capitalize">{{ level }}</p>
                      <p class="text-muted-foreground text-xs">
                        {{
                          level === 'easy'
                            ? 'Short & simple words'
                            : level === 'medium'
                              ? 'Normal sentences'
                              : 'Complex texts'
                        }}
                      </p>
                    </div>
                    <Icon
                      v-if="difficulty === level"
                      icon="mdi:check-circle"
                      class="text-primary h-5 w-5"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="space-y-3">
              <div class="bg-muted/30 rounded-xl border p-5">
                <Label class="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Icon icon="mdi:format-text" class="text-primary h-5 w-5" />
                  Test Type
                </Label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    @click="customType = 'words'"
                    class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all"
                    :class="{
                      'border-primary bg-primary/5': customType === 'words',
                      'border-border hover:border-primary/30 hover:bg-muted/30':
                        customType !== 'words',
                    }"
                  >
                    <Icon
                      icon="mdi:text"
                      class="h-7 w-7"
                      :class="customType === 'words' ? 'text-primary' : 'text-muted-foreground'"
                    />
                    <span class="text-sm font-medium">Words</span>
                  </button>
                  <button
                    @click="customType = 'characters'"
                    class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all"
                    :class="{
                      'border-primary bg-primary/5': customType === 'characters',
                      'border-border hover:border-primary/30 hover:bg-muted/30':
                        customType !== 'characters',
                    }"
                  >
                    <Icon
                      icon="mdi:alphabetical-variant"
                      class="h-7 w-7"
                      :class="
                        customType === 'characters' ? 'text-primary' : 'text-muted-foreground'
                      "
                    />
                    <span class="text-sm font-medium">Characters</span>
                  </button>
                </div>
              </div>

              <div class="bg-muted/30 rounded-xl border p-5">
                <Label class="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Icon icon="mdi:counter" class="text-primary h-5 w-5" />
                  {{ customType === 'words' ? 'Number of Words' : 'Number of Characters' }}
                </Label>
                <Input
                  v-if="customType === 'words'"
                  v-model.number="customWordCount"
                  type="number"
                  min="10"
                  max="500"
                  placeholder="e.g., 50"
                  class="text-base"
                  @blur="validateCustomInput"
                />
                <Input
                  v-else
                  v-model.number="customCharCount"
                  type="number"
                  min="50"
                  max="2000"
                  placeholder="e.g., 250"
                  class="text-base"
                  @blur="validateCustomInput"
                />
                <p
                  class="mt-2 text-xs font-medium"
                  :class="{
                    'text-muted-foreground': isInputValid,
                    'text-red-500': !isInputValid,
                  }"
                >
                  {{ customType === 'words' ? 'Range: 10-500 words' : 'Range: 50-2000 characters' }}
                </p>
              </div>

              <div class="bg-muted/30 rounded-xl border p-5">
                <div class="mb-3 flex items-center justify-between">
                  <Label class="flex items-center gap-2 text-sm font-semibold">
                    <Icon icon="mdi:timer-outline" class="text-primary h-5 w-5" />
                    Time Limit
                  </Label>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium">Enable</span>
                    <Switch v-model:checked="enableTimeLimit" />
                  </div>
                </div>
                <Input
                  v-model.number="timeLimit"
                  type="number"
                  min="30"
                  max="600"
                  placeholder="e.g., 60"
                  class="text-base"
                  :disabled="!enableTimeLimit"
                />
                <p class="text-muted-foreground mt-2 text-xs font-medium">Range: 30-600 seconds</p>
              </div>
            </div>
            <Button @click="start" class="h-12 w-full text-lg font-semibold">
              <Icon icon="mdi:play-circle" class="mr-2 h-5 w-5" />
              Start Typing Test
            </Button>
          </div>

          <!-- Active Test Section -->
          <div v-else-if="started && !finished" class="relative space-y-4">
            <!-- Ready Modal -->
            <div
              v-if="!isReady"
              class="bg-background/95 absolute inset-0 z-20 flex items-center justify-center rounded-lg backdrop-blur-sm"
            >
              <div class="text-center">
                <div
                  class="bg-primary/10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                >
                  <Icon icon="mdi:keyboard-space" class="text-primary h-10 w-10" />
                </div>
                <h3 class="mb-2 text-3xl font-bold">Get Ready!</h3>
                <p class="text-muted-foreground mb-4 text-base">
                  Press
                  <kbd class="bg-primary/20 mx-1 rounded border px-3 py-1.5 text-base font-semibold"
                    >Space</kbd
                  >
                  to start
                </p>
                <Button @click="startFromReady" size="lg" class="mb-4">
                  <Icon icon="mdi:play" class="mr-2 h-5 w-5" />
                  Start Test
                </Button>
                <div class="flex items-center justify-center gap-2">
                  <div class="bg-primary/20 h-2 w-2 animate-pulse rounded-full"></div>
                  <p class="text-muted-foreground text-sm">Waiting for your input...</p>
                </div>
              </div>
            </div>

            <!-- Pause Overlay -->
            <div
              v-if="isPaused"
              class="bg-background/95 absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm"
            >
              <div class="text-center">
                <Icon icon="mdi:pause-circle-outline" class="text-primary mx-auto mb-3 h-16 w-16" />
                <h3 class="mb-2 text-2xl font-bold">Paused</h3>
                <p class="text-muted-foreground mb-4 text-sm">Press Resume or Esc to continue</p>
                <Button @click="togglePause" class="mx-auto">
                  <Icon icon="mdi:play" class="mr-2 h-4 w-4" />
                  Resume
                </Button>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Progress</span>
                <span class="font-medium"
                  >{{ Math.round((typedText.length / textToType.length) * 100) }}%</span
                >
              </div>
              <div class="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  class="bg-primary h-full transition-all duration-300"
                  :style="{ width: `${(typedText.length / textToType.length) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- Live Stats -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div class="bg-muted/30 rounded-lg border p-3 text-center">
                <Icon icon="mdi:clock-outline" class="text-primary mx-auto mb-1 h-5 w-5" />
                <p class="text-muted-foreground text-xs">Time</p>
                <p class="text-2xl font-bold">{{ timeElapsed }}s</p>
                <p v-if="enableTimeLimit" class="text-muted-foreground mt-0.5 text-xs">
                  / {{ timeLimit }}s
                </p>
              </div>
              <div class="bg-muted/30 rounded-lg border p-3 text-center">
                <Icon icon="mdi:speedometer" class="text-primary mx-auto mb-1 h-5 w-5" />
                <p class="text-muted-foreground text-xs">WPM</p>
                <p class="text-2xl font-bold">{{ wpm }}</p>
              </div>
              <div class="bg-muted/30 rounded-lg border p-3 text-center">
                <Icon icon="mdi:flash" class="text-primary mx-auto mb-1 h-5 w-5" />
                <p class="text-muted-foreground text-xs">CPM</p>
                <p class="text-2xl font-bold">{{ cpm }}</p>
              </div>
              <div class="bg-muted/30 rounded-lg border p-3 text-center">
                <Icon icon="mdi:target" class="text-primary mx-auto mb-1 h-5 w-5" />
                <p class="text-muted-foreground text-xs">Accuracy</p>
                <p class="text-2xl font-bold">{{ accuracy }}%</p>
              </div>
            </div>

            <!-- Error Counter -->
            <div
              v-if="errorCount > 0"
              class="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
            >
              <div class="flex items-center gap-2">
                <Icon icon="mdi:alert-circle" class="h-5 w-5 text-red-600 dark:text-red-400" />
                <p class="text-sm text-red-700 dark:text-red-300">
                  <span class="font-semibold">{{ errorCount }}</span> error{{
                    errorCount !== 1 ? 's' : ''
                  }}
                  detected
                </p>
              </div>
            </div>

            <!-- Text Display -->
            <div
              class="bg-muted/30 relative max-h-64 overflow-y-auto rounded-lg border p-6"
              ref="textDisplayRef"
            >
              <div class="text-muted-foreground absolute top-3 right-3 text-xs">
                {{ typedText.length }}/{{ textToType.length }} chars
              </div>
              <p class="pr-16 text-xl leading-relaxed" :class="{ 'blur-sm': isPaused }">
                <span
                  v-for="(char, idx) in textToType"
                  :key="idx"
                  :ref="
                    (el) => {
                      if (el) charRefs[idx] = el as HTMLElement
                    }
                  "
                  :class="{
                    'font-medium text-green-600 dark:text-green-400':
                      idx < typedText.length && typedText[idx] === char,
                    'rounded bg-red-100 px-0.5 font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400':
                      idx < typedText.length && typedText[idx] !== char,
                    'bg-primary/30 animate-pulse rounded px-0.5': idx === typedText.length,
                  }"
                  >{{ char === ' ' ? '\u2423' : char }}</span
                >
              </p>
            </div>

            <!-- Input Area -->
            <div>
              <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:keyboard" class="text-primary" />
                Type here
              </Label>
              <textarea
                ref="inputRef"
                v-model="typedText"
                @input="handleInput"
                @keydown="handleKeydown"
                :disabled="finished || isPaused || !isReady"
                rows="4"
                placeholder="Start typing the text above..."
                class="bg-background border-input ring-offset-background focus:ring-ring flex w-full rounded-md border px-4 py-3 font-mono text-base focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                autofocus
                spellcheck="false"
              ></textarea>
              <p class="text-muted-foreground mt-1 text-xs">
                Tip: Focus on accuracy first, speed will follow naturally
              </p>
            </div>
          </div>
          <!-- Results Section -->
          <div
            v-if="finished"
            class="border-primary/20 from-primary/5 via-primary/10 to-primary/5 space-y-4 rounded-xl border-2 bg-gradient-to-br p-6"
          >
            <div class="text-center">
              <div
                class="bg-primary/10 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full"
              >
                <Icon icon="mdi:trophy" class="text-primary h-8 w-8" />
              </div>
              <h3 class="text-2xl font-bold">Test Complete!</h3>
              <p class="text-muted-foreground mt-1 text-sm">Great job! Here are your results:</p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div class="bg-background/50 rounded-lg border p-4 text-center">
                <Icon icon="mdi:clock-check-outline" class="text-primary mx-auto mb-2 h-6 w-6" />
                <p class="text-muted-foreground text-xs font-medium">Time Taken</p>
                <p class="text-primary text-3xl font-bold">{{ finalTime }}s</p>
              </div>
              <div class="bg-background/50 rounded-lg border p-4 text-center">
                <Icon icon="mdi:speedometer" class="text-primary mx-auto mb-2 h-6 w-6" />
                <p class="text-muted-foreground text-xs font-medium">Words Per Minute</p>
                <p class="text-primary text-3xl font-bold">{{ finalWpm }}</p>
              </div>
              <div class="bg-background/50 rounded-lg border p-4 text-center">
                <Icon icon="mdi:flash" class="text-primary mx-auto mb-2 h-6 w-6" />
                <p class="text-muted-foreground text-xs font-medium">Characters Per Minute</p>
                <p class="text-primary text-3xl font-bold">{{ finalCpm }}</p>
              </div>
              <div class="bg-background/50 rounded-lg border p-4 text-center">
                <Icon icon="mdi:target-account" class="text-primary mx-auto mb-2 h-6 w-6" />
                <p class="text-muted-foreground text-xs font-medium">Accuracy</p>
                <p
                  class="text-3xl font-bold"
                  :class="{
                    'text-green-600 dark:text-green-400': accuracy >= 95,
                    'text-yellow-600 dark:text-yellow-400': accuracy >= 85 && accuracy < 95,
                    'text-red-600 dark:text-red-400': accuracy < 85,
                  }"
                >
                  {{ accuracy }}%
                </p>
              </div>
              <div class="bg-background/50 rounded-lg border p-4 text-center">
                <Icon icon="mdi:format-letter-case" class="text-primary mx-auto mb-2 h-6 w-6" />
                <p class="text-muted-foreground text-xs font-medium">Correct Characters</p>
                <p class="text-3xl font-bold">
                  {{ correctChars
                  }}<span class="text-muted-foreground text-lg">/{{ textToType.length }}</span>
                </p>
              </div>
              <div class="bg-background/50 rounded-lg border p-4 text-center">
                <Icon icon="mdi:alert-circle-outline" class="text-primary mx-auto mb-2 h-6 w-6" />
                <p class="text-muted-foreground text-xs font-medium">Total Errors</p>
                <p class="text-3xl font-bold">{{ errorCount }}</p>
              </div>
              <div class="bg-background/50 rounded-lg border p-4 text-center">
                <Icon icon="mdi:percent-outline" class="text-primary mx-auto mb-2 h-6 w-6" />
                <p class="text-muted-foreground text-xs font-medium">Error Rate</p>
                <p class="text-3xl font-bold">{{ errorRate }}%</p>
              </div>
              <div class="bg-background/50 rounded-lg border p-4 text-center">
                <Icon icon="mdi:trophy-variant" class="text-primary mx-auto mb-2 h-6 w-6" />
                <p class="text-muted-foreground text-xs font-medium">Performance</p>
                <p class="text-3xl font-bold">{{ performanceRating }}</p>
              </div>
            </div>

            <!-- Performance Message -->
            <div
              class="rounded-lg p-4 text-center"
              :class="{
                'bg-green-50 dark:bg-green-900/20': accuracy >= 95,
                'bg-yellow-50 dark:bg-yellow-900/20': accuracy >= 85 && accuracy < 95,
                'bg-red-50 dark:bg-red-900/20': accuracy < 85,
              }"
            >
              <p
                class="font-medium"
                :class="{
                  'text-green-700 dark:text-green-300': accuracy >= 95,
                  'text-yellow-700 dark:text-yellow-300': accuracy >= 85 && accuracy < 95,
                  'text-red-700 dark:text-red-300': accuracy < 85,
                }"
              >
                {{ performanceMessage }}
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <Button @click="restart" variant="outline" class="h-11">
                <Icon icon="mdi:restart" class="mr-2 h-4 w-4" />
                Same Settings
              </Button>
              <Button @click="reset" class="h-11">
                <Icon icon="mdi:cog" class="mr-2 h-4 w-4" />
                New Settings
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

const easyTexts = [
  'The sun is bright today. Birds are singing in the trees.',
  'I love to read books. Reading is fun and interesting.',
  'Cats and dogs are popular pets. They make us happy.',
  'Music makes me feel good. I enjoy listening to songs.',
  'Flowers bloom in spring. They are colorful and pretty.',
]

const mediumTexts = [
  'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet.',
  'Practice makes perfect. The more you type, the faster you will become at typing.',
  'Technology changes our lives every day. We use computers and phones constantly.',
  'Learning new skills requires dedication and patience. Never give up on your goals.',
  'Nature provides us with beautiful landscapes and fresh air to breathe.',
  'Cooking delicious meals brings joy to people around the world.',
  'Exercise keeps our body and mind healthy and strong.',
]

const hardTexts = [
  'Programming is the art of telling another human what one wants the computer to do. It requires logic, creativity, and problem-solving skills.',
  'The complexity of modern software development necessitates comprehensive understanding of algorithms, data structures, and design patterns.',
  'Quantum computing represents a paradigm shift in computational capabilities, utilizing superposition and entanglement principles.',
  'Artificial intelligence and machine learning algorithms continuously evolve, transforming industries through automation and predictive analytics.',
  'Cybersecurity professionals vigilantly protect digital infrastructure against sophisticated threats and vulnerabilities.',
  'Blockchain technology decentralizes trust through cryptographic consensus mechanisms and distributed ledger systems.',
]

const textToType = ref('')
const typedText = ref('')
const started = ref(false)
const finished = ref(false)
const isPaused = ref(false)
const isReady = ref(false)
const timeElapsed = ref(0)
const startTime = ref(0)
const difficulty = ref('medium')
const duration = ref(60)
const testMode = ref('preset')
const customWordCount = ref(50)
const customCharCount = ref(250)
const customType = ref('words')
const enableTimeLimit = ref(false)
const timeLimit = ref(60)
const errorCount = ref(0)
const isInputValid = ref(true)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const textDisplayRef = ref<HTMLDivElement | null>(null)
const currentCharRef = ref<HTMLElement | null>(null)
const charRefs = ref<(HTMLElement | null)[]>([])
let timer: any = null
let pauseStartTime = 0
let totalPausedTime = 0

const wpm = computed(() => {
  const words = typedText.value.trim().split(/\s+/).length
  const minutes = timeElapsed.value / 60
  return minutes > 0 ? Math.round(words / minutes) : 0
})

const cpm = computed(() => {
  const minutes = timeElapsed.value / 60
  return minutes > 0 ? Math.round(typedText.value.length / minutes) : 0
})

const correctChars = computed(() => {
  let correct = 0
  for (let i = 0; i < typedText.value.length; i++) {
    if (typedText.value[i] === textToType.value[i]) correct++
  }
  return correct
})

const accuracy = computed(() => {
  if (typedText.value.length === 0) return 100
  return Math.round((correctChars.value / typedText.value.length) * 100)
})

const errorRate = computed(() => {
  if (typedText.value.length === 0) return 0
  return Math.round(((typedText.value.length - correctChars.value) / typedText.value.length) * 100)
})

const performanceRating = computed(() => {
  if (wpm.value >= 80 && accuracy.value >= 95) return 'S'
  if (wpm.value >= 60 && accuracy.value >= 90) return 'A'
  if (wpm.value >= 40 && accuracy.value >= 85) return 'B'
  if (wpm.value >= 25 && accuracy.value >= 80) return 'C'
  return 'D'
})

const performanceMessage = computed(() => {
  const rating = performanceRating.value
  if (rating === 'S') return "🎉 Outstanding! You're a typing master!"
  if (rating === 'A') return '🌟 Excellent work! Very impressive speed and accuracy!'
  if (rating === 'B') return '👍 Good job! Keep practicing to improve further!'
  if (rating === 'C') return "💪 Nice effort! With more practice, you'll get faster!"
  return '🎯 Keep trying! Practice makes perfect!'
})

const finalWpm = ref(0)
const finalCpm = ref(0)
const finalTime = ref(0)

// Global keyboard listener for ready modal
function handleGlobalKeydown(event: KeyboardEvent) {
  if (started.value && !isReady.value && !finished.value && event.key === ' ') {
    event.preventDefault()
    startFromReady()
  }
}

// Auto-scroll watcher - scrolls ahead to show next 10 characters
watch(typedText, () => {
  if (!isReady.value || isPaused.value) return

  nextTick(() => {
    const currentIndex = typedText.value.length
    // Look ahead 10 characters (or less if near the end)
    const lookAheadIndex = Math.min(currentIndex + 10, textToType.value.length - 1)
    const lookAheadChar = charRefs.value[lookAheadIndex]

    if (lookAheadChar) {
      lookAheadChar.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  })
})

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('keydown', handleGlobalKeydown)
})

function generateRandomText(count: number, type: 'words' | 'characters'): string {
  const commonWords = [
    'the',
    'be',
    'to',
    'of',
    'and',
    'a',
    'in',
    'that',
    'have',
    'it',
    'for',
    'not',
    'on',
    'with',
    'he',
    'as',
    'you',
    'do',
    'at',
    'this',
    'but',
    'his',
    'by',
    'from',
    'they',
    'we',
    'say',
    'her',
    'she',
    'or',
    'an',
    'will',
    'my',
    'one',
    'all',
    'would',
    'there',
    'their',
    'what',
    'so',
    'up',
    'out',
    'if',
    'about',
    'who',
    'get',
    'which',
    'go',
    'me',
    'when',
    'make',
    'can',
    'like',
    'time',
    'no',
    'just',
    'him',
    'know',
    'take',
    'people',
    'into',
    'year',
    'your',
    'good',
    'some',
    'could',
    'them',
    'see',
    'other',
    'than',
    'then',
    'now',
    'look',
    'only',
    'come',
    'its',
    'over',
    'think',
    'also',
    'back',
    'after',
    'use',
    'two',
    'how',
    'our',
    'work',
    'first',
    'well',
    'way',
    'even',
    'new',
    'want',
    'because',
    'any',
    'these',
    'give',
    'day',
    'most',
    'us',
    'is',
  ]

  if (type === 'words') {
    const words: string[] = []
    for (let i = 0; i < count; i++) {
      words.push(commonWords[Math.floor(Math.random() * commonWords.length)])
    }
    return words.join(' ')
  } else {
    let text = ''
    while (text.length < count) {
      const word = commonWords[Math.floor(Math.random() * commonWords.length)]
      if (text.length + word.length + 1 <= count) {
        text += (text.length > 0 ? ' ' : '') + word
      } else {
        break
      }
    }
    return text
  }
}

function validateCustomInput() {
  if (customType.value === 'words') {
    if (customWordCount.value < 10) {
      customWordCount.value = 10
      isInputValid.value = false
      setTimeout(() => (isInputValid.value = true), 2000)
    } else if (customWordCount.value > 500) {
      customWordCount.value = 500
      isInputValid.value = false
      setTimeout(() => (isInputValid.value = true), 2000)
    }
  } else {
    if (customCharCount.value < 50) {
      customCharCount.value = 50
      isInputValid.value = false
      setTimeout(() => (isInputValid.value = true), 2000)
    } else if (customCharCount.value > 2000) {
      customCharCount.value = 2000
      isInputValid.value = false
      setTimeout(() => (isInputValid.value = true), 2000)
    }
  }
}

function start() {
  // Validate custom inputs before starting
  if (testMode.value === 'custom') {
    validateCustomInput()
    if (customType.value === 'words') {
      textToType.value = generateRandomText(customWordCount.value, 'words')
    } else {
      textToType.value = generateRandomText(customCharCount.value, 'characters')
    }
  } else {
    let selectedTexts = mediumTexts
    if (difficulty.value === 'easy') selectedTexts = easyTexts
    else if (difficulty.value === 'hard') selectedTexts = hardTexts
    textToType.value = selectedTexts[Math.floor(Math.random() * selectedTexts.length)]
  }

  typedText.value = ''
  started.value = true
  finished.value = false
  isPaused.value = false
  isReady.value = false
  timeElapsed.value = 0
  errorCount.value = 0
  totalPausedTime = 0
  charRefs.value = []
}

function startFromReady() {
  isReady.value = true
  startTimer()
}

function startTimer() {
  startTime.value = Date.now()

  timer = setInterval(() => {
    if (!isPaused.value) {
      timeElapsed.value++
      // Check time limit
      if (enableTimeLimit.value && timeElapsed.value >= timeLimit.value) {
        finish()
      }
    }
  }, 1000)

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

function handleInput() {
  // Count errors
  let errors = 0
  for (let i = 0; i < typedText.value.length; i++) {
    if (typedText.value[i] !== textToType.value[i]) errors++
  }
  errorCount.value = errors

  // Check if test is complete
  if (typedText.value.length >= textToType.value.length) {
    finish()
  }
}

function handleKeydown(event: KeyboardEvent) {
  // Pause/Resume with Esc
  if (event.key === 'Escape') {
    event.preventDefault()
    togglePause()
  }
  // Restart with Ctrl+R
  if (event.ctrlKey && event.key === 'r') {
    event.preventDefault()
    restart()
  }
}

function togglePause() {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    pauseStartTime = Date.now()
  } else {
    totalPausedTime += Date.now() - pauseStartTime
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
  }
}

function finish() {
  if (timer) clearInterval(timer)
  finished.value = true
  finalWpm.value = wpm.value
  finalCpm.value = cpm.value
  finalTime.value = timeElapsed.value
}

function restart() {
  // Restart with same settings
  typedText.value = ''
  started.value = true
  finished.value = false
  isPaused.value = false
  isReady.value = false
  timeElapsed.value = 0
  errorCount.value = 0
  totalPausedTime = 0

  if (timer) clearInterval(timer)
  // Show ready modal again
}

function reset() {
  started.value = false
  finished.value = false
  isPaused.value = false
  isReady.value = false
  typedText.value = ''
  timeElapsed.value = 0
  errorCount.value = 0
  totalPausedTime = 0
  if (timer) clearInterval(timer)
}
</script>
