<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate cryptographic SHA hashes from text using SHA-1, SHA-256, SHA-384, or SHA-512
      algorithms. Ideal for data integrity verification and checksum generation.
    </p>
    <Card class="route-transition-animation w-full max-w-xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="lucide:hash" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          SHA Hash Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="mb-4 rounded-lg border p-4">
          <Label for="hashType" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:algorithm" class="text-primary" />
            Hash Algorithm
          </Label>

          <!-- Hash Algorithm Selection -->
          <Select v-model="hashType">
            <SelectTrigger id="hashType" class="bg-background w-full text-base font-medium">
              <SelectValue placeholder="Select SHA algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SHA-1">SHA1</SelectItem>
              <SelectItem value="SHA-256">SHA256</SelectItem>
              <SelectItem value="SHA-384">SHA384</SelectItem>
              <SelectItem value="SHA-512">SHA512</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Text Input -->
        <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
          <Label for="inputText" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:text" class="text-primary" />
            Text
          </Label>
          <Textarea
            id="inputText"
            v-model="inputText"
            rows="4"
            placeholder="Enter text"
            class="bg-background w-full resize-none rounded-lg border p-3 text-base"
          />
        </div>

        <!-- Generate Button -->
        <Button
          class="h-12 w-full text-lg font-semibold"
          :disabled="!inputText"
          @click="generateHash"
        >
          <Icon icon="mdi:pound-box" class="mr-2" />
          Generate Hash
        </Button>

        <!-- Hash Result -->
        <div v-if="hashResult" class="mt-4 flex flex-col gap-2">
          <Label>Hash</Label>
          <Textarea
            v-model="hashResult"
            rows="3"
            readonly
            class="w-full resize-none rounded-lg border p-3 font-mono text-sm"
          />
          <Button size="sm" variant="outline" @click="copyToClipboard(hashResult)">
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
import { Button } from '@/components/ui/button'
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

const inputText = ref('')
const hashResult = ref('')
const hashType = ref<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256')
const copied = ref(false)

async function generateHash() {
  const encoder = new TextEncoder()
  const data = encoder.encode(inputText.value)
  const hashBuffer = await window.crypto.subtle.digest(hashType.value, data)
  hashResult.value = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>
