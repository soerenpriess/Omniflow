<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Crop, rotate, and flip your images with ease. Upload an image to get started.
    </p>
    <Card class="route-transition-animation mt-12 w-full max-w-7xl rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <Icon icon="mdi:crop-rotate" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Image Crop & Rotate Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Upload Section -->
        <div
          v-if="!originalImage"
          class="hover:border-primary mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors sm:p-12"
          @drop.prevent="handleDrop"
          @dragover.prevent
        >
          <Icon icon="mdi:cloud-upload" class="mb-4 h-16 w-16 text-gray-300" />
          <p class="text-muted-foreground mb-2 text-base font-medium sm:text-lg">
            Drag & Drop an image or click to upload
          </p>
          <p class="text-muted-foreground mb-4 text-sm">Supports JPEG, PNG, WebP</p>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
          <Button @click="fileInput?.click()" class="h-10">
            <Icon icon="mdi:folder-open" class="mr-2" />
            Select Image
          </Button>
        </div>

        <!-- Editor Section -->
        <div v-if="originalImage" class="flex flex-col gap-3 lg:flex-row">
          <!-- Left Side: Controls -->
          <div class="space-y-3 lg:w-1/2">
            <!-- Rotation & Flip Controls -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-2 transition-colors sm:p-3"
            >
              <Label class="mb-2 flex items-center gap-2 text-xs font-semibold sm:text-sm">
                <Icon icon="mdi:rotate-3d-variant" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Rotation & Flip
              </Label>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-1 sm:gap-1.5">
                  <Button
                    size="sm"
                    class="h-7 flex-1 text-[10px] sm:h-8 sm:flex-none sm:text-xs"
                    @click="rotate(-90)"
                  >
                    <Icon icon="mdi:rotate-left" class="h-3 w-3 sm:h-4 sm:w-4" />
                    <span class="ml-0.5 sm:ml-1">-90°</span>
                  </Button>
                  <Button
                    size="sm"
                    class="h-7 flex-1 text-[10px] sm:h-8 sm:flex-none sm:text-xs"
                    @click="rotate(90)"
                  >
                    <Icon icon="mdi:rotate-right" class="h-3 w-3 sm:h-4 sm:w-4" />
                    <span class="ml-0.5 sm:ml-1">+90°</span>
                  </Button>
                  <Button
                    size="sm"
                    class="h-7 flex-1 text-[10px] sm:h-8 sm:flex-none sm:text-xs"
                    @click="rotate(180)"
                  >
                    <Icon icon="mdi:rotate-clockwise" class="h-3 w-3 sm:h-4 sm:w-4" />
                    <span class="ml-0.5 sm:ml-1">180°</span>
                  </Button>
                </div>
                <div class="flex flex-wrap gap-1 sm:gap-1.5">
                  <Button
                    size="sm"
                    class="h-7 flex-1 text-[10px] sm:h-8 sm:flex-none sm:text-xs"
                    :variant="flipHorizontal ? 'default' : 'outline'"
                    @click="
                      () => {
                        flipHorizontal = !flipHorizontal
                        applyTransformations()
                      }
                    "
                  >
                    <Icon icon="mdi:flip-horizontal" class="h-3 w-3 sm:h-4 sm:w-4" />
                    <span class="ml-0.5 sm:ml-1">Flip H</span>
                  </Button>
                  <Button
                    size="sm"
                    class="h-7 flex-1 text-[10px] sm:h-8 sm:flex-none sm:text-xs"
                    :variant="flipVertical ? 'default' : 'outline'"
                    @click="
                      () => {
                        flipVertical = !flipVertical
                        applyTransformations()
                      }
                    "
                  >
                    <Icon icon="mdi:flip-vertical" class="h-3 w-3 sm:h-4 sm:w-4" />
                    <span class="ml-0.5 sm:ml-1">Flip V</span>
                  </Button>
                  <Button
                    size="sm"
                    class="h-7 flex-1 text-[10px] sm:h-8 sm:flex-none sm:text-xs"
                    variant="outline"
                    @click="
                      () => {
                        rotation = [0]
                        flipHorizontal = false
                        flipVertical = false
                        applyTransformations()
                      }
                    "
                  >
                    <Icon icon="mdi:refresh" class="h-3 w-3 sm:h-4 sm:w-4" />
                    <span class="ml-0.5 sm:ml-1">Reset</span>
                  </Button>
                </div>
              </div>
              <div class="mt-2 sm:mt-3">
                <Label class="mb-2 flex items-center justify-between text-[10px] sm:text-xs">
                  <span>Custom Angle</span>
                  <span class="text-primary font-semibold">{{ rotation[0] }}°</span>
                </Label>
                <Slider
                  v-model="rotation"
                  :min="0"
                  :max="360"
                  :step="1"
                  @update:model-value="applyTransformations"
                />
              </div>
            </div>

            <!-- Crop Controls -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-2 transition-colors sm:p-3"
            >
              <Label class="mb-2 flex items-center gap-2 text-xs font-semibold sm:text-sm">
                <Icon icon="mdi:crop" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Crop Settings
              </Label>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <Label class="mb-1.5 flex items-center justify-between text-[10px] sm:text-xs">
                    <span class="flex items-center gap-0.5 sm:gap-1">
                      <Icon icon="mdi:arrow-left-right" class="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      X
                    </span>
                    <span class="text-primary font-semibold">{{ cropX[0] }}</span>
                  </Label>
                  <Slider
                    v-model="cropX"
                    :min="0"
                    :max="imageWidth"
                    :step="1"
                    @update:model-value="updateCropPreview"
                  />
                </div>
                <div>
                  <Label class="mb-1.5 flex items-center justify-between text-[10px] sm:text-xs">
                    <span class="flex items-center gap-0.5 sm:gap-1">
                      <Icon icon="mdi:arrow-up-down" class="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      Y
                    </span>
                    <span class="text-primary font-semibold">{{ cropY[0] }}</span>
                  </Label>
                  <Slider
                    v-model="cropY"
                    :min="0"
                    :max="imageHeight"
                    :step="1"
                    @update:model-value="updateCropPreview"
                  />
                </div>
                <div>
                  <Label class="mb-1.5 flex items-center justify-between text-[10px] sm:text-xs">
                    <span class="flex items-center gap-0.5 sm:gap-1">
                      <Icon icon="mdi:arrow-expand-horizontal" class="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      Width
                    </span>
                    <span class="text-primary font-semibold">{{ cropWidth[0] }}</span>
                  </Label>
                  <Slider
                    v-model="cropWidth"
                    :min="1"
                    :max="imageWidth - cropX[0]"
                    :step="1"
                    @update:model-value="updateCropPreview"
                  />
                </div>
                <div>
                  <Label class="mb-1.5 flex items-center justify-between text-[10px] sm:text-xs">
                    <span class="flex items-center gap-0.5 sm:gap-1">
                      <Icon icon="mdi:arrow-expand-vertical" class="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      Height
                    </span>
                    <span class="text-primary font-semibold">{{ cropHeight[0] }}</span>
                  </Label>
                  <Slider
                    v-model="cropHeight"
                    :min="1"
                    :max="imageHeight - cropY[0]"
                    :step="1"
                    @update:model-value="updateCropPreview"
                  />
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                class="mt-2 h-7 w-full text-[10px] sm:mt-3 sm:h-8 sm:text-xs"
                @click="resetCrop"
              >
                <Icon icon="mdi:refresh" class="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                Reset Crop
              </Button>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
              <Button
                @click="downloadImage"
                class="h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm"
              >
                <Icon icon="mdi:download" class="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                Download
              </Button>
              <Button
                @click="resetAll"
                variant="outline"
                class="h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm"
              >
                <Icon icon="mdi:refresh" class="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                New Image
              </Button>
            </div>
          </div>

          <!-- Right Side: Preview -->
          <div class="lg:w-1/2">
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-2 transition-colors sm:p-3"
            >
              <Label
                class="mb-2 flex items-center justify-between text-xs font-semibold sm:text-sm"
              >
                <span class="flex items-center gap-1.5 sm:gap-2">
                  <Icon icon="mdi:image-outline" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Preview
                </span>
                <Button size="sm" variant="ghost" class="h-6 sm:h-7" @click="openFullscreen">
                  <Icon icon="mdi:fullscreen" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </Label>
              <div
                class="border-muted-foreground/20 bg-background/50 flex items-center justify-center rounded-lg border p-2"
                style="min-height: 300px; max-height: 400px; overflow: auto"
              >
                <canvas ref="canvas" style="max-width: 100%; height: auto"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Fullscreen Modal -->
        <Teleport to="body">
          <div
            v-if="isFullscreen"
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
            @click="isFullscreen = false"
          >
            <Button
              size="sm"
              variant="ghost"
              class="absolute top-4 right-4 z-[10000] h-12 w-12 rounded-full bg-white/10 hover:bg-white/20"
              @click.stop="isFullscreen = false"
            >
              <Icon icon="mdi:close" class="h-6 w-6 text-white" />
            </Button>
            <canvas ref="fullscreenCanvas" class="max-h-[95vh] max-w-[95vw]" @click.stop></canvas>
          </div>
        </Teleport>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

