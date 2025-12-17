<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert special characters to HTML entities and vice versa
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:code-tags" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          HTML Entity Encoder
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Mode Toggle -->
        <div class="grid grid-cols-2 gap-2">
          <Button
            @click="mode = 'encode'"
            :variant="mode === 'encode' ? 'default' : 'outline'"
            class="h-9 text-xs sm:h-10 sm:text-sm"
          >
            <Icon icon="mdi:lock" class="mr-1.5 h-4 w-4" />
            Encode
          </Button>
          <Button
            @click="mode = 'decode'"
            :variant="mode === 'decode' ? 'default' : 'outline'"
            class="h-9 text-xs sm:h-10 sm:text-sm"
          >
            <Icon icon="mdi:lock-open" class="mr-1.5 h-4 w-4" />
            Decode
          </Button>
        </div>

        <!-- Input -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs sm:text-sm">{{
              mode === 'encode' ? 'Plain Text' : 'HTML Entities'
            }}</Label>
            <Button @click="input = ''" variant="ghost" size="sm" class="h-6 text-xs">
              <Icon icon="mdi:close" class="mr-1 h-3 w-3" />
              Clear
            </Button>
          </div>
          <Textarea
            v-model="input"
            :placeholder="
              mode === 'encode' ? 'Enter text to encode...' : 'Enter HTML entities to decode...'
            "
            class="min-h-[150px] font-mono text-xs sm:min-h-[200px] sm:text-sm"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <Button @click="process" class="h-9 flex-1 text-xs sm:h-10 sm:text-sm">
            <Icon icon="mdi:arrow-down" class="mr-2 h-4 w-4" />
            {{ mode === 'encode' ? 'Encode' : 'Decode' }}
          </Button>
          <Button @click="swap" variant="outline" class="h-9 text-xs sm:h-10 sm:text-sm">
            <Icon icon="mdi:swap-vertical" class="h-4 w-4" />
          </Button>
        </div>

        <!-- Output -->
        <div v-if="output" class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs sm:text-sm">{{
              mode === 'encode' ? 'HTML Entities' : 'Plain Text'
            }}</Label>
            <Button @click="copyOutput" variant="ghost" size="sm" class="h-6 text-xs">
              <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" class="mr-1 h-3 w-3" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <Textarea
            v-model="output"
            readonly
            class="min-h-[150px] font-mono text-xs sm:min-h-[200px] sm:text-sm"
          />
        </div>

        <!-- Common Entities Reference -->
        <div class="bg-muted/30 rounded-lg border p-2 sm:p-3">
          <Label class="mb-2 text-xs font-semibold sm:text-sm">Common HTML Entities</Label>
          <div class="grid grid-cols-2 gap-1.5 text-[10px] sm:gap-2 sm:text-xs">
            <div class="flex justify-between">
              <span>&lt;</span>
              <span class="text-muted-foreground">&amp;lt;</span>
            </div>
            <div class="flex justify-between">
              <span>&gt;</span>
              <span class="text-muted-foreground">&amp;gt;</span>
            </div>
            <div class="flex justify-between">
              <span>&amp;</span>
              <span class="text-muted-foreground">&amp;amp;</span>
            </div>
            <div class="flex justify-between">
              <span>&quot;</span>
              <span class="text-muted-foreground">&amp;quot;</span>
            </div>
            <div class="flex justify-between">
              <span>&apos;</span>
              <span class="text-muted-foreground">&amp;apos;</span>
            </div>
            <div class="flex justify-between">
              <span>Space</span>
              <span class="text-muted-foreground">&amp;nbsp;</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@iconify/vue'

const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')
const output = ref('')
const copied = ref(false)

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '§': '&sect;',
  '¶': '&para;',
  '•': '&bull;',
  '…': '&hellip;',
  '–': '&ndash;',
  '—': '&mdash;',
  ' ': '&nbsp;',
}

function process() {
  if (!input.value.trim()) {
    console.error('Please enter some text')
    return
  }

  try {
    if (mode.value === 'encode') {
      output.value = encodeHtml(input.value)
    } else {
      output.value = decodeHtml(input.value)
    }
  } catch (error) {
    output.value = ''
  }
}

function encodeHtml(text: string): string {
  return text.replace(/[&<>"'©®™€£¥§¶•…–— ]/g, (char) => htmlEntities[char] || char)
}

function decodeHtml(text: string): string {
  const reverseEntities = Object.fromEntries(
    Object.entries(htmlEntities).map(([key, value]) => [value, key]),
  )

  return text.replace(/&[a-z]+;/gi, (entity) => reverseEntities[entity] || entity)
}

function swap() {
  if (output.value) {
    const temp = input.value
    input.value = output.value
    output.value = temp
    mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  }
}

function copyOutput() {
  if (output.value) {
    navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  }
}
</script>
