<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate universally unique identifiers (UUIDs) in different versions. Perfect for database
      keys, session IDs, and unique identifiers.
    </p>
    <Card class="route-transition-animation w-full max-w-xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:identifier" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          UUID Generator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- UUID Version Selection -->
        <div class="rounded-lg border p-4">
          <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:format-list-numbered" class="text-primary" />
            UUID Version
          </Label>
          <Select v-model="uuidVersion">
            <SelectTrigger class="bg-background w-full text-base font-medium">
              <SelectValue placeholder="Select UUID version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v4">Version 4 (Random)</SelectItem>
              <SelectItem value="v1">Version 1 (Timestamp)</SelectItem>
            </SelectContent>
          </Select>
          <p class="text-muted-foreground mt-2 text-xs">
            {{
              uuidVersion === 'v4'
                ? 'Random UUID based on random numbers'
                : 'Timestamp-based UUID with node ID'
            }}
          </p>
        </div>

        <!-- Generation Controls -->
        <div class="space-y-2">
          <Label for="quantity">Number of UUIDs</Label>
          <div class="flex gap-2">
            <Input
              id="quantity"
              v-model.number="bulkQuantity"
              type="number"
              min="1"
              max="100"
              placeholder="1-100"
              class="flex-1"
            />
            <Button class="px-8" @click="generateBulkUUIDs">
              <Icon icon="mdi:refresh" class="mr-2" />
              Generate
            </Button>
          </div>
        </div>

        <!-- Results -->
        <div v-if="bulkUUIDs.length > 0" class="space-y-2">
          <div class="flex items-center justify-between">
            <Label>Generated UUIDs ({{ bulkUUIDs.length }})</Label>
            <div class="flex gap-2">
              <Button size="sm" variant="outline" @click="copyAllUUIDs">
                <Icon icon="mdi:content-copy" class="mr-1 h-3 w-3" />
                {{ copiedAll ? 'Copied!' : 'Copy All' }}
              </Button>
              <Button size="sm" variant="outline" @click="clearBulk">
                <Icon icon="mdi:close" class="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
          </div>
          <ScrollArea class="h-36 rounded-lg border">
            <div class="space-y-1 p-2">
              <div
                v-for="(uuid, index) in bulkUUIDs"
                :key="index"
                class="hover:bg-muted/50 flex items-center gap-2 rounded p-2 transition-colors"
              >
                <span class="flex-1 font-mono text-sm">{{ uuid }}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  class="h-7 w-7"
                  @click="copyToClipboard(uuid, index)"
                >
                  <Icon
                    :icon="copiedIndices.includes(index) ? 'mdi:check' : 'mdi:content-copy'"
                    class="h-3 w-3"
                  />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>

        <!-- UUID Info -->
        <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
          <div
            class="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300"
          >
            <Icon icon="mdi:information" class="h-5 w-5" />
            UUID Format
          </div>
          <p class="text-xs text-blue-600 dark:text-blue-400">
            UUIDs follow the format: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx<br />
            where M is the version number and N is the variant.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Icon } from '@iconify/vue'

const uuidVersion = ref<'v4' | 'v1'>('v4')
const bulkQuantity = ref(1)
const bulkUUIDs = ref<string[]>([])
const copiedIndices = ref<number[]>([])
const copiedAll = ref(false)

// UUID v4 generation (random)
function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// UUID v1 generation (timestamp-based)
function generateUUIDv1(): string {
  const now = Date.now()
  const timeLow = (now & 0xffffffff).toString(16).padStart(8, '0')
  const timeMid = ((now / 0x100000000) & 0xffff).toString(16).padStart(4, '0')
  const timeHi = (((now / 0x1000000000000) & 0x0fff) | 0x1000).toString(16).padStart(4, '0')
  const clockSeq = ((Math.random() * 0x3fff) | 0x8000).toString(16).padStart(4, '0')
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0'),
  ).join('')

  return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`
}

function generateBulkUUIDs() {
  const count = Math.min(Math.max(1, bulkQuantity.value), 100)
  bulkUUIDs.value = Array.from({ length: count }, () =>
    uuidVersion.value === 'v4' ? generateUUIDv4() : generateUUIDv1(),
  )
}

function copyToClipboard(text: string, index?: number) {
  navigator.clipboard.writeText(text)

  if (index !== undefined) {
    copiedIndices.value.push(index)
    setTimeout(() => {
      copiedIndices.value = copiedIndices.value.filter((i) => i !== index)
    }, 2000)
  }
}

function copyAllUUIDs() {
  const text = bulkUUIDs.value.join('\n')
  navigator.clipboard.writeText(text)
  copiedAll.value = true
  setTimeout(() => {
    copiedAll.value = false
  }, 1500)
}

function clearBulk() {
  bulkUUIDs.value = []
}

generateBulkUUIDs()
</script>