const fileInput = ref<HTMLInputElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const fullscreenCanvas = ref<HTMLCanvasElement | null>(null)
const transformedCanvas = document.createElement('canvas')
const originalImage = ref<string | null>(null)
const img = ref<HTMLImageElement | null>(null)
const originalFileName = ref('')
const isFullscreen = ref(false)

const rotation = ref([0])
const flipHorizontal = ref(false)
const flipVertical = ref(false)

const cropX = ref([0])
const cropY = ref([0])
const cropWidth = ref([0])
const cropHeight = ref([0])
const imageWidth = ref(0)
const imageHeight = ref(0)

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    loadImage(file)
  }
}

function handleDrop(event: DragEvent) {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

function loadImage(file: File) {
  originalFileName.value = file.name.split('.')[0]

  const reader = new FileReader()
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string
    const image = new Image()
    image.onload = () => {
      img.value = image
      imageWidth.value = image.width
      imageHeight.value = image.height
      cropX.value = [0]
      cropY.value = [0]
      cropWidth.value = [image.width]
      cropHeight.value = [image.height]
      applyTransformations()
    }
    image.src = originalImage.value
  }
  reader.readAsDataURL(file)
}

function rotate(degrees: number) {
  rotation.value = [(rotation.value[0] + degrees) % 360]
  if (rotation.value[0] < 0) rotation.value = [rotation.value[0] + 360]
  applyTransformations()
}

