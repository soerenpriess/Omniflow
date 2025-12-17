<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Encode and decode URLs for safe transmission
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:web" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          URL Encoder / Decoder
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
              mode === 'encode' ? 'Plain URL' : 'Encoded URL'
            }}</Label>
            <Button @click="input = ''" variant="ghost" size="sm" class="h-6 text-xs">
              <Icon icon="mdi:close" class="mr-1 h-3 w-3" />
              Clear
            </Button>
          </div>
          <Textarea
            v-model="input"
            :placeholder="
              mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'
            "
            class="min-h-[120px] font-mono text-xs sm:min-h-[150px] sm:text-sm"
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
              mode === 'encode' ? 'Encoded URL' : 'Decoded URL'
            }}</Label>
            <Button @click="copyOutput" variant="ghost" size="sm" class="h-6 text-xs">
              <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" class="mr-1 h-3 w-3" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <Textarea
            v-model="output"
            readonly
            class="min-h-[120px] font-mono text-xs sm:min-h-[150px] sm:text-sm"
          />
        </div>

        <!-- Info -->
        <div class="rounded-lg bg-blue-50 p-2 sm:p-3 dark:bg-blue-950/20">
          <div
            class="mb-1 flex items-center gap-1.5 text-[10px] font-medium text-blue-700 sm:gap-2 sm:text-xs dark:text-blue-300"
          >
            <Icon icon="mdi:information" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            What is URL Encoding?
          </div>
          <p class="text-[10px] leading-tight text-blue-600 sm:text-xs dark:text-blue-400">
            URL encoding converts special characters into a format that can be safely transmitted
            over the internet. Spaces become %20, and other special characters are converted to %XX
            format.
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')
const output = ref('')
const copied = ref(false)

function process() {
  if (!input.value.trim()) {
    toast.error('Please enter a URL')
    return
  }

  try {
    if (mode.value === 'encode') {
      output.value = encodeURIComponent(input.value)
      toast.success('URL encoded!')
    } else {
      output.value = decodeURIComponent(input.value)
      toast.success('URL decoded!')
    }
  } catch (error) {
    toast.error('Invalid input')
    output.value = ''
  }
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
    toast.success('Copied to clipboard!')
  }
}
</script>
