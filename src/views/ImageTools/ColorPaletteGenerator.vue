<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate beautiful color palettes from a base color or extract colors from images.
    </p>
    <Card class="route-transition-animation w-full max-w-lg rounded-2xl shadow-lg">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <Icon icon="mdi:palette" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Color Palette Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Color input + type selectors -->
        <div
          class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-3 transition-colors"
        >
          <Label class="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Icon icon="mdi:eyedropper" class="h-4 w-4" />
            Base Color
          </Label>
          <div class="flex items-center gap-3">
            <input
              type="color"
              v-model="baseColor"
              class="h-12 w-12 cursor-pointer rounded-lg shadow"
            />
            <span class="font-mono text-sm">{{ baseColor }}</span>
            <Button size="sm" variant="outline" class="ml-auto h-8" @click="randomBaseColor">
              <Icon icon="mdi:shuffle-variant" class="mr-1 h-3 w-3" />
              Random
            </Button>
          </div>
        </div>

        <!-- Select options -->
        <div
          class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-3 transition-colors"
        >
          <Label class="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Icon icon="mdi:tune" class="h-4 w-4" />
            Palette Options
          </Label>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label class="mb-1 text-xs">Type</Label>
              <Select v-model="paletteType">
                <SelectTrigger class="h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="analogous">Analogous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label class="mb-1 text-xs">Colors</Label>
              <Input type="number" v-model.number="paletteSize" min="3" max="10" class="h-9" />
            </div>

            <div>
              <Label class="mb-1 text-xs">Format</Label>
              <Select v-model="colorFormat">
                <SelectTrigger class="h-9">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hex">HEX</SelectItem>
                  <SelectItem value="rgb">RGB</SelectItem>
                  <SelectItem value="hsl">HSL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button class="mb-4 h-9 w-full" @click="generatePalette">
          <Icon icon="mdi:palette-advanced" class="mr-2 h-4 w-4" />
          Generate Palette
        </Button>

        <div class="border-muted-foreground/20 my-4 border-t"></div>
        <!-- image upload -->
        <div
          class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-3 transition-colors"
        >
          <Label class="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Icon icon="mdi:image" class="h-4 w-4" />
            Generate From Image
          </Label>
          <Input type="file" accept="image/*" @change="onImageChange" class="mb-2" />
          <!-- Preview image -->
          <div
            v-if="imageDataUrl"
            class="relative mx-auto my-2"
            style="
              width: 160px;
              height: 160px;
              overflow: hidden;
              border-radius: 16px;
              background: #eee;
            "
          >
            <img
              :src="imageDataUrl"
              alt="preview"
              style="
                position: absolute;
                top: 0;
                left: 0;
                min-width: 100%;
                min-height: 100%;
                object-fit: cover;
              "
              class="h-full w-full object-cover"
            />
          </div>

          <!-- Hidden canvas for analysis -->
          <canvas ref="canvas" width="80" height="80" style="display: none"></canvas>
          <Button @click="generateFromImage" :disabled="!imageDataUrl" class="h-9 w-full">
            <Icon icon="mdi:image-filter-hdr" class="mr-2 h-4 w-4" />
            Generate from Image
          </Button>
        </div>

        <!-- Generated Palette Preview -->
        <div v-if="palette.length" class="border-muted-foreground/20 mt-4 rounded-lg border p-3">
          <Label class="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Icon icon="mdi:palette-swatch" class="h-4 w-4" />
            Generated Palette
          </Label>
          <div class="flex flex-col gap-2">
            <div v-for="(col, i) in palette" :key="i" class="flex items-center gap-3">
              <div
                :style="{
                  background: col.hex,
                  height: '36px',
                  width: '100%',
                  borderRadius: '6px',
                }"
                class="shadow-sm"
              ></div>
              <span class="w-32 text-center font-mono text-xs">
                {{ colorFormat === 'hex' ? col.hex : colorFormat === 'rgb' ? col.rgb : col.hsl }}
              </span>
              <Button size="sm" variant="outline" class="h-8" @click="copyToClipboard(i)">
                <Icon v-if="copiedIndex === i" icon="mdi:check" class="h-3 w-3" />
                <Icon v-else icon="mdi:content-copy" class="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
const baseColor = ref('#3498db')
const colorFormat = ref<'hex' | 'rgb' | 'hsl'>('hex')
const paletteType = ref<'monochrome' | 'complementary' | 'analogous'>('monochrome')
const paletteSize = ref(5)
const palette = ref<any[]>([])
const copiedIndex = ref<number | null>(null)