function updateCropPreview() {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // Set canvas size to crop dimensions (actual pixels)
  canvas.value.width = cropWidth.value[0]
  canvas.value.height = cropHeight.value[0]

  // Draw the cropped portion from the transformed canvas
  ctx.drawImage(
    transformedCanvas,
    cropX.value[0],
    cropY.value[0],
    cropWidth.value[0],
    cropHeight.value[0],
    0,
    0,
    cropWidth.value[0],
    cropHeight.value[0],
  )
}

function openFullscreen() {
  isFullscreen.value = true
  setTimeout(() => {
    if (!fullscreenCanvas.value || !canvas.value) return
    const fsCtx = fullscreenCanvas.value.getContext('2d')
    if (fsCtx && canvas.value.width > 0 && canvas.value.height > 0) {
      fullscreenCanvas.value.width = canvas.value.width
      fullscreenCanvas.value.height = canvas.value.height
      fsCtx.drawImage(canvas.value, 0, 0)
    }
  }, 100)
}

function applyTransformations() {
  if (!img.value || !canvas.value) return

  const ctx = transformedCanvas.getContext('2d')
  if (!ctx) return

  const angleRad = (rotation.value[0] * Math.PI) / 180

  // Calculate new canvas size based on rotation
  const cos = Math.abs(Math.cos(angleRad))
  const sin = Math.abs(Math.sin(angleRad))
  const newWidth = img.value.width * cos + img.value.height * sin
  const newHeight = img.value.width * sin + img.value.height * cos

  transformedCanvas.width = newWidth
  transformedCanvas.height = newHeight

  // Update image dimensions for crop constraints
  imageWidth.value = newWidth
  imageHeight.value = newHeight

  ctx.clearRect(0, 0, newWidth, newHeight)
  ctx.save()

  // Move to center
  ctx.translate(newWidth / 2, newHeight / 2)

  // Apply flip
  ctx.scale(flipHorizontal.value ? -1 : 1, flipVertical.value ? -1 : 1)

  // Rotate
  ctx.rotate(angleRad)

  // Draw image centered
  ctx.drawImage(img.value, -img.value.width / 2, -img.value.height / 2)

  ctx.restore()

  // Update crop values if they exceed new dimensions
  if (cropX.value[0] > newWidth) cropX.value = [0]
  if (cropY.value[0] > newHeight) cropY.value = [0]
  if (cropWidth.value[0] > newWidth - cropX.value[0]) cropWidth.value = [newWidth - cropX.value[0]]
  if (cropHeight.value[0] > newHeight - cropY.value[0])
    cropHeight.value = [newHeight - cropY.value[0]]

  // Show the crop preview
  updateCropPreview()
}

function resetCrop() {
  cropX.value = [0]
  cropY.value = [0]
  cropWidth.value = [imageWidth.value]
  cropHeight.value = [imageHeight.value]
}

function downloadImage() {
  if (!canvas.value) return

  canvas.value.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${originalFileName.value}_edited.png`
      link.click()
      URL.revokeObjectURL(url)
    }
  })
}

function resetAll() {
  originalImage.value = null
  img.value = null
  rotation.value = [0]
  flipHorizontal.value = false
  flipVertical.value = false
  cropX.value = [0]
  cropY.value = [0]
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
