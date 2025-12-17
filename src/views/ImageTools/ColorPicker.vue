<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Pick colors and copy them in HEX, RGB, or HSL format.
    </p>
    <Card class="route-transition-animation mt-12 w-full max-w-sm rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <Icon icon="mdi:eyedropper-variant" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Color Picker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Color value -->
        <div
          class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-3 transition-colors"
        >
          <Label class="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Icon icon="mdi:palette" class="h-4 w-4" />
            Selected Color
          </Label>
          <div class="flex items-start gap-4">
            <input
              type="color"
              v-model="color"
              class="h-16 w-16 cursor-pointer rounded-lg shadow"
              aria-label="Select color"
            />
            <div class="flex-1 space-y-1 font-mono text-xs">
              <div class="flex items-center gap-2">
                <Icon icon="mdi:pound" class="h-3 w-3" />
                <span>HEX: {{ color }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon icon="mdi:palette-outline" class="h-3 w-3" />
                <span>RGB: {{ rgb }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon icon="mdi:invert-colors" class="h-3 w-3" />
                <span>HSL: {{ hsl }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Format Selection -->
        <div class="mb-4">
          <Label class="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Icon icon="mdi:format-text" class="h-4 w-4" />
            Copy Format
          </Label>
          <Select v-model="format">
            <SelectTrigger class="w-full cursor-pointer">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hex">HEX</SelectItem>
              <SelectItem value="rgb">RGB</SelectItem>
              <SelectItem value="hsl">HSL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Copy single format -->
        <Button class="h-9 w-full" @click="copySelected" :disabled="copied">
          <Icon v-if="copied" icon="mdi:check" class="mr-2 h-4 w-4" />
          <Icon v-else icon="mdi:content-copy" class="mr-2 h-4 w-4" />
          {{ copied ? format.toUpperCase() + ' Copied!' : 'Copy ' + format.toUpperCase() }}
        </Button>

        <!-- Preview box -->
        <div class="border-muted-foreground/20 mt-4 rounded-lg border p-3">
          <Label class="mb-2 flex items-center gap-2 text-xs font-semibold">
            <Icon icon="mdi:eye" class="h-3 w-3" />
            Preview
          </Label>
          <div
            class="flex h-16 w-full items-center justify-center rounded-lg border-2 text-center font-semibold shadow-sm"
            :style="{ background: color, color: textColor }"
          >
            Sample Text
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const color = ref('#3498db')
const format = ref<'hex' | 'rgb' | 'hsl'>('hex')

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const rgb = computed(() => {
  const hex = color.value.replace('#', '')
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r}, ${g}, ${b}`
})

const hsl = computed(() => {
  const hex = color.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
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

  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
})

const textColor = computed(() => {
  const hex = color.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000' : '#fff'
})

function copy(value: string) {
  navigator.clipboard.writeText(value)
  copied.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    copied.value = false
    timer = null
  }, 500)
}

function copySelected() {
  if (format.value === 'hex') copy(color.value)
  else if (format.value === 'rgb') copy(rgb.value)
  else if (format.value === 'hsl') copy(hsl.value)
}
</script>
