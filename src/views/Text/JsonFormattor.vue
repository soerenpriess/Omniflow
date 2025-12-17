<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Format, validate, and beautify your JSON data with syntax highlighting. Paste your JSON to
      check for errors and view it in a readable format.
    </p>
    <Card class="route-transition-animation mt-16 w-full max-w-2xl rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:code-json" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          JSON Formatter / Validator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
          <Label for="jsonInput" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:code-braces" class="text-primary" />
            JSON-Text
          </Label>
          <Textarea
            id="jsonInput"
            v-model="jsonInput"
            rows="8"
            class="custom-scrollbar mt-2 w-full resize-none rounded-lg border p-3 font-mono text-sm"
            :style="{ maxHeight: '220px', minHeight: '100px', overflowY: 'auto' }"
            placeholder="Paste your JSON here"
          />
        </div>
        <Button
          class="mt-4 h-12 w-full text-lg font-semibold"
          @click="formatJson"
          :disabled="!jsonInput"
        >
          <Icon icon="mdi:code-tags-check" class="mr-2" />
          Format & Validate
        </Button>
        <div v-if="jsonOutput !== null" class="relative mt-4">
          <Label>Result</Label>
          <div class="relative">
            <button
              class="absolute top-2 right-2 z-10 rounded bg-gray-800/80 px-2 py-1 text-xs text-white hover:bg-gray-700"
              @click="toggleFullscreen"
              v-if="isValid"
            >
              {{ fullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
            </button>
            <pre
              v-if="isValid && !fullscreen"
              class="custom-scrollbar bg-card mt-2 w-full rounded-lg border border-green-500 p-3 font-mono text-sm"
              :style="'max-height: 220px; min-height: 100px; overflow-y: auto;'"
              >{{ jsonOutput }}</pre
            >
            <Textarea
              v-else-if="!isValid && !fullscreen"
              v-model="jsonOutput"
              rows="8"
              readonly
              class="bg-card mt-2 w-full resize-none rounded-lg border border-red-500 p-3 font-mono text-sm"
              :style="'max-height: 220px; minHeight: 100px; overflow-y: auto;'"
            />
            <div v-if="!isValid && !fullscreen" class="mt-2 text-sm text-red-600">
              {{ errorMessage }}
            </div>
            <div v-if="isValid && !fullscreen" class="mt-2 flex items-center justify-between">
              <div></div>
              <Button size="sm" variant="outline" @click="copyToClipboard(jsonOutput)">
                {{ copied ? 'Copied!' : 'Copy' }}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- fullscreen overlay -->
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="fullscreen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
        @keydown.esc="toggleFullscreen"
        tabindex="0"
      >
        <div class="relative h-[90vh] w-[96vw] max-w-5xl">
          <button
            class="absolute top-2 right-2 z-10 rounded bg-gray-800/80 px-3 py-1 text-xs text-white hover:bg-gray-700"
            @click="toggleFullscreen"
          >
            Exit Fullscreen (ESC)
          </button>
          <pre
            class="custom-scrollbar bg-card mt-8 h-full w-full rounded-lg border border-green-500 p-4 font-mono text-base"
            style="overflow-y: auto"
            >{{ jsonOutput }}</pre
          >
          <Button
            size="sm"
            variant="outline"
            class="absolute bottom-2 left-2"
            @click="copyToClipboard(jsonOutput)"
          >
            {{ copied ? 'Copied!' : 'Copy' }}
          </Button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Icon } from '@iconify/vue'

const jsonInput = ref('')
const jsonOutput = ref<string | null>(null)
const isValid = ref(false)
const errorMessage = ref('')
const copied = ref(false)
const fullscreen = ref(false)

function formatJson() {
  try {
    const obj = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(obj, null, 2)
    isValid.value = true
    errorMessage.value = ''
  } catch (e: any) {
    jsonOutput.value = jsonInput.value
    isValid.value = false
    errorMessage.value = e.message
  }
}

function copyToClipboard(text: string) {
  if (!text) return
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

function toggleFullscreen() {
  fullscreen.value = !fullscreen.value
  nextTick(() => {
    if (fullscreen.value) {
      ;(document.querySelector('.fixed[tabindex="0"]') as HTMLElement | null)?.focus()
    }
  })
}

watch(fullscreen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
