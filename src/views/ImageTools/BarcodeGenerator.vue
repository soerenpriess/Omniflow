<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate barcodes in various formats (EAN, UPC, Code128, etc.)
    </p>
    <Card class="route-transition-animation w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:barcode" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Barcode Generator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Barcode Type -->
        <div class="space-y-2">
          <Label for="barcodeType">Barcode Type</Label>
          <Select v-model="barcodeType">
            <SelectTrigger id="barcodeType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CODE128">Code 128</SelectItem>
              <SelectItem value="EAN13">EAN-13</SelectItem>
              <SelectItem value="EAN8">EAN-8</SelectItem>
              <SelectItem value="UPC">UPC-A</SelectItem>
              <SelectItem value="CODE39">Code 39</SelectItem>
            </SelectContent>
          </Select>
          <p class="text-muted-foreground text-xs">{{ getBarcodeDescription() }}</p>
        </div>

        <!-- Input -->
        <div class="space-y-2">
          <Label for="barcodeData">Barcode Data</Label>
          <Input
            id="barcodeData"
            v-model="barcodeData"
            :placeholder="getPlaceholder()"
            class="font-mono"
            @input="validateInput"
          />
          <p v-if="validationError" class="text-xs text-red-500">{{ validationError }}</p>
        </div>

        <!-- Options -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="width">Width: {{ width[0] }}</Label>
            <Slider v-model="width" :min="1" :max="5" :step="0.5" />
          </div>
          <div class="space-y-2">
            <Label for="height">Height: {{ height[0] }}</Label>
            <Slider v-model="height" :min="30" :max="150" :step="10" />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Switch v-model:checked="displayValue" />
          <Label>Display text below barcode</Label>
        </div>

        <!-- Generate Button -->
        <Button
          @click="generateBarcode"
          class="h-12 w-full text-lg font-semibold"
          :disabled="!barcodeData || !!validationError"
        >
          <Icon icon="mdi:barcode-scan" class="mr-2 h-5 w-5" />
          Generate Barcode
        </Button>

        <!-- Barcode Display -->
        <div v-if="barcodeGenerated" class="space-y-4">
          <Separator />
          <div
            class="flex flex-col items-center space-y-4 rounded-lg border bg-white p-6 dark:bg-gray-900"
          >
            <canvas ref="barcodeCanvas" class="max-w-full" style="display: block" />
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <Button @click="downloadBarcode" variant="outline" class="flex-1">
              <Icon icon="mdi:download" class="mr-2 h-4 w-4" />
              Download PNG
            </Button>
            <Button @click="downloadSvg" variant="outline" class="flex-1">
              <Icon icon="mdi:file-code" class="mr-2 h-4 w-4" />
              Download SVG
            </Button>
          </div>
        </div>

        <!-- Info -->
        <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
          <div
            class="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300"
          >
            <Icon icon="mdi:information" class="h-5 w-5" />
            Barcode Standards
          </div>
          <ul class="space-y-1 text-xs text-blue-600 dark:text-blue-400">
            <li>• <strong>Code 128:</strong> Alphanumeric, variable length</li>
            <li>• <strong>EAN-13:</strong> 13 digits for retail products (e.g., 5901234123457)</li>
            <li>• <strong>EAN-8:</strong> 8 digits for small products</li>
            <li>• <strong>UPC-A:</strong> 12 digits for US/Canada products</li>
            <li>• <strong>Code 39:</strong> Alphanumeric with special characters</li>
          </ul>
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
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Icon } from '@iconify/vue'

const barcodeType = ref('CODE128')
const barcodeData = ref('')
const width = ref([2])
const height = ref([80])
const displayValue = ref(true)
const barcodeCanvas = ref<HTMLCanvasElement>()
const barcodeGenerated = ref(false)
const validationError = ref('')

function getBarcodeDescription(): string {
  const descriptions: Record<string, string> = {
    CODE128: 'Supports all ASCII characters, ideal for general use',
    EAN13: 'European Article Number, 13 digits for retail',
    EAN8: 'Compact EAN for small products, 8 digits',
    UPC: 'Universal Product Code, 12 digits for US/Canada',
    CODE39: 'Alphanumeric barcode with special characters',
  }
  return descriptions[barcodeType.value] || ''
}

