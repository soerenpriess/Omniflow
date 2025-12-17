<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Transform and manipulate text with various formatting options. Convert case, remove spaces,
      reverse text, and more with just one click.
    </p>
    <Card class="route-transition-animation mt-16 w-full max-w-2xl rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:text-box-multiple" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Text Tools
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
            placeholder="Type or paste your text here..."
            class="bg-background w-full resize-none rounded-lg border p-3 text-base"
            style="max-height: 150px; overflow-y: auto"
          />
        </div>

        <div class="mb-4 grid grid-cols-2 gap-2">
          <button
            class="bg-primary hover:bg-primary/90 transition; flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white"
            @click="toUppercase"
          >
            <Icon icon="mdi:format-letter-case-upper" />
            Uppercase
          </button>
          <button
            class="bg-primary hover:bg-primary/90 transition; flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white"
            @click="toLowercase"
          >
            <Icon icon="mdi:format-letter-case-lower" />
            Lowercase
          </button>
          <button
            class="bg-primary hover:bg-primary/90 transition; flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white"
            @click="capitalizeWords"
          >
            <Icon icon="mdi:format-letter-case" />
            Capitalize Words
          </button>
          <button
            class="bg-primary hover:bg-primary/90 transition; flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white"
            @click="removeExtraSpaces"
          >
            <Icon icon="mdi:format-letter-spacing" />
            Remove Spaces
          </button>
          <button
            class="bg-primary hover:bg-primary/90 transition; flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white"
            @click="reverseText"
          >
            <Icon icon="mdi:format-horizontal-align-right" />
            Reverse Text
          </button>
          <button
            class="bg-primary hover:bg-primary/90 transition; flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white"
            @click="removeLineBreaks"
          >
            <Icon icon="mdi:format-line-spacing" />
            Remove Breaks
          </button>
          <button
            class="bg-primary hover:bg-primary/90 transition; flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white"
            @click="toSentenceCase"
          >
            <Icon icon="mdi:format-letter-starts-with" />
            Sentence Case
          </button>
          <button
            class="bg-primary hover:bg-primary/90 transition; flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-white"
            @click="toAlternatingCase"
          >
            <Icon icon="mdi:format-letter-matches" />
            Alternating Case
          </button>
        </div>

        <div class="from-primary/5 to-primary/10 mb-4 rounded-lg border bg-gradient-to-br p-4">
          <div class="mb-2 flex items-center gap-2 font-medium">
            <Icon icon="mdi:chart-bar" class="text-primary" />
            Statistics
          </div>
          <div class="flex flex-col gap-2">
            <span class="flex items-center gap-2 text-sm">
              <Icon icon="mdi:alphabetical" class="text-primary" />
              Characters: <span class="font-bold">{{ result.length }}</span>
            </span>
            <span class="flex items-center gap-2 text-sm">
              <Icon icon="mdi:text" class="text-primary" />
              Words: <span class="font-bold">{{ wordCount }}</span>
            </span>
          </div>
        </div>

        <div class="mb-4">
          <Label for="result">Result</Label>
          <Textarea
            id="result"
            v-model="result"
            rows="6"
            readonly
            class="mt-2 w-full resize-none rounded-lg border p-3 text-base"
            style="max-height: 150px; overflow-y: auto"
          />
        </div>

        <div class="relative flex items-center justify-end">
          <Button size="sm" variant="outline" @click="copyToClipboard">
            {{ copied ? 'Copied!' : 'Copy' }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

const text = ref('')
const result = ref('')
const copied = ref(false)

const wordCount = computed(() =>
  result.value.trim() ? result.value.trim().split(/\s+/).length : 0,
)

function toUppercase() {
  result.value = text.value.toUpperCase()
}
function toLowercase() {
  result.value = text.value.toLowerCase()
}
function capitalizeWords() {
  result.value = text.value.replace(
    /\w\S*/g,
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
  )
}
function removeExtraSpaces() {
  result.value = text.value.replace(/\s+/g, ' ').trim()
}
function reverseText() {
  result.value = text.value.split('').reverse().join('')
}
function removeLineBreaks() {
  result.value = text.value.replace(/[\r\n]+/g, ' ')
}
function toSentenceCase() {
  result.value = text.value.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase())
}
function toAlternatingCase() {
  result.value = text.value
    .split('')
    .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
    .join('')
}

function copyToClipboard() {
  if (!result.value) return
  navigator.clipboard.writeText(result.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1200)
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 8px;
  background: #f3f4f6;
  border-radius: 8px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #a3a3a3;
  border-radius: 8px;
}
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #a3a3a3 #f3f4f6;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.95);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.animate-bounce {
  animation: bounce 0.6s;
}
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
