<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate favicons in all required sizes for your website
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:star-circle" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Favicon Generator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Upload or Draw -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">Source Image</Label>
          <div class="grid grid-cols-2 gap-2">
            <Button
              @click="mode = 'upload'"
              :variant="mode === 'upload' ? 'default' : 'outline'"
              class="h-9 text-xs"
            >
              <Icon icon="mdi:upload" class="mr-1.5 h-4 w-4" />
              Upload Image
            </Button>
            <Button
              @click="mode = 'draw'"
              :variant="mode === 'draw' ? 'default' : 'outline'"
              class="h-9 text-xs"
            >
              <Icon icon="mdi:palette" class="mr-1.5 h-4 w-4" />
              Draw Icon
            </Button>
          </div>
        </div>

        <!-- Upload Mode -->
        <div v-if="mode === 'upload'" class="space-y-2">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="hidden"
          />
          <Button @click="fileInput?.click()" variant="outline" class="h-20 w-full">
            <div class="flex flex-col items-center gap-2">
              <Icon icon="mdi:cloud-upload" class="h-8 w-8" />
              <span class="text-xs">Click to upload image (PNG, JPG, SVG)</span>
            </div>
          </Button>
        </div>

        <!-- Draw Mode -->
        <div v-if="mode === 'draw'" class="space-y-3">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Label class="text-xs">Background:</Label>
              <input
                v-model="bgColor"
                type="color"
                class="h-8 w-12 cursor-pointer rounded border"
              />
            </div>
            <div class="flex items-center gap-2">
              <Label class="text-xs">Text Color:</Label>
              <input
                v-model="textColor"
                type="color"
                class="h-8 w-12 cursor-pointer rounded border"
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label class="text-xs">Text/Emoji (1-2 characters)</Label>
            <Input v-model="iconText" maxlength="2" placeholder="A" class="text-center text-2xl" />
          </div>
          <Button @click="generateFromText" class="w-full">
            <Icon icon="mdi:creation" class="mr-2 h-4 w-4" />
            Generate Preview
          </Button>
        </div>

        <!-- Preview -->
        <div v-if="previewUrl" class="space-y-2">
          <Label class="text-xs sm:text-sm">Preview</Label>
          <div class="bg-muted/30 flex items-center justify-center rounded-lg border p-6">
            <img :src="previewUrl" alt="Favicon preview" class="h-32 w-32 rounded-lg" />
          </div>
        </div>

        <!-- Generate Button -->
        <Button
          v-if="previewUrl"
          @click="generateFavicons"
          :disabled="generating"
          class="h-9 w-full text-xs sm:h-10 sm:text-sm"
        >
          <Icon
            :icon="generating ? 'mdi:loading' : 'mdi:download'"
            class="mr-2 h-4 w-4"
            :class="{ 'animate-spin': generating }"
          />
          {{ generating ? 'Generating...' : 'Generate All Sizes' }}
        </Button>

        <!-- Generated Favicons -->
        <div v-if="generatedFavicons.length > 0" class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs sm:text-sm"
              >Generated Favicons ({{ generatedFavicons.length }})</Label
            >
            <Button @click="downloadAll" size="sm" variant="outline">
              <Icon icon="mdi:download" class="mr-1 h-3 w-3" />
              Download All
            </Button>
          </div>
          <div class="bg-muted/30 max-h-64 space-y-2 overflow-y-auto rounded-lg border p-3">
            <div
              v-for="favicon in generatedFavicons"
              :key="favicon.size"
              class="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-2"
            >
              <div class="flex items-center gap-3">
                <img :src="favicon.url" :alt="favicon.name" class="h-8 w-8" />
                <div>
                  <p class="text-xs font-medium">{{ favicon.name }}</p>
                  <p class="text-muted-foreground text-[10px]">
                    {{ favicon.size }}x{{ favicon.size }}px
                  </p>
                </div>
              </div>
              <Button @click="downloadSingle(favicon)" size="sm" variant="ghost">
                <Icon icon="mdi:download" class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- HTML Code -->
        <div v-if="generatedFavicons.length > 0" class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs sm:text-sm">HTML Code</Label>
            <Button @click="copyHtml" size="sm" variant="ghost">
              <Icon :icon="copiedHtml ? 'mdi:check' : 'mdi:content-copy'" class="mr-1 h-3 w-3" />
              {{ copiedHtml ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <Textarea v-model="htmlCode" readonly class="min-h-[120px] font-mono text-[10px]" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@iconify/vue'

const mode = ref<'upload' | 'draw'>('draw')
const fileInput = ref<HTMLInputElement>()
const previewUrl = ref('')
const generating = ref(false)
const iconText = ref('O')
const bgColor = ref('#6366f1')
const textColor = ref('#ffffff')
const copiedHtml = ref(false)

interface Favicon {
  name: string
  size: number
  url: string
}

const generatedFavicons = ref<Favicon[]>([])
const htmlCode = ref('')

const faviconSizes = [16, 32, 48, 64, 128, 180, 192, 512]

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function generateFromText() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, 512, 512)

  ctx.fillStyle = textColor.value
  ctx.font = 'bold 300px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(iconText.value || 'O', 256, 256)

  previewUrl.value = canvas.toDataURL('image/png')
}

async function generateFavicons() {
  if (!previewUrl.value) {
    return
  }

  generating.value = true
  generatedFavicons.value = []

  try {
    const img = new Image()
    img.src = previewUrl.value

    await new Promise((resolve) => {
      img.onload = resolve
    })

    for (const size of faviconSizes) {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!

      ctx.drawImage(img, 0, 0, size, size)

      generatedFavicons.value.push({
        name: `favicon-${size}x${size}.png`,
        size,
        url: canvas.toDataURL('image/png'),
      })
    }

    generateHtmlCode()
  } catch (error) {
    console.error('Error generating favicons:', error)
  } finally {
    generating.value = false
  }
}

function generateHtmlCode() {
  htmlCode.value = `<!-- Favicon Links -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">`
}

function downloadSingle(favicon: Favicon) {
  const link = document.createElement('a')
  link.download = favicon.name
  link.href = favicon.url
  link.click()
}

function downloadAll() {
  generatedFavicons.value.forEach((favicon) => {
    setTimeout(() => {
      const link = document.createElement('a')
      link.download = favicon.name
      link.href = favicon.url
      link.click()
    }, 100)
  })
}

function copyHtml() {
  navigator.clipboard.writeText(htmlCode.value)
  copiedHtml.value = true
  setTimeout(() => {
    copiedHtml.value = false
  }, 1500)
}
</script>
