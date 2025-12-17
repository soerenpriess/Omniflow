<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Extract individual frames from animated GIFs and download them in various formats.
    </p>
    <Card class="route-transition-animation mt-12 w-full max-w-6xl rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <Icon icon="mdi:image-multiple" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          GIF Frame Extractor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Upload Section -->
        <div
          v-if="!gifLoaded"
          class="hover:border-primary mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors sm:p-12"
          @drop.prevent="handleDrop"
          @dragover.prevent
        >
          <Icon icon="mdi:cloud-upload" class="mb-4 h-16 w-16 text-gray-300" />
          <p class="text-muted-foreground mb-2 text-base font-medium sm:text-lg">
            Drag & Drop a GIF or click to upload
          </p>
          <p class="text-muted-foreground mb-4 text-sm">Supports animated GIF files</p>
          <input
            ref="fileInput"
            type="file"
            accept="image/gif"
            class="hidden"
            @change="handleFileSelect"
          />
          <Button @click="fileInput?.click()" class="h-10">
            <Icon icon="mdi:folder-open" class="mr-2" />
            Select GIF
          </Button>
        </div>

        <!-- GIF Info and Controls -->
        <div v-if="gifLoaded" class="space-y-3 sm:space-y-4">
          <!-- Info -->
          <div
            class="border-muted-foreground/20 from-primary/10 to-primary/5 rounded-lg border bg-gradient-to-br p-3 sm:p-4"
          >
            <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <div>
                <div class="text-muted-foreground mb-1 flex items-center gap-1 text-xs">
                  <Icon icon="mdi:image-multiple-outline" class="h-3 w-3" />
                  Total Frames
                </div>
                <div class="text-xl font-bold sm:text-2xl">{{ frames.length }}</div>
              </div>
              <div>
                <div class="text-muted-foreground mb-1 flex items-center gap-1 text-xs">
                  <Icon icon="mdi:resize" class="h-3 w-3" />
                  Frame Size
                </div>
                <div class="text-xl font-bold sm:text-2xl">
                  {{ frameWidth }} × {{ frameHeight }}
                </div>
              </div>
              <div>
                <div class="text-muted-foreground mb-1 flex items-center gap-1 text-xs">
                  <Icon icon="mdi:check-circle-outline" class="h-3 w-3" />
                  Selected
                </div>
                <div class="text-xl font-bold sm:text-2xl">{{ selectedFrames.length }}</div>
              </div>
              <div class="col-span-2 lg:col-span-1">
                <div class="text-muted-foreground mb-1 flex items-center gap-1 text-xs">
                  <Icon icon="mdi:file-outline" class="h-3 w-3" />
                  File Name
                </div>
                <div class="truncate text-xs font-semibold sm:text-sm">{{ gifFileName }}</div>
              </div>
            </div>
          </div>

          <!-- Frame Selection -->
          <div
            class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-colors sm:p-4"
          >
            <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Label class="flex items-center gap-2 text-sm font-semibold">
                <Icon icon="mdi:view-grid" class="h-4 w-4" />
                Frame Selection
              </Label>
              <div class="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  class="h-8 flex-1 text-xs sm:flex-none"
                  @click="selectAll"
                >
                  <Icon icon="mdi:select-all" class="mr-1 h-3 w-3" />
                  Select All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  class="h-8 flex-1 text-xs sm:flex-none"
                  @click="deselectAll"
                >
                  <Icon icon="mdi:select-off" class="mr-1 h-3 w-3" />
                  Deselect All
                </Button>
              </div>
            </div>

            <!-- Frames Grid -->
            <div
              class="custom-scroll border-muted-foreground/20 bg-background/50 max-h-[400px] overflow-y-auto rounded-lg border p-2"
            >
              <div
                class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              >
                <div
                  v-for="(frame, index) in frames"
                  :key="index"
                  class="group relative cursor-pointer overflow-hidden rounded-lg border-2 shadow-sm transition-all hover:shadow-md"
                  :class="
                    selectedFrames.includes(index)
                      ? 'border-primary bg-primary/10 ring-primary/20 ring-2'
                      : 'border-muted-foreground/30 hover:border-primary/50'
                  "
                  @click="toggleFrame(index)"
                >
                  <img :src="frame" :alt="`Frame ${index + 1}`" class="w-full" />
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity"
                    :class="
                      selectedFrames.includes(index)
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    "
                  >
                    <Icon
                      v-if="selectedFrames.includes(index)"
                      icon="mdi:check-circle"
                      class="text-primary h-8 w-8"
                    />
                  </div>
                  <div
                    class="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1 text-center text-xs font-medium text-white"
                  >
                    Frame {{ index + 1 }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Export Options -->
          <div
            class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-colors sm:p-4"
          >
            <Label class="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Icon icon="mdi:cog" class="h-4 w-4" />
              Export Options
            </Label>
            <div class="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
              <div>
                <Label class="mb-2 flex items-center gap-1 text-xs">
                  <Icon icon="mdi:file-image" class="h-3 w-3" />
                  Format
                </Label>
                <Select v-model="exportFormat">
                  <SelectTrigger class="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label class="mb-2 flex items-center justify-between text-xs">
                  <span class="flex items-center gap-1">
                    <Icon icon="mdi:tune" class="h-3 w-3" />
                    Quality (JPEG/WebP)
                  </span>
                  <span class="text-primary font-semibold">{{ exportQuality[0] }}%</span>
                </Label>
                <Slider v-model="exportQuality" :min="1" :max="100" :step="1" />
              </div>
              <div class="flex items-end">
                <Button
                  @click="downloadFrames"
                  :disabled="selectedFrames.length === 0"
                  class="h-9 w-full text-xs"
                >
                  <Icon icon="mdi:download" class="mr-2 h-4 w-4" />
                  Download {{ selectedFrames.length }} Frame(s)
                </Button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex">
            <Button @click="resetAll" variant="outline" class="h-9 text-xs">
              <Icon icon="mdi:refresh" class="mr-2 h-4 w-4" />
              New GIF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { parseGIF, decompressFrames } from 'gifuct-js'
import { Icon } from '@iconify/vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const fileInput = ref<HTMLInputElement | null>(null)
const gifLoaded = ref(false)
const gifFileName = ref('')
const frames = ref<string[]>([])
const selectedFrames = ref<number[]>([])
const frameWidth = ref(0)
const frameHeight = ref(0)
const exportFormat = ref('png')
const exportQuality = ref([90])

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    loadGIF(file)
  }
}