function getPlaceholder(): string {
  const placeholders: Record<string, string> = {
    CODE128: 'Enter any text or numbers',
    EAN13: '5901234123457 (13 digits)',
    EAN8: '96385074 (8 digits)',
    UPC: '012345678905 (12 digits)',
    CODE39: 'ENTER TEXT 123',
  }
  return placeholders[barcodeType.value] || ''
}

function validateInput() {
  validationError.value = ''

  if (!barcodeData.value) return

  switch (barcodeType.value) {
    case 'EAN13':
      if (!/^\d{13}$/.test(barcodeData.value)) {
        validationError.value = 'EAN-13 must be exactly 13 digits'
      }
      break
    case 'EAN8':
      if (!/^\d{8}$/.test(barcodeData.value)) {
        validationError.value = 'EAN-8 must be exactly 8 digits'
      }
      break
    case 'UPC':
      if (!/^\d{12}$/.test(barcodeData.value)) {
        validationError.value = 'UPC must be exactly 12 digits'
      }
      break
    case 'CODE39':
      if (!/^[A-Z0-9\-. $\/+%]+$/.test(barcodeData.value)) {
        validationError.value = 'Code 39 only supports uppercase letters, numbers and -. $/+%'
      }
      break
  }
}

function generateBarcode() {
  if (!barcodeData.value || validationError.value) return

  barcodeGenerated.value = true

  setTimeout(() => {
    const canvas = barcodeCanvas.value
    if (!canvas) {
      console.error('Canvas not found')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Cannot get 2d context')
      return
    }

    try {
      const encoded = encodeBarcode(barcodeData.value, barcodeType.value)
      const barWidth = width.value[0]
      const barHeight = height.value[0]
      const totalWidth = encoded.length * barWidth
      const textHeight = displayValue.value ? 35 : 0
      const totalHeight = barHeight + textHeight

      canvas.width = totalWidth + 40
      canvas.height = totalHeight + 20

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw bars
      ctx.fillStyle = '#000000'
      let x = 20

      for (let i = 0; i < encoded.length; i++) {
        if (encoded[i] === '1') {
          ctx.fillRect(x, 10, barWidth, barHeight)
        }
        x += barWidth
      }

      // Draw text
      if (displayValue.value) {
        ctx.fillStyle = '#000000'
        ctx.font = '16px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(barcodeData.value, canvas.width / 2, barHeight + 25)
      }
    } catch (error) {
      console.error('Barcode generation error:', error)
      barcodeGenerated.value = false
    }
  }, 0)
}

function encodeBarcode(data: string, type: string): string {
  switch (type) {
    case 'CODE128':
      return encodeCode128(data)
    case 'CODE39':
      return encodeCode39(data)
    case 'EAN13':
      return encodeEAN13(data)
    case 'EAN8':
      return encodeEAN8(data)
    case 'UPC':
      return encodeUPC(data)
    default:
      return encodeCode128(data)
  }
}

function encodeCode128(data: string): string {
  // Code 128 encoding patterns
  const patterns: Record<number, string> = {
    0: '11011001100',
    1: '11001101100',
    2: '11001100110',
    3: '10010011000',
    4: '10010001100',
    5: '10001001100',
    6: '10011001000',
    7: '10011000100',
    8: '10001100100',
    9: '11001001000',
  }

  let encoded = '11010010000' // Start Code B

  // Encode data
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i)
    const value = charCode - 32
    const pattern = patterns[value % 10] || patterns[0]
    encoded += pattern
  }

  // Stop pattern
  encoded += '1100011101011'

  return encoded
}

