<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Encode text to Base64 or decode Base64 back to plain text. Useful for data transmission,
      storage, and embedding binary data in text formats.
    </p>
    <Card class="route-transition-animation w-full max-w-lg rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="charm:file-binary" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Base64 Encoder / Decoder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs v-model="tab" class="mb-4 w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          <!-- Encode Tab Content -->
          <TabsContent value="encode">
            <div class="space-y-4">
              <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
                <Label for="encodeInput" class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:text" class="text-primary" />
                  Text
                </Label>
                <Textarea
                  id="encodeInput"
                  v-model="encodeInput"
                  rows="4"
                  class="bg-background w-full resize-none rounded-lg border p-3 text-base"
                  placeholder="Enter text to encode"
                />
              </div>
            </div>
            <div v-if="encodeResult" class="mt-4">
              <Label>Base64</Label>
              <Textarea
                v-model="encodeResult"
                rows="3"
                readonly
                class="w-full resize-none rounded-lg border p-3 font-mono text-sm"
              />
              <div class="mt-2 flex w-full justify-end">
                <Button size="sm" variant="secondary" @click="copyToClipboard(encodeResult)">
                  {{ copied ? 'Copied!' : 'Copy' }}
                </Button>
              </div>
            </div>
          </TabsContent>

          <!-- Decode Tab Content -->
          <TabsContent value="decode">
            <div class="space-y-4">
              <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
                <Label for="decodeInput" class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:code-braces" class="text-primary" />
                  Base64
                </Label>
                <Textarea
                  id="decodeInput"
                  v-model="decodeInput"
                  rows="4"
                  class="bg-background w-full resize-none rounded-lg border p-3 text-base"
                  placeholder="Enter Base64-Text to decode"
                />
              </div>
            </div>
            <div v-if="decodeResult" class="mt-4">
              <Label>Text</Label>
              <Textarea
                v-model="decodeResult"
                rows="3"
                readonly
                class="w-full resize-none rounded-lg border p-3 font-mono text-sm"
              />
              <div class="mt-2 flex w-full justify-end">
                <Button size="sm" variant="secondary" @click="copyToClipboard(decodeResult)">
                  {{ copied ? 'Copied!' : 'Copy' }}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Icon } from '@iconify/vue'
import { useLocalStorage, watchDebounced } from '@vueuse/core'

const tab = useLocalStorage<'encode' | 'decode'>('omniflow-base64-tab', 'encode')
const encodeInput = ref('')
const encodeResult = ref('')
const decodeInput = ref('')
const decodeResult = ref('')
const copied = ref(false)

function encodeBase64(value: string) {
  encodeResult.value = btoa(value)
}

function decodeBase64(value: string) {
  try {
    decodeResult.value = atob(value)
  } catch {
    decodeResult.value = 'Ungültiger Base64-String!'
  }
}

watchDebounced(encodeInput, (value) => encodeBase64(value))
watchDebounced(decodeInput, (value) => decodeBase64(value))

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>
