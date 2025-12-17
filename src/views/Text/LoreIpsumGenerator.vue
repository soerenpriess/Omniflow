<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate placeholder text for your designs by words, characters, or paragraphs. Perfect for
      mockups and wireframes.
    </p>
    <Card class="route-transition-animation mt-16 w-full max-w-2xl rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:format-text" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Lorem Ipsum Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
          <Label for="type" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:format-list-bulleted-type" class="text-primary" />
            Select length by
          </Label>
          <Select v-model="lengthType">
            <SelectTrigger id="type" class="bg-background w-full text-base font-medium">
              <SelectValue placeholder="Choose type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="words">Words</SelectItem>
              <SelectItem value="chars">Characters</SelectItem>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
          <Label for="amount" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:numeric" class="text-primary" />
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            min="1"
            v-model.number="amount"
            class="bg-background w-full text-lg font-medium"
          />
        </div>

        <Button class="mb-4 h-12 w-full text-lg font-semibold" @click="generateLorem">
          <Icon icon="mdi:creation" class="mr-2" />
          Generate Lorem Ipsum
        </Button>

        <div v-if="loremText" class="mb-4">
          <Label for="lorem">Generated Text</Label>
          <Textarea
            id="lorem"
            v-model="loremText"
            rows="6"
            readonly
            class="mt-2 w-full resize-none rounded-lg border p-3 text-base"
            style="max-height: 200px; overflow-y: auto"
          />
        </div>

        <div v-if="loremText" class="flex justify-end">
          <Button size="sm" variant="outline" @click="copyToClipboard">
            {{ copied ? 'Copied!' : 'Copy' }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
const lengthType = ref<'words' | 'chars' | 'paragraphs'>('words')
const amount = ref(30)

const loremText = ref('')
const copied = ref(false)

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.'

function generateLorem() {
  copied.value = false
  if (lengthType.value === 'words') {
    loremText.value = generateWords(amount.value)
  } else if (lengthType.value === 'chars') {
    loremText.value = generateChars(amount.value)
  } else if (lengthType.value === 'paragraphs') {
    loremText.value = generateParagraphs(amount.value)
  }
}

function generateWords(n: number) {
  const words = LOREM.split(/\s+/)
  let result = []
  while (result.length < n) {
    result = result.concat(words)
  }
  return result.slice(0, n).join(' ')
}

function generateChars(n: number) {
  let text = ''
  while (text.length < n) {
    text += LOREM + ' '
  }
  return text.slice(0, n)
}

function generateParagraphs(n: number) {
  let para = []
  for (let i = 0; i < n; i++) {
    para.push(LOREM)
  }
  return para.join('\n\n')
}

function copyToClipboard() {
  if (!loremText.value) return
  navigator.clipboard.writeText(loremText.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>
