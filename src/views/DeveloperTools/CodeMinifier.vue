<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Minify your JavaScript, CSS, or HTML code to reduce file size. Removes whitespace, comments,
      and unnecessary characters.
    </p>
    <Card class="route-transition-animation w-full max-w-xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:code-braces" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Code Minifier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <!-- Code Type Selection -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:file-code" class="text-primary" />
              Code Type
            </Label>
            <Select v-model="codeType">
              <SelectTrigger class="h-10 text-sm">
                <SelectValue placeholder="Select code type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Input Code -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="input" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:code-tags" class="text-primary" />
              Input Code
            </Label>
            <textarea
              id="input"
              v-model="inputCode"
              rows="10"
              placeholder="Paste your code here..."
              class="bg-background border-input ring-offset-background focus:ring-ring flex w-full rounded-md border px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <Button @click="minify" class="h-12 text-lg font-semibold">
            <Icon icon="mdi:arrow-collapse" class="mr-2" />
            Minify Code
          </Button>
          <Button
            @click="copyToClipboard"
            :disabled="!minifiedCode"
            variant="outline"
            class="h-12 text-lg font-semibold"
          >
            <Icon icon="mdi:content-copy" class="mr-2" />
            Copy Result
          </Button>
        </div>

        <!-- Minified Code Display -->
        <div v-if="minifiedCode" class="mt-6 space-y-3">
          <div class="bg-muted/30 rounded-lg border p-4">
            <div class="mb-2 flex items-center justify-between">
              <Label class="flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:file-document-outline" class="text-primary" />
                Minified Code
              </Label>
              <div class="text-muted-foreground flex items-center gap-2 text-xs">
                <span>{{ savings }}% smaller</span>
              </div>
            </div>
            <textarea
              v-model="minifiedCode"
              readonly
              rows="8"
              class="bg-background border-input ring-offset-background flex w-full rounded-md border px-3 py-2 font-mono text-sm"
            ></textarea>
          </div>
          <div
            class="border-primary/20 from-primary/5 to-primary/10 grid grid-cols-2 gap-3 rounded-lg border-2 bg-gradient-to-br p-4"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Original:</span>
              <span class="text-lg font-bold">{{ originalSize }} bytes</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Minified:</span>
              <span class="text-primary text-lg font-bold">{{ minifiedSize }} bytes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
const codeType = ref('javascript')
const inputCode = ref('')
const minifiedCode = ref('')

const originalSize = computed(() => new Blob([inputCode.value]).size)
const minifiedSize = computed(() => new Blob([minifiedCode.value]).size)
const savings = computed(() => {
  if (originalSize.value === 0) return 0
  return Math.round(((originalSize.value - minifiedSize.value) / originalSize.value) * 100)
})

function minify() {
  if (!inputCode.value.trim()) {
    return
  }

  let result = inputCode.value

  if (codeType.value === 'javascript') {
    // Remove comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
    result = result.replace(/\/\/.*/g, '') // Single-line comments
    // Remove whitespace
    result = result.replace(/\s+/g, ' ')
    result = result.replace(/\s*([{};,:])\s*/g, '$1')
    result = result.trim()
  } else if (codeType.value === 'css') {
    // Remove comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace
    result = result.replace(/\s+/g, ' ')
    result = result.replace(/\s*([{};:,])\s*/g, '$1')
    result = result.trim()
  } else if (codeType.value === 'html') {
    // Remove comments
    result = result.replace(/<!--[\s\S]*?-->/g, '')
    // Remove whitespace between tags
    result = result.replace(/>\s+</g, '><')
    result = result.replace(/\s+/g, ' ')
    result = result.trim()
  }

  minifiedCode.value = result
}

function copyToClipboard() {
  navigator.clipboard.writeText(minifiedCode.value)
}
</script>
