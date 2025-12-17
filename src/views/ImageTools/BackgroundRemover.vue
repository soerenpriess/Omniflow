<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Remove or replace image backgrounds with a solid color
    </p>
    <Card class="route-transition-animation #rounded-2xl mb-4 w-full max-w-7xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:image-remove" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Background Remover
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-6">
        <!-- Upload Section -->
        <div
          v-if="!originalImage"
          class="hover:border-primary mb-3 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors sm:mb-6 sm:p-8 lg:p-12"
          @drop.prevent="handleDrop"
          @dragover.prevent
        >
          <Icon
            icon="mdi:cloud-upload"
            class="mb-2 h-10 w-10 text-gray-300 sm:mb-4 sm:h-16 sm:w-16"
          />
          <p class="text-muted-foreground mb-1 text-xs font-medium sm:mb-2 sm:text-base lg:text-lg">
            Drag & Drop an image or click to upload
          </p>
          <p class="text-muted-foreground mb-2 text-[10px] sm:mb-4 sm:text-sm">
            Supports JPEG, PNG, WebP
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

        <!-- Image Display -->
        <div v-else class="flex flex-col gap-2 sm:gap-3 lg:flex-row">
          <!-- Left Side: Controls -->
          <div class="space-y-2 sm:space-y-3 lg:w-1/2">
            <!-- Background Settings -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-2 transition-colors sm:p-3"
            >
              <Label
                class="mb-2 flex items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm"
              >
                <Icon icon="mdi:palette" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Background Settings
              </Label>
              <div class="space-y-2 sm:space-y-3">
                <div class="flex items-center gap-2">
                  <Switch v-model:checked="removeWhite" @update:checked="processImage" />
                  <Label class="text-[10px] sm:text-xs">Remove white background</Label>
                </div>
                <div class="flex gap-1.5 sm:gap-2">
                  <div class="flex-1">
                    <Input
                      v-model="backgroundColor"
                      type="color"
                      class="h-9 w-full sm:h-10"
                      @input="processImage"
                    />
                  </div>
                  <Button
                    @click="setTransparent"
                    variant="outline"
                    size="sm"
                    class="h-9 text-[10px] sm:h-10 sm:text-xs"
                  >
                    <Icon icon="mdi:alpha" class="mr-0.5 h-3 w-3 sm:mr-1 sm:h-4 sm:w-4" />
                    <span class="hidden sm:inline">Transparent</span>
                    <span class="sm:hidden">Trans</span>
                  </Button>
                </div>
                <Button
                  @click="checkerboard = !checkerboard"
                  variant="outline"
                  size="sm"
                  class="h-7 w-full text-[10px] sm:h-8 sm:text-xs"
                >
                  <Icon icon="mdi:checkerboard" class="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  {{ checkerboard ? 'Solid' : 'Pattern' }}
                </Button>
              </div>
            </div>

            <!-- Tolerance Control -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-2 transition-colors sm:p-3"
            >
              <Label
                class="mb-2 flex items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm"
              >
                <Icon icon="mdi:tune" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Tolerance Settings
              </Label>
              <div class="space-y-1.5 sm:space-y-2">
                <Label class="mb-1.5 flex items-center justify-between text-[10px] sm:text-xs">
                  <span>Tolerance Level</span>
                  <span class="text-primary font-semibold">{{ tolerance[0] }}</span>
                </Label>
                <Slider
                  v-model="tolerance"
                  :min="0"
                  :max="255"
                  :step="1"
                  @update:modelValue="processImage"
                />
                <p class="text-muted-foreground text-[10px] leading-tight sm:text-xs">
                  Higher values remove more similar colors
                </p>
              </div>
            </div>

            <!-- Info -->
            <div class="rounded-lg bg-blue-50 p-2 sm:p-3 dark:bg-blue-950/20">
              <div
                class="mb-1 flex items-center gap-1.5 text-[10px] font-medium text-blue-700 sm:mb-1.5 sm:gap-2 sm:text-xs dark:text-blue-300"
              >
                <Icon icon="mdi:information" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                How it works
              </div>
              <p class="text-[10px] leading-tight text-blue-600 sm:text-xs dark:text-blue-400">
                This tool removes backgrounds based on color similarity. It works best with solid or
                near-solid color backgrounds. Adjust the tolerance to fine-tune the results.
              </p>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
              <Button
                @click="downloadImage"
                class="h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm"
              >
                <Icon icon="mdi:download" class="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                Download
              </Button>
              <Button
                @click="reset"
                variant="outline"
                class="h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm"
              >
                <Icon icon="mdi:refresh" class="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                New Image
              </Button>
            </div>
          </div>

          <!-- Right Side: Image Previews -->
          <div class="space-y-2 sm:space-y-3 lg:w-1/2">
            <!-- Original Image -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-2 transition-colors sm:p-3"
            >
              <div class="mb-2 flex items-center justify-between">
                <Label class="flex items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm">
                  <Icon icon="mdi:image" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Original Image
                </Label>
                <Button
                  @click="showFullscreen('original')"
                  variant="ghost"
                  size="sm"
                  class="h-7 w-7 p-0"
                >
                  <Icon icon="mdi:fullscreen" class="h-4 w-4" />
                </Button>
              </div>
              <div
                class="border-muted-foreground/20 bg-background/50 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border p-2"
                style="min-height: 180px; max-height: 220px"
                @click="showFullscreen('original')"
              >
                <img
                  :src="originalImage"
                  class="max-h-full max-w-full object-contain"
                  alt="Original"
                />
              </div>
            </div>

            <!-- Processed Image -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-2 transition-colors sm:p-3"
            >
              <div class="mb-2 flex items-center justify-between">
                <Label class="flex items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm">
                  <Icon icon="mdi:image-edit" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Processed Image
                </Label>
                <Button
                  @click="showFullscreen('processed')"
                  variant="ghost"
                  size="sm"
                  class="h-7 w-7 p-0"
                >
                  <Icon icon="mdi:fullscreen" class="h-4 w-4" />
                </Button>
              </div>
              <div
                class="border-muted-foreground/20 flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border p-2"
                style="min-height: 180px; max-height: 220px"
                :style="{ backgroundColor: checkerboard ? undefined : backgroundColor }"
                :class="{ 'checkerboard-bg': checkerboard }"
                @click="showFullscreen('processed')"
              >
                <canvas ref="canvas" class="max-h-full max-w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Fullscreen Modal -->
  <Teleport to="body">
    <div
      v-if="fullscreenImage"
      class="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-black/95 p-4"
      @click.self="fullscreenImage = null"
    >
      <Button
        @click="fullscreenImage = null"
        variant="ghost"
        size="icon"
        class="fixed top-4 right-4 z-10 h-10 w-10 text-white hover:bg-white/20"
      >
        <Icon icon="mdi:close" class="h-6 w-6" />
      </Button>
      <div class="relative my-auto">
        <img
          v-if="fullscreenImage === 'original'"
          :src="originalImage"
          class="max-w-full object-contain"
          alt="Original Fullscreen"
        />
        <canvas
          v-else
          ref="fullscreenCanvas"
          class="max-w-full object-contain"
          :style="{ backgroundColor: checkerboard ? undefined : backgroundColor }"
          :class="{ 'checkerboard-bg': checkerboard }"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Icon } from '@iconify/vue'

