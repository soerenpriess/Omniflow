<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate customizable QR codes with colors, styles, and embedded images
    </p>
    <Card class="route-transition-animation w-full max-w-3xl rounded-2xl shadow-lg">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:qrcode" class="text-primary h-7 w-7" />
          Custom QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Left Section: text and size and colors -->
          <div class="space-y-6">
            <!-- QR Text -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-colors"
            >
              <Label for="qr-text" class="mb-2 flex items-center gap-2 font-medium">
                <Icon icon="mdi:text" class="text-primary h-4 w-4" />
                QR Text/URL
              </Label>
              <Input v-model="qrText" id="qr-text" placeholder="Enter text or URL" class="w-full" />
            </div>

            <!-- size -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-colors"
            >
              <div class="mb-3 flex items-center gap-2 font-medium">
                <Icon icon="mdi:resize" class="text-primary h-4 w-4" />
                Size
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="qr-width" class="mb-2 block text-sm">Width (px)</Label>
                  <Input
                    v-model.number="qrWidth"
                    id="qr-width"
                    type="number"
                    min="100"
                    max="1000"
                    class="w-full"
                  />
                </div>
                <div>
                  <Label for="qr-height" class="mb-2 block text-sm">Height (px)</Label>
                  <Input
                    v-model.number="qrHeight"
                    id="qr-height"
                    type="number"
                    min="100"
                    max="1000"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- colors -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-colors"
            >
              <div class="mb-3 flex items-center gap-2 font-medium">
                <Icon icon="mdi:palette" class="text-primary h-4 w-4" />
                Colors
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="qr-color" class="mb-2 block text-sm">Color</Label>
                  <Input v-model="qrColor" id="qr-color" type="color" class="h-10 w-full p-0" />
                </div>
                <div>
                  <Label for="qr-bg-color" class="mb-2 block text-sm">Background</Label>
                  <Input
                    v-model="qrBgColor"
                    id="qr-bg-color"
                    type="color"
                    class="h-10 w-full p-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Section: Margin, Advanced Options -->
          <div class="space-y-6">
            <!-- Margin -->
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-colors"
            >
              <Label for="qr-margin" class="mb-2 flex items-center gap-2 font-medium">
                <Icon icon="mdi:arrow-expand-all" class="text-primary h-4 w-4" />
                Margin
              </Label>
              <Input
                v-model.number="qrMargin"
                id="qr-margin"
                type="number"
                min="0"
                max="20"
                class="w-full"
              />
            </div>

            <!-- Advanced Options -->
            <fieldset
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-colors"
            >
              <legend class="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Icon icon="mdi:cog" class="text-primary h-5 w-5" />
                Advanced Options
              </legend>

              <!-- Error Correction -->
              <div class="mb-4">
                <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:shield-check" class="text-primary h-4 w-4" />
                  Error Correction Level
                </Label>
                <Select v-model="qrOptions.errorCorrectionLevel">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select error correction level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">L - Low</SelectItem>
                    <SelectItem value="M">M - Medium</SelectItem>
                    <SelectItem value="Q">Q - Quartile</SelectItem>
                    <SelectItem value="H">H - High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Dot Style -->
              <div>
                <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:dots-grid" class="text-primary h-4 w-4" />
                  Dot Style
                </Label>
                <Select v-model="dotsOptions.type">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select dot style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="classy">Classy</SelectItem>
                    <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </fieldset>
          </div>
        </div>

        <Button @click="generateQR" class="mt-6 h-14 w-full text-xl">
          <Icon icon="mdi:qrcode-plus" class="mr-2 h-6 w-6" />
          Generate QR Code
        </Button>
      </CardContent>
    </Card>

    <!-- QR Code Preview -->
    <Card v-if="showQR" class="mt-4 w-full rounded-2xl shadow-lg lg:w-auto">
      <CardContent class="flex items-center justify-center">
        <QRCodeVue3
          :value="qrText"
          :key="
            qrText +
            qrWidth +
            qrHeight +
            qrColor +
            qrBgColor +
            JSON.stringify(qrOptions) +
            JSON.stringify(dotsOptions) +
            image
          "
          :width="qrWidth"
          :height="qrHeight"
          :backgroundOptions="{ color: qrBgColor }"
          :margin="qrMargin"
          :qrOptions="qrOptions"
          :dotsOptions="dotsOptions"
          :cornersSquareOptions="cornersSquareOptions"
          :cornersDotOptions="cornersDotOptions"
          :image="image"
          :imageOptions="imageOptions"
          :download="download"
          :downloadOptions="downloadOptions"
        />
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import QRCodeVue3 from 'qrcode-vue3'
import { Icon } from '@iconify/vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const qrText = ref('https://example.com')
const qrWidth = ref(200)
const qrHeight = ref(200)
const qrColor = ref('#000000')
const qrBgColor = ref('#ffffff')
const qrMargin = ref(2)
const showQR = ref(false)

const qrOptions = reactive({
  typeNumber: 0,
  mode: 'Byte',
  errorCorrectionLevel: 'Q',
})

const dotsOptions = reactive({
  type: 'square',
  color: '#000000',
  gradient: null,
})

const cornersSquareOptions = reactive({
  type: 'square',
  color: '#000000',
  gradient: null,
})

const cornersDotOptions = reactive({
  type: 'square',
  color: '#000000',
  gradient: null,
})

const image = ref('')
const imageOptions = reactive({
  hideBackgroundDots: true,
  imageSize: 0.4,
  margin: 0,
  crossOrigin: '',
})

const download = ref(false)
const downloadOptions = reactive({
  name: 'qr',
  extension: 'png',
})

function generateQR() {
  showQR.value = false
  setTimeout(() => {
    showQR.value = true
  }, 50)
}
</script>
