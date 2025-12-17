<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Add text watermarks to your images
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-6xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:watermark" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Watermark Generator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Upload Section -->
        <div
          v-if="!originalImage"
          class="hover:border-primary mb-3 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors sm:mb-6 sm:p-8"
          @drop.prevent="handleDrop"
          @dragover.prevent
        >
          <Icon
            icon="mdi:cloud-upload"
            class="mb-2 h-10 w-10 text-gray-300 sm:mb-4 sm:h-16 sm:w-16"
          />
          <p class="text-muted-foreground mb-1 text-xs font-medium sm:mb-2 sm:text-base">
            Drag & Drop an image or click to upload
          </p>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
          <Button @click="fileInput?.click()" class="h-8 text-xs sm:h-10 sm:text-sm">
            <Icon icon="mdi:folder-open" class="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
            Select Image
          </Button>
        </div>

        <!-- Editor -->
        <div v-else class="flex flex-col gap-2 sm:gap-3 lg:flex-row">
          <!-- Left: Controls -->
          <div class="space-y-2 sm:space-y-3 lg:w-1/3">
            <!-- Watermark Type -->
            <div class="space-y-2">
              <Label class="text-xs sm:text-sm">Watermark Type</Label>
              <div class="grid grid-cols-2 gap-2">
                <Button
                  @click="watermarkType = 'text'"
                  :variant="watermarkType === 'text' ? 'default' : 'outline'"
                  class="h-9 text-xs sm:h-10 sm:text-sm"
                >
                  <Icon icon="mdi:format-text" class="mr-1.5 h-4 w-4" />
                  Text
                </Button>
                <Button
                  @click="watermarkType = 'image'"
                  :variant="watermarkType === 'image' ? 'default' : 'outline'"
                  class="h-9 text-xs sm:h-10 sm:text-sm"
                >
                  <Icon icon="mdi:image" class="mr-1.5 h-4 w-4" />
                  Image
                </Button>
              </div>
            </div>

            <!-- Text Watermark Controls -->
            <template v-if="watermarkType === 'text'">
              <!-- Watermark Text -->
              <div class="space-y-2">
                <Label class="text-xs sm:text-sm">Watermark Text</Label>
                <Input
                  v-model="watermarkText"
                  @input="applyWatermark"
                  placeholder="Enter text..."
                  class="h-9 text-xs sm:h-10 sm:text-sm"
                />
              </div>

              <!-- Font Size -->
              <div class="space-y-2">
                <Label class="text-xs sm:text-sm">Font Size: {{ fontSize[0] }}px</Label>
                <Slider
                  v-model="fontSize"
                  :min="10"
                  :max="200"
                  :step="1"
                  @update:modelValue="applyWatermark"
                />
              </div>

              <!-- Color -->
              <div class="space-y-2">
                <Label class="text-xs sm:text-sm">Color</Label>
                <div class="flex gap-2">
                  <Input
                    v-model="color"
                    type="color"
                    @input="applyWatermark"
                    class="h-9 w-20 sm:h-10"
                  />
                  <Input
                    v-model="color"
                    @input="applyWatermark"
                    class="h-9 flex-1 font-mono text-xs sm:h-10 sm:text-sm"
                  />
                </div>
              </div>
            </template>

            <!-- Image Watermark Controls -->
            <template v-else>
              <!-- Upload Watermark Image -->
              <div class="space-y-2">
                <Label class="text-xs sm:text-sm">Watermark Image</Label>
                <input
                  ref="watermarkInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleWatermarkSelect"
                />
                <Button
                  @click="watermarkInput?.click()"
                  variant="outline"
                  class="h-9 w-full text-xs sm:h-10 sm:text-sm"
                >
                  <Icon icon="mdi:upload" class="mr-2 h-4 w-4" />
                  {{ watermarkImage ? 'Change Image' : 'Upload Image' }}
                </Button>
              </div>

              <!-- Watermark Size -->
              <div v-if="watermarkImage" class="space-y-2">
                <Label class="text-xs sm:text-sm">Size: {{ watermarkSize[0] }}%</Label>
                <Slider
                  v-model="watermarkSize"
                  :min="5"
                  :max="100"
                  :step="1"
                  @update:modelValue="applyWatermark"
                />
              </div>
            </template>

            <!-- Opacity -->
            <div class="space-y-2">
              <Label class="text-xs sm:text-sm">Opacity: {{ Math.round(opacity[0] * 100) }}%</Label>
              <Slider
                v-model="opacity"
                :min="0"
                :max="1"
                :step="0.01"
                @update:modelValue="applyWatermark"
              />
            </div>

            <!-- Position -->
            <div class="space-y-2">
              <Label class="text-xs sm:text-sm">Position</Label>
              <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
                <Button
                  v-for="pos in positions"
                  :key="pos.value"
                  @click="((position = pos.value), applyWatermark())"
                  :variant="position === pos.value ? 'default' : 'outline'"
                  size="sm"
                  class="h-8 text-[10px] sm:h-9 sm:text-xs"
                >
                  {{ pos.label }}
                </Button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2 pt-2">
              <Button @click="downloadImage" class="h-9 w-full text-xs sm:h-10 sm:text-sm">
                <Icon icon="mdi:download" class="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                @click="reset"
                variant="outline"
                class="h-9 w-full text-xs sm:h-10 sm:text-sm"
              >
                <Icon icon="mdi:refresh" class="mr-2 h-4 w-4" />
                New Image
              </Button>
            </div>
          </div>

          <!-- Right: Preview -->
          <div class="lg:w-2/3">
            <Label class="mb-2 text-xs sm:text-sm">Preview</Label>
            <div
              class="border-muted-foreground/20 bg-muted/30 flex items-center justify-center overflow-hidden rounded-lg border p-2 sm:p-3"
              style="min-height: 400px"
            >
              <canvas ref="canvas" class="max-h-[600px] max-w-full object-contain" />
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Icon } from '@iconify/vue'