function handleDrop(event: DragEvent) {
  const file = event.dataTransfer?.files[0]
  if (file && file.type === 'image/gif') {
    loadGIF(file)
  }
}

async function loadGIF(file: File) {
  gifFileName.value = file.name
  frames.value = []
  selectedFrames.value = []

  try {
    const arrayBuffer = await file.arrayBuffer()
    const gifData = parseGIF(arrayBuffer)
    const gifFrames = decompressFrames(gifData, true)

    if (gifFrames.length > 0) {
      frameWidth.value = gifFrames[0].dims.width
      frameHeight.value = gifFrames[0].dims.height
      extractFrames(gifFrames)
    }
  } catch (error) {
    console.error('Error loading GIF:', error)
    alert('Failed to load GIF. Please try another file.')
  }
}

function extractFrames(gifFrames: any[]) {
  const canvas = document.createElement('canvas')
  canvas.width = frameWidth.value
  canvas.height = frameHeight.value
  const ctx = canvas.getContext('2d', { willReadFrequently: false })

  if (!ctx) return

  // Create a temporary canvas for accumulating frames
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = frameWidth.value
  tempCanvas.height = frameHeight.value
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: false })

  if (!tempCtx) return

  gifFrames.forEach((frame: any, index: number) => {
    // Handle disposal method for previous frame
    if (index > 0) {
      const prevFrame = gifFrames[index - 1]
      if (prevFrame.disposalType === 2) {
        // Restore to background (clear the previous frame area)
        tempCtx.clearRect(
          prevFrame.dims.left,
          prevFrame.dims.top,
          prevFrame.dims.width,
          prevFrame.dims.height,
        )
      }
      // disposalType 0 or 1: leave as is (accumulate)
    }

    // Clear canvas and draw accumulated frames
    ctx.clearRect(0, 0, frameWidth.value, frameHeight.value)
    ctx.drawImage(tempCanvas, 0, 0)

    // Draw current frame patch
    const patchCanvas = document.createElement('canvas')
    patchCanvas.width = frame.dims.width
    patchCanvas.height = frame.dims.height
    const patchCtx = patchCanvas.getContext('2d')
    if (patchCtx) {
      const patchImageData = patchCtx.createImageData(frame.dims.width, frame.dims.height)
      patchImageData.data.set(frame.patch)
      patchCtx.putImageData(patchImageData, 0, 0)
      ctx.drawImage(patchCanvas, frame.dims.left, frame.dims.top)
    }

    // Save current complete frame to temp canvas for next iteration
    tempCtx.clearRect(0, 0, frameWidth.value, frameHeight.value)
    tempCtx.drawImage(canvas, 0, 0)

    // Export frame as data URL
    frames.value.push(canvas.toDataURL('image/png'))
  })

  gifLoaded.value = true
}

function toggleFrame(index: number) {
  const pos = selectedFrames.value.indexOf(index)
  if (pos > -1) {
    selectedFrames.value.splice(pos, 1)
  } else {
    selectedFrames.value.push(index)
  }
  selectedFrames.value.sort((a, b) => a - b)
}

function selectAll() {
  selectedFrames.value = frames.value.map((_, i) => i)
}

function deselectAll() {
  selectedFrames.value = []
}

async function downloadFrames() {
  if (selectedFrames.value.length === 0) return

  for (const index of selectedFrames.value) {
    const frameData = frames.value[index]

    // Convert to desired format if needed
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = frameWidth.value
      canvas.height = frameHeight.value
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            const baseName = gifFileName.value.replace('.gif', '')
            link.href = url
            link.download = `${baseName}_frame_${index + 1}.${exportFormat.value}`
            link.click()
            URL.revokeObjectURL(url)
          }
        },
        `image/${exportFormat.value}`,
        exportQuality.value[0] / 100,
      )
    }
    img.src = frameData

    // Add delay between downloads to avoid browser blocking
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
}

function resetAll() {
  gifLoaded.value = false
  frames.value = []
  selectedFrames.value = []
  gifFileName.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: #f3f4f6;
  border-radius: 8px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #a3a3a3;
  border-radius: 8px;
}
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #a3a3a3 #f3f4f6;
}
</style>