const fileInput = ref<HTMLInputElement>()
const canvas = ref<HTMLCanvasElement>()
const fullscreenCanvas = ref<HTMLCanvasElement>()
const originalImage = ref('')
const backgroundColor = ref('#ffffff')
const tolerance = ref([30])
const removeWhite = ref(true)
const checkerboard = ref(false)
const fullscreenImage = ref<'original' | 'processed' | null>(null)

let img: HTMLImageElement | null = null

watch(fullscreenImage, (newVal) => {
  if (newVal === 'processed') {
    setTimeout(() => {
      if (fullscreenCanvas.value && canvas.value) {
        fullscreenCanvas.value.width = canvas.value.width
        fullscreenCanvas.value.height = canvas.value.height
        const ctx = fullscreenCanvas.value.getContext('2d')
        if (ctx) {
          ctx.drawImage(canvas.value, 0, 0)
        }
      }
    }, 0)
  }
})

function showFullscreen(type: 'original' | 'processed') {
  fullscreenImage.value = type
}

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
    img.onload = () => processImage()
    img.src = originalImage.value
  }
  reader.readAsDataURL(file)
}

function processImage() {
  if (!img || !canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  canvas.value.width = img.width
  canvas.value.height = img.height

  ctx.drawImage(img, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
  const data = imageData.data

  const targetColor = removeWhite.value
    ? { r: 255, g: 255, b: 255 }
    : hexToRgb(backgroundColor.value)

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Calculate color distance
    const distance = Math.sqrt(
      Math.pow(r - targetColor.r, 2) +
        Math.pow(g - targetColor.g, 2) +
        Math.pow(b - targetColor.b, 2),
    )

    // Remove pixel if within tolerance
    if (distance <= tolerance.value[0]) {
      data[i + 3] = 0 // Set alpha to 0 (transparent)
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 }
}

function setTransparent() {
  removeWhite.value = false
  backgroundColor.value = '#00000000'
  processImage()
}

function downloadImage() {
  if (!canvas.value) return

  canvas.value.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `background-removed-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

function reset() {
  originalImage.value = ''
  img = null
  tolerance.value = [30]
  backgroundColor.value = '#ffffff'
  removeWhite.value = true
  checkerboard.value = false
}
</script>

<style scoped>
.checkerboard-bg {
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
}
</style>
