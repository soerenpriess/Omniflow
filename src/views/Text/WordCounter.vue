<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Count characters, words, sentences, and search for specific substrings in your text. Get
      detailed statistics and occurrence counts instantly.
    </p>
    <Card class="route-transition-animation mt-16 w-full max-w-4xl rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:counter" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Word Counter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
          <Label for="textinput" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:text-box" class="text-primary" />
            Enter your text
          </Label>
          <Textarea
            id="textinput"
            v-model="text"
            rows="6"
            :placeholder="defaultText"
            class="bg-background w-full resize-none rounded-lg border p-3 text-base"
            style="max-height: 200px; overflow-y: auto"
            @focus="handleFocus"
            @input="handleInput"
          />
        </div>

        <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
          <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:magnify" class="text-primary" />
            Search for substrings (comma separated)
          </Label>
          <Input
            v-model="substringInput"
            placeholder="e.g. e, and, test"
            class="bg-background w-full"
          />
        </div>

        <div
          class="border-primary/20 from-primary/5 to-primary/10 mt-6 rounded-lg border-2 bg-gradient-to-br p-4"
        >
          <div class="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Icon icon="mdi:chart-box" class="text-primary" />
            Statistics
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-background/50 flex flex-col gap-1 rounded-lg p-3">
              <span class="flex items-center gap-2 text-xs font-medium">
                <Icon icon="mdi:alphabetical" class="text-primary" />
                Characters (with spaces):
              </span>
              <span class="text-primary text-xl font-bold">{{ charCount }}</span>
            </div>
            <div class="bg-background/50 flex flex-col gap-1 rounded-lg p-3">
              <span class="flex items-center gap-2 text-xs font-medium">
                <Icon icon="mdi:alphabetical-variant" class="text-primary" />
                Characters (without spaces):
              </span>
              <span class="text-primary text-xl font-bold">{{ charCountNoSpaces }}</span>
            </div>
            <div class="bg-background/50 flex flex-col gap-1 rounded-lg p-3">
              <span class="flex items-center gap-2 text-xs font-medium">
                <Icon icon="mdi:text" class="text-primary" />
                Words:
              </span>
              <span class="text-primary text-xl font-bold">{{ wordCount }}</span>
            </div>
            <div class="bg-background/50 flex flex-col gap-1 rounded-lg p-3">
              <span class="flex items-center gap-2 text-xs font-medium">
                <Icon icon="mdi:text-box-multiple" class="text-primary" />
                Sentences:
              </span>
              <span class="text-primary text-xl font-bold">{{ sentenceCount }}</span>
            </div>
            <div class="bg-background/50 flex flex-col gap-1 rounded-lg p-3">
              <span class="flex items-center gap-2 text-xs font-medium">
                <Icon icon="mdi:space-invaders" class="text-primary" />
                Spaces:
              </span>
              <span class="text-primary text-xl font-bold">{{ spaceCount }}</span>
            </div>
          </div>
        </div>

        <div v-if="substrings.length" class="bg-muted/30 mt-6 rounded-lg border p-4">
          <h3 class="mb-3 flex items-center gap-2 font-semibold">
            <Icon icon="mdi:format-list-numbered" class="text-primary" />
            Occurrences for substrings:
          </h3>
          <ul class="space-y-2">
            <li
              v-for="s in substrings"
              :key="s"
              class="bg-background/50 flex items-center justify-between rounded-lg p-2"
            >
              <span class="flex items-center gap-2 font-medium">
                <Icon icon="mdi:magnify-plus" class="text-primary text-sm" />
                {{ s }}
              </span>
              <span class="text-primary text-lg font-bold">{{ substringCounts[s] }}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Icon } from '@iconify/vue'

const defaultText = `Type or paste your text here. This is a sample text for counting characters, words, sentences, and spaces.`
const text = ref(defaultText)
const substringInput = ref('')
const hasUserInteracted = ref(false)

function handleFocus() {
  if (!hasUserInteracted.value && text.value === defaultText) {
    text.value = ''
  }
}

function handleInput() {
  hasUserInteracted.value = true
}

function countWords(str: string) {
  return str.trim().split(/\s+/).filter(Boolean).length
}
function countSentences(str: string) {
  return str.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
}
function countSpaces(str: string) {
  return (str.match(/ /g) || []).length
}
function countSubstring(str: string, sub: string) {
  if (!sub) return 0
  return (str.toLowerCase().match(new RegExp(escapeRegExp(sub.toLowerCase()), 'g')) || []).length
}
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const charCount = computed(() => text.value.length)
const charCountNoSpaces = computed(() => text.value.replace(/\s/g, '').length)
const wordCount = computed(() => countWords(text.value))
const sentenceCount = computed(() => countSentences(text.value))
const spaceCount = computed(() => countSpaces(text.value))

const substrings = computed(() =>
  substringInput.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
)

const substringCounts = computed(() => {
  const result: Record<string, number> = {}
  for (const s of substrings.value) {
    result[s] = countSubstring(text.value, s)
  }
  return result
})
</script>
