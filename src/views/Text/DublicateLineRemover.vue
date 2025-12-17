<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Remove duplicate lines from your text while preserving the original order. Simply paste your
      text and click the button to get clean, unique lines.
    </p>
    <Card class="route-transition-animation mt-16 w-full max-w-2xl rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:content-duplicate" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Duplicate Line Remover
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
          <Label for="input" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:text-box-multiple" class="text-primary" />
            Text (multiline)
          </Label>
          <div class="relative">
            <Textarea
              id="input"
              v-model="input"
              rows="8"
              class="custom-scrollbar mt-2 w-full resize-none rounded-lg border p-3 text-base"
              :style="{ maxHeight: '180px', minHeight: '100px', overflowY: 'auto' }"
            />
            <!-- Placeholder Overlay -->
            <div
              v-if="!input"
              class="pointer-events-none absolute top-0 left-0 z-10 h-full w-full rounded-lg p-3 text-base whitespace-pre-line text-gray-400 select-none"
              style="max-height: 180px; min-height: 100px; overflow-y: auto"
            >
              Apple<br />Banana<br />Apple<br />
            </div>
          </div>
        </div>
        <Button
          class="mt-4 h-12 w-full text-lg font-semibold"
          @click="removeDuplicates"
          :disabled="!input"
        >
          <Icon icon="mdi:filter-remove" class="mr-2" />
          Remove Duplicates
        </Button>
        <div v-if="output" class="mt-4">
          <Label>Result</Label>
          <Textarea
            v-model="output"
            rows="8"
            readonly
            class="custom-scrollbar w-full resize-none rounded-lg border p-3 font-mono text-sm"
            :style="{ maxHeight: '180px', minHeight: '100px', overflowY: 'auto' }"
          />
          <div class="flex justify-end">
            <Button size="sm" class="mt-4" variant="outline" @click="copyToClipboard(output)">
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Icon } from '@iconify/vue'

const input = ref('')
const output = ref('')
const copied = ref(false)

function removeDuplicates() {
  const seen = new Set<string>()
  const lines = input.value.split('\n')

  const uniqueLines = lines.filter((line) => {
    const normalized = line
    if (seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })

  output.value = uniqueLines.join('\n')
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
  background: #222;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #222;
  border-radius: 6px;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #444 #222;
}
</style>