const fileInput = ref<HTMLInputElement>()
const watermarkInput = ref<HTMLInputElement>()
const canvas = ref<HTMLCanvasElement>()
const originalImage = ref('')
const watermarkType = ref<'text' | 'image'>('text')
const watermarkText = ref('© Your Name')
const watermarkImage = ref('')
const fontSize = ref([40])
const watermarkSize = ref([30])
const opacity = ref([0.5])
const color = ref('#FFFFFF')
const position = ref('center')

let img: HTMLImageElement | null = null
let watermarkImg: HTMLImageElement | null = null

const positions = [
  { label: 'Top Left', value: 'top-left' },
  { label: 'Top', value: 'top' },
  { label: 'Top Right', value: 'top-right' },
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom Left', value: 'bottom-left' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Bottom Right', value: 'bottom-right' },
]

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) loadImage(file)
}

function handleDrop(event: DragEvent) {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

function loadImage(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string
    img = new Image()
    img.onload = () => applyWatermark()
    img.src = originalImage.value
  }
  reader.readAsDataURL(file)
}

function handleWatermarkSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) loadWatermarkImage(file)
}

function loadWatermarkImage(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    watermarkImage.value = e.target?.result as string
    watermarkImg = new Image()
    watermarkImg.onload = () => applyWatermark()
    watermarkImg.src = watermarkImage.value
  }
  reader.readAsDataURL(file)
}

function applyWatermark() {
  if (!img || !canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  canvas.value.width = img.width
  canvas.value.height = img.height

  // Draw original image
  ctx.drawImage(img, 0, 0)

  if (watermarkType.value === 'text') {
    // Text watermark
    ctx.globalAlpha = opacity.value[0]
    ctx.fillStyle = color.value
    ctx.font = `bold ${fontSize.value[0]}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Calculate position
    let x = canvas.value.width / 2
    let y = canvas.value.height / 2

    switch (position.value) {
      case 'top-left':
        x = fontSize.value[0]
        y = fontSize.value[0]
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        break
      case 'top':
        y = fontSize.value[0]
        ctx.textBaseline = 'top'
        break
      case 'top-right':
        x = canvas.value.width - fontSize.value[0]
        y = fontSize.value[0]
        ctx.textAlign = 'right'
        ctx.textBaseline = 'top'
        break
      case 'left':
        x = fontSize.value[0]
        ctx.textAlign = 'left'
        break
      case 'right':
        x = canvas.value.width - fontSize.value[0]
        ctx.textAlign = 'right'
        break
      case 'bottom-left':
        x = fontSize.value[0]
        y = canvas.value.height - fontSize.value[0]
        ctx.textAlign = 'left'
        ctx.textBaseline = 'bottom'
        break
      case 'bottom':
        y = canvas.value.height - fontSize.value[0]
        ctx.textBaseline = 'bottom'
        break
      case 'bottom-right':
        x = canvas.value.width - fontSize.value[0]
        y = canvas.value.height - fontSize.value[0]
        ctx.textAlign = 'right'
        ctx.textBaseline = 'bottom'
        break
    }

    // Draw text with shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillText(watermarkText.value, x, y)
  } else if (watermarkType.value === 'image' && watermarkImg) {
    // Image watermark
    const maxSize = Math.min(canvas.value.width, canvas.value.height)
    const scale = (watermarkSize.value[0] / 100) * maxSize
    const watermarkWidth = (watermarkImg.width / watermarkImg.height) * scale
    const watermarkHeight = scale

    let x = (canvas.value.width - watermarkWidth) / 2
    let y = (canvas.value.height - watermarkHeight) / 2

    const padding = 20

    switch (position.value) {
      case 'top-left':
        x = padding
        y = padding
        break
      case 'top':
        y = padding
        break
      case 'top-right':
        x = canvas.value.width - watermarkWidth - padding
        y = padding
        break
      case 'left':
        x = padding
        break
      case 'right':
        x = canvas.value.width - watermarkWidth - padding
        break
      case 'bottom-left':
        x = padding
        y = canvas.value.height - watermarkHeight - padding
        break
      case 'bottom':
        y = canvas.value.height - watermarkHeight - padding
        break
      case 'bottom-right':
        x = canvas.value.width - watermarkWidth - padding
        y = canvas.value.height - watermarkHeight - padding
        break
    }

    ctx.globalAlpha = opacity.value[0]
    ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight)
  }
}

function downloadImage() {
  if (!canvas.value) return

  canvas.value.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `watermarked-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

function reset() {
  originalImage.value = ''
  img = null
  watermarkType.value = 'text'
  watermarkText.value = '© Your Name'
  watermarkImage.value = ''
  watermarkImg = null
  fontSize.value = [40]
  watermarkSize.value = [30]
  opacity.value = [0.5]
  color.value = '#FFFFFF'
  position.value = 'center'
}
</script>
