<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Check color contrast ratios for accessibility compliance (WCAG 2.1).
    </p>
    <Card class="route-transition-animation mt-12 w-full max-w-sm rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <Icon icon="mdi:contrast-circle" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Contrast Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Color selection -->
        <div
          class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-3 transition-colors"
        >
          <Label class="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Icon icon="mdi:palette" class="h-4 w-4" />
            Color Selection
          </Label>
          <div class="flex w-full items-center justify-center gap-4">
            <div class="text-center">
              <input
                type="color"
                v-model="color1"
                class="mb-1 h-14 w-14 cursor-pointer rounded-lg shadow"
                aria-label="Text color"
              />
              <div class="text-muted-foreground text-xs">Text</div>
            </div>
            <Icon icon="mdi:arrow-left-right" class="text-muted-foreground h-5 w-5" />
            <div class="text-center">
              <input
                type="color"
                v-model="color2"
                class="mb-1 h-14 w-14 cursor-pointer rounded-lg shadow"
                aria-label="Background color"
              />
              <div class="text-muted-foreground text-xs">Background</div>
            </div>
          </div>
        </div>

        <!-- Text style selection -->
        <div class="mb-3">
          <Label class="mb-1 block text-xs font-medium">Text style</Label>
          <Select v-model="sampleTextType">
            <SelectTrigger class="w-full py-1 text-xs">
              <SelectValue placeholder="Select text style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Preview -->
        <div class="border-muted-foreground/20 mb-3 rounded-lg border p-3">
          <Label class="mb-2 flex items-center gap-2 text-xs font-semibold">
            <Icon icon="mdi:eye" class="h-3 w-3" />
            Preview
          </Label>
          <div
            class="flex h-16 w-full items-center justify-center rounded-lg border-2 shadow-sm"
            :style="{
              background: color2,
              color: color1,
              fontWeight: sampleTextType === 'bold' ? 'bold' : 'normal',
              fontSize: sampleTextType === 'large' ? '1.5rem' : '1rem',
            }"
          >
            <span class="font-bold">Sample Text</span>
          </div>
        </div>

        <!-- Contrast ratio -->
        <div
          class="border-muted-foreground/20 from-primary/10 to-primary/5 mb-3 rounded-lg border bg-gradient-to-br p-3"
        >
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold">Contrast Ratio:</span>
            <span
              class="text-lg font-bold"
              :class="ratio >= 4.5 ? 'text-green-600' : 'text-red-600'"
            >
              {{ ratio.toFixed(2) }}:1
            </span>
          </div>

          <div class="mb-2 flex items-center gap-2 text-sm">
            <Icon
              :icon="ratio >= 4.5 ? 'mdi:check-circle' : 'mdi:alert-circle'"
              :class="ratio >= 4.5 ? 'text-green-600' : 'text-red-600'"
              class="h-4 w-4"
            />
            <span v-if="ratio >= 7" class="font-medium text-green-600"
              >AAA - Excellent for all text</span
            >
            <span v-else-if="ratio >= 4.5" class="font-medium text-green-600"
              >AA - Good for normal text</span
            >
            <span v-else-if="ratio >= 3" class="font-medium text-orange-600"
              >A - Large/bold text only</span
            >
            <span v-else class="font-medium text-red-600">Fails accessibility</span>
          </div>

          <div class="text-muted-foreground flex items-center gap-2 font-mono text-xs">
            <span>{{ color1.toUpperCase() }}</span>
            <Icon icon="mdi:arrow-right" class="h-3 w-3" />
            <span>{{ color2.toUpperCase() }}</span>
          </div>
        </div>

        <Button class="h-9 w-full" variant="outline" @click="swapColors">
          <Icon icon="mdi:swap-horizontal" class="mr-2 h-4 w-4" />
          Swap Colors
        </Button>
      </CardContent>
    </Card>

    <!-- info cards -->
    <Card class="w-full max-w-sm rounded-2xl shadow-md">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-base font-semibold">
          <Icon icon="mdi:information" class="h-4 w-4" />
          About Contrast Ratios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="mb-2 list-disc space-y-1 pl-5 text-xs sm:text-sm">
          <li>
            <b>Contrast ratio</b> measures the difference in luminance between text and background.
          </li>
          <li>
            <b>WCAG 2.1</b> recommends:
            <ul class="list-disc pl-5">
              <li>AA: <b>4.5:1</b> for normal text (≥18px bold or 24px normal: <b>3:1</b>)</li>
              <li>AAA: <b>7:1</b> for normal text (≥18px bold or 24px normal: <b>4.5:1</b>)</li>
            </ul>
          </li>
          <li>Higher ratio = easier to read for users with low vision or color blindness.</li>
        </ul>
        <div class="text-xs text-gray-700">
          <b>Tip:</b> Try your design in greyscale to check for color blindness compatibility.
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

const color1 = ref('#000000')
const color2 = ref('#ffffff')
const sampleTextType = ref<'normal' | 'bold' | 'large'>('normal')

function luminance(hex: string) {
  let rgb = hex.replace('#', '')
  if (rgb.length === 3)
    rgb = rgb
      .split('')
      .map((x) => x + x)
      .join('')
  const r = parseInt(rgb.slice(0, 2), 16) / 255
  const g = parseInt(rgb.slice(2, 4), 16) / 255
  const b = parseInt(rgb.slice(4, 6), 16) / 255
  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

const ratio = computed(() => {
  const l1 = luminance(color1.value)
  const l2 = luminance(color2.value)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
})

function swapColors() {
  const tmp = color1.value
  color1.value = color2.value
  color2.value = tmp
}
</script>
