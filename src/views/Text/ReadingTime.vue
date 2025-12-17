<template>
  <div
    class="flex h-full w-full flex-col items-center justify-start px-4 py-6 sm:justify-center sm:px-6"
  >
    <div class="w-full max-w-2xl lg:max-w-lg">
      <div class="mb-4 text-center">
        <p class="text-muted-foreground text-sm">
          Estimate reading time for your text. Simply paste your text below, and we'll calculate the
          approximate time needed to read it based on average reading speed.
        </p>
      </div>
      <Card class="route-transition-animation w-full rounded-2xl shadow-lg">
        <CardHeader class="space-y-1">
          <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
            <Icon icon="mdi:book-clock" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            Reading Time Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
              <Label for="text" class="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:text" class="text-primary" />
                Your Text
              </Label>
              <textarea
                id="text"
                v-model="text"
                rows="10"
                placeholder="Paste your text here..."
                class="bg-background border-input ring-offset-background focus:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
              ></textarea>
            </div>
            <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
              <Label for="wpm" class="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:speedometer" class="text-primary" />
                Reading Speed (words per minute)
              </Label>
              <Input
                id="wpm"
                v-model.number="wordsPerMinute"
                type="number"
                min="100"
                max="400"
                step="10"
                placeholder="Default: 200"
                class="bg-background text-lg font-medium"
              />
              <p class="text-muted-foreground mt-1 text-xs">Average: 200 wpm, Fast: 300 wpm</p>
            </div>
          </div>
          <div
            v-if="text.length > 0"
            class="border-primary/20 from-primary/5 to-primary/10 mt-6 space-y-3 rounded-lg border-2 bg-gradient-to-br p-4"
          >
            <div class="flex items-center justify-between text-lg">
              <span class="flex items-center gap-2 font-medium">
                <Icon icon="mdi:file-word" class="text-primary" />
                Word Count:
              </span>
              <span class="text-xl font-bold">{{ wordCount }}</span>
            </div>
            <div class="flex items-center justify-between text-lg">
              <span class="flex items-center gap-2 font-medium">
                <Icon icon="mdi:format-letter-case" class="text-primary" />
                Character Count:
              </span>
              <span class="text-xl font-bold">{{ characterCount }}</span>
            </div>
            <div class="flex items-center justify-between text-lg">
              <span class="flex items-center gap-2 font-medium">
                <Icon icon="mdi:format-paragraph" class="text-primary" />
                Paragraphs:
              </span>
              <span class="text-xl font-bold">{{ paragraphCount }}</span>
            </div>
            <div class="flex items-center justify-between text-lg">
              <span class="flex items-center gap-2 font-medium">
                <Icon icon="mdi:clock-outline" class="text-primary" />
                Reading Time:
              </span>
              <span class="text-primary text-2xl font-bold">{{ readingTime }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const text = ref('')
const wordsPerMinute = ref(200)

const wordCount = computed(() => {
  if (!text.value.trim()) return 0
  return text.value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
})

const characterCount = computed(() => {
  return text.value.length
})

const paragraphCount = computed(() => {
  if (!text.value.trim()) return 0
  return text.value.split(/\n\n+/).filter((p) => p.trim().length > 0).length
})

const readingTime = computed(() => {
  const minutes = Math.ceil(wordCount.value / wordsPerMinute.value)
  if (minutes < 1) return '< 1 min'
  if (minutes === 1) return '1 min'
  return `${minutes} min`
})
</script>