const imageDataUrl = ref<string | null>(null)
const image = ref<HTMLImageElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

function randomBaseColor() {
  baseColor.value =
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
}

function onImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    imageDataUrl.value = reader.result as string
    nextTick(() => {
      image.value = new window.Image()
      if (imageDataUrl.value) image.value.src = imageDataUrl.value
    })
  }
  reader.readAsDataURL(file)
}

function generateFromImage() {
  if (!imageDataUrl.value || !image.value || !canvas.value) return

  const w = 80,
    h = 80
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  // Draw the complete image resized to the canvas
  ctx.drawImage(image.value, 0, 0, w, h)

  const { data } = ctx.getImageData(0, 0, w, h)
  const colorBins: Record<string, number> = {}
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue
    const r = data[i] & 0xe0,
      g = data[i + 1] & 0xe0,
      b = data[i + 2] & 0xe0
    const key = `${r},${g},${b}`
    colorBins[key] = (colorBins[key] || 0) + 1
  }

  let sortedColors = Object.entries(colorBins)
    .sort((a, b) => b[1] - a[1])
    .slice(0, paletteSize.value)
    .map(([k]) => {
      const [r, g, b] = k.split(',').map(Number)
      const hex = rgbToHex(r, g, b)
      const hsl = rgbToHSL(r, g, b)
      return {
        hex,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        h: hsl.h,
        l: hsl.l,
      }
    })

  // Palette type post-processing as before
  if (paletteType.value === 'monochrome' && sortedColors.length) {
    sortedColors = sortedColors.sort((a, b) => a.l - b.l).slice(0, paletteSize.value)
  } else if (paletteType.value === 'analogous' && sortedColors.length) {
    const base = sortedColors[0].h
    sortedColors = sortedColors
      .sort(
        (a, b) =>
          Math.abs(((a.h - base + 540) % 360) - 180) - Math.abs(((b.h - base + 540) % 360) - 180),
      )
      .slice(0, paletteSize.value)
  } else if (paletteType.value === 'complementary' && sortedColors.length) {
    const base = sortedColors[0].h
    sortedColors = sortedColors
      .sort(
        (a, b) =>
          Math.abs(((a.h - base + 180 + 360) % 360) - 180) -
          Math.abs(((b.h - base + 180 + 360) % 360) - 180),
      )
      .slice(0, paletteSize.value)
  }

  palette.value = sortedColors.map(({ hex, rgb, hsl }) => ({ hex, rgb, hsl }))
}

function generatePalette() {
  const hsl = hexToHSL(baseColor.value)
  const colors: any[] = []

  if (paletteType.value === 'monochrome') {
    const step = 40 / (paletteSize.value - 1)
    for (let i = 0; i < paletteSize.value; i++) {
      const l = Math.max(0, Math.min(100, hsl.l - 20 + step * i))
      colors.push(hslColorObj(hsl.h, hsl.s, l))
    }
  } else if (paletteType.value === 'complementary') {
    for (let i = 0; i < paletteSize.value; i++) {
      const h = (hsl.h + (i * 180) / (paletteSize.value - 1)) % 360
      colors.push(hslColorObj(h, hsl.s, hsl.l))
    }
  } else if (paletteType.value === 'analogous') {
    const spread = 60
    for (let i = 0; i < paletteSize.value; i++) {
      const h = (hsl.h - spread / 2 + (spread * i) / (paletteSize.value - 1) + 360) % 360
      colors.push(hslColorObj(h, hsl.s, hsl.l))
    }
  }

  palette.value = colors
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

function rgbToHSL(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hexToHSL(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return rgbToHSL(r, g, b)
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1))
  const r = Math.round(255 * f(0))
  const g = Math.round(255 * f(8))
  const b = Math.round(255 * f(4))
  return rgbToHex(r, g, b)
}

function hslColorObj(h: number, s: number, l: number) {
  const hex = hslToHex(h, s, l)
  const rgb = hexToRGB(hex)
  const hsl = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
  return { hex, rgb, hsl }
}

function hexToRGB(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

function copyToClipboard(idx: number) {
  const col = palette.value[idx]
  const value =
    colorFormat.value === 'hex' ? col.hex : colorFormat.value === 'rgb' ? col.rgb : col.hsl
  navigator.clipboard.writeText(value)
  copiedIndex.value = idx
  setTimeout(() => (copiedIndex.value = null), 1500)
}
</script>
