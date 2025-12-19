<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Compress images to reduce file size while maintaining quality. Supports JPEG, PNG, and WebP
      formats with adjustable compression levels.
    </p>
    <Card class="route-transition-animation w-full max-w-7xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:arrow-compress" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Image Compressor
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

        <!-- Compression Settings & Preview -->
        <div v-if="originalImage" class="space-y-6">
          <!-- Settings -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-2 transition-all">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:tune" class="text-primary" />
                  Quality: {{ quality[0] }}%
                </Label>
                <Slider
                  v-model="quality"
                  :min="1"
                  :max="100"
                  :step="1"
                  class="w-full"
                  @update:model-value="compressImage"
                />
              </div>
              <div>
                <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:file-image" class="text-primary" />
                  Output Format
                </Label>
                <Select v-model="outputFormat" @update:model-value="compressImage">
                  <SelectTrigger class="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <!-- Image Preview -->
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <!-- Original -->
            <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
              <Label class="mb-2 flex items-center gap-2 font-semibold">
                <Icon icon="mdi:image-outline" class="text-primary" />
                Original
              </Label>
              <div class="overflow-hidden rounded-lg border bg-white p-2 dark:bg-gray-900">
                <img :src="originalImage" alt="Original" class="h-auto w-full object-contain" />
              </div>
              <div class="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                <Icon icon="mdi:file-document" class="h-4 w-4" />
                Size: {{ formatFileSize(originalSize) }}
              </div>
            </div>

            <!-- Compressed -->
            <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
              <Label class="mb-2 flex items-center gap-2 font-semibold">
                <Icon icon="mdi:image-check" class="text-primary" />
                Compressed
              </Label>
              <div class="overflow-hidden rounded-lg border bg-white p-2 dark:bg-gray-900">
                <img
                  v-if="compressedImage"
                  :src="compressedImage"
                  alt="Compressed"
                  class="h-auto w-full object-contain"
                />
                <div v-else class="text-muted-foreground flex h-48 items-center justify-center">
                  <Icon icon="mdi:loading" class="h-8 w-8 animate-spin" />
                </div>
              </div>
              <div class="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                <Icon icon="mdi:file-document" class="h-4 w-4" />
                Size: {{ formatFileSize(compressedSize) }}
                <span
                  v-if="compressionRatio > 0"
                  class="ml-auto flex items-center gap-1 font-semibold text-green-600 dark:text-green-400"
                >
                  <Icon icon="mdi:arrow-down" class="h-4 w-4" />
                  {{ compressionRatio }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <Button @click="downloadImage" :disabled="!compressedImage" class="h-12">
              <Icon icon="mdi:download" class="mr-2" />
              Download Compressed
            </Button>
            <Button @click="resetAll" variant="outline" class="h-12">
              <Icon icon="mdi:refresh" class="mr-2" />
              New Image
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
const originalImage = ref<string | null>(null)
const compressedImage = ref<string | null>(null)
const originalSize = ref(0)
const compressedSize = ref(0)
const quality = ref([80])
const outputFormat = ref('image/jpeg')
const originalFileName = ref('')

const compressionRatio = ref(0)

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
  originalSize.value = file.size

  const reader = new FileReader()
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string
    compressImage()
  }
  reader.readAsDataURL(file)
}

function compressImage() {
  if (!originalImage.value) return

  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')

    // For better PNG compression, scale down if quality is low
    const qualityValue = quality.value[0]
    const scaleFactor = outputFormat.value === 'image/png' ? qualityValue / 100 : 1

    canvas.width = Math.floor(img.width * scaleFactor)
    canvas.height = Math.floor(img.height * scaleFactor)

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false })
    if (!ctx) return

    // Use image smoothing for quality
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = qualityValue > 80 ? 'high' : qualityValue > 50 ? 'medium' : 'low'

    // Clear canvas and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // For PNG, use quality to affect the dimensions; for JPEG/WebP use native quality
    const compressionQuality = outputFormat.value === 'image/png' ? 1 : qualityValue / 100

    canvas.toBlob(
      (blob) => {
        if (blob) {
          compressedSize.value = blob.size
          compressionRatio.value = Math.round(
            ((originalSize.value - compressedSize.value) / originalSize.value) * 100,
          )
          compressedImage.value = URL.createObjectURL(blob)
        }
      },
      outputFormat.value,
      compressionQuality,
    )
  }
  img.src = originalImage.value
}

function downloadImage() {
  if (!compressedImage.value) return

  const extension = outputFormat.value.split('/')[1]
  const link = document.createElement('a')
  link.href = compressedImage.value
  link.download = `${originalFileName.value}_compressed.${extension}`
  link.click()
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function resetAll() {
  originalImage.value = null
  compressedImage.value = null
  originalSize.value = 0
  compressedSize.value = 0
  quality.value = [80]
  outputFormat.value = 'image/jpeg'
  compressionRatio.value = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