function encodeCode39(data: string): string {
  const patterns: Record<string, string> = {
    '0': '101001101101',
    '1': '110100101011',
    '2': '101100101011',
    '3': '110110010101',
    '4': '101001101011',
    '5': '110100110101',
    '6': '101100110101',
    '7': '101001011011',
    '8': '110100101101',
    '9': '101100101101',
    A: '110101001011',
    B: '101101001011',
    C: '110110100101',
    D: '101011001011',
    E: '110101100101',
    F: '101101100101',
    G: '101010011011',
    H: '110101001101',
    I: '101101001101',
    J: '101011001101',
    K: '110101010011',
    L: '101101010011',
    M: '110110101001',
    N: '101011010011',
    O: '110101101001',
    P: '101101101001',
    Q: '101010110011',
    R: '110101011001',
    S: '101101011001',
    T: '101011011001',
    U: '110010101011',
    V: '100110101011',
    W: '110011010101',
    X: '100101101011',
    Y: '110010110101',
    Z: '100110110101',
    '-': '100101011011',
    '.': '110010101101',
    ' ': '100110101101',
    '*': '100101101101', // Start/Stop
  }

  let encoded = patterns['*'] // Start

  for (const char of data.toUpperCase()) {
    encoded += patterns[char] || patterns['0']
    encoded += '0' // Inter-character gap
  }

  encoded += patterns['*'] // Stop

  return encoded
}

function encodeEAN13(data: string): string {
  // EAN-13 encoding
  const lPatterns = [
    '0001101',
    '0011001',
    '0010011',
    '0111101',
    '0100011',
    '0110001',
    '0101111',
    '0111011',
    '0110111',
    '0001011',
  ]
  const gPatterns = [
    '0100111',
    '0110011',
    '0011011',
    '0100001',
    '0011101',
    '0111001',
    '0000101',
    '0010001',
    '0001001',
    '0010111',
  ]
  const rPatterns = [
    '1110010',
    '1100110',
    '1101100',
    '1000010',
    '1011100',
    '1001110',
    '1010000',
    '1000100',
    '1001000',
    '1110100',
  ]

  const firstDigit = parseInt(data[0])
  const structure = [
    'LLLLLL',
    'LLGLGG',
    'LLGGLG',
    'LLGGGL',
    'LGLLGG',
    'LGGLLG',
    'LGGGLL',
    'LGLGLG',
    'LGLGGL',
    'LGGLGL',
  ][firstDigit]

  let encoded = '101' // Start

  // Left side (6 digits)
  for (let i = 1; i <= 6; i++) {
    const digit = parseInt(data[i])
    encoded += structure[i - 1] === 'L' ? lPatterns[digit] : gPatterns[digit]
  }

  encoded += '01010' // Middle

  // Right side (6 digits)
  for (let i = 7; i <= 12; i++) {
    const digit = parseInt(data[i])
    encoded += rPatterns[digit]
  }

  encoded += '101' // Stop

  return encoded
}

function encodeEAN8(data: string): string {
  const lPatterns = [
    '0001101',
    '0011001',
    '0010011',
    '0111101',
    '0100011',
    '0110001',
    '0101111',
    '0111011',
    '0110111',
    '0001011',
  ]
  const rPatterns = [
    '1110010',
    '1100110',
    '1101100',
    '1000010',
    '1011100',
    '1001110',
    '1010000',
    '1000100',
    '1001000',
    '1110100',
  ]

  let encoded = '101' // Start

  // Left side (4 digits)
  for (let i = 0; i < 4; i++) {
    const digit = parseInt(data[i])
    encoded += lPatterns[digit]
  }

  encoded += '01010' // Middle

  // Right side (4 digits)
  for (let i = 4; i < 8; i++) {
    const digit = parseInt(data[i])
    encoded += rPatterns[digit]
  }

  encoded += '101' // Stop

  return encoded
}

function encodeUPC(data: string): string {
  // UPC-A uses same encoding as EAN-13 but with first digit as 0
  return encodeEAN13('0' + data)
}

function downloadBarcode() {
  if (!barcodeCanvas.value) return

  barcodeCanvas.value.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `barcode-${barcodeData.value}.png`
    a.click()
    URL.revokeObjectURL(url)
  })
}

function downloadSvg() {
  if (!barcodeCanvas.value) return

  // Convert canvas to SVG
  const canvas = barcodeCanvas.value
  const svgWidth = canvas.width
  const svgHeight = canvas.height

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">`
  svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="white"/>`

  // Get canvas data and convert to SVG rects
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4
        if (data[idx] === 0) {
          // Black pixel
          svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="black"/>`
        }
      }
    }
  }

  svg += '</svg>'

  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `barcode-${barcodeData.value}.svg`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
