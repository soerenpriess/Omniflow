<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Create a customizable spinning wheel for random selection with options to remove winners
    </p>
    <Card class="route-transition-animation w-full max-w-lg rounded-2xl p-6 shadow-lg lg:max-w-4xl">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:wheel" class="text-primary h-7 w-7" />
          Spinning Wheel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="relative mt-8 flex flex-col lg:flex-row lg:gap-8">
          <!-- left section: wheel-->
          <div class="relative flex items-center justify-center lg:w-1/2" style="height: 340px">
            <div
              class="absolute top-0 left-1/2 z-20 -translate-x-1/2"
              style="
                width: 0;
                height: 0;
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-top: 30px solid #ef4444;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
              "
              aria-label="Result marker"
            ></div>
            <!-- Winner Display Overlay -->
            <div
              v-if="winner && !spinning"
              class="absolute inset-0 z-30 flex items-center justify-center"
            >
              <div
                class="animate-fade-in border-primary bg-background/95 flex flex-col items-center gap-3 rounded-2xl border-4 p-6 shadow-2xl backdrop-blur-sm"
              >
                <Icon icon="mdi:party-popper" class="text-primary h-12 w-12" />
                <div class="text-center">
                  <p class="text-muted-foreground mb-1 text-sm font-medium">Winner</p>
                  <p class="text-2xl font-bold">
                    {{ winner.label }}
                  </p>
                </div>
              </div>
            </div>
            <div
              ref="wheelWrapper"
              :style="{
                width: `${wheelSize}px`,
                height: `${wheelSize}px`,
                transform: `rotate(${currentRotation}deg)`,
              }"
              class="will-change-transform"
            >
              <canvas
                ref="wheelCanvas"
                :width="wheelSize"
                :height="wheelSize"
                class="rounded-full shadow-lg"
                aria-label="Spinning wheel"
              />
            </div>
          </div>
          <!-- right section: settings -->
          <div class="mt-8 lg:mt-0 lg:w-1/2">
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-colors"
            >
              <Label class="mb-2 flex items-center gap-2 font-medium">
                <Icon icon="mdi:format-list-bulleted" class="text-primary h-4 w-4" />
                Fields (one per line)
              </Label>
              <textarea v-model="fieldsInput" rows="5" class="mt-2 w-full rounded border p-2" />
            </div>
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-colors"
            >
              <div
                class="mb-3 flex cursor-pointer items-center gap-2"
                @click="removeOnWin = !removeOnWin"
              >
                <div
                  class="border-primary flex h-5 w-5 items-center justify-center rounded border-2 transition-colors"
                  :class="removeOnWin ? 'bg-primary' : 'bg-transparent'"
                >
                  <Icon
                    v-if="removeOnWin"
                    icon="mdi:check"
                    class="text-primary-foreground h-4 w-4"
                  />
                </div>
                <Label class="flex cursor-pointer items-center gap-2">
                  <Icon icon="mdi:delete" class="text-primary h-4 w-4" />
                  Remove winning field
                </Label>
              </div>
              <div class="flex items-center gap-2">
                <Label for="spinDuration" class="flex items-center gap-2">
                  <Icon icon="mdi:timer" class="text-primary h-4 w-4" />
                  Spin duration (seconds):
                </Label>
                <Input
                  id="spinDuration"
                  v-model.number="spinDuration"
                  type="number"
                  min="1"
                  max="10"
                  class="w-16"
                />
              </div>
            </div>
            <Button
              @click="spin"
              class="flex h-12 w-full items-center justify-center gap-2 text-xl"
              :disabled="spinning || isRemoving || fields.length === 0"
            >
              <Icon icon="mdi:rotate-right" class="h-6 w-6" />
              Spin
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const wheelSize = 320
const spinDuration = ref(3)
const removeOnWin = ref(false)
const spinning = ref(false)
const isRemoving = ref(false)
const winner = ref<{ label: string } | null>(null)
const winnerIndex = ref<number | null>(null)
const fieldsInput = ref('Pizza 🍕\nSushi 🍣\nBurger 🍔\nSalad 🥗')
const wheelCanvas = ref<HTMLCanvasElement | null>(null)
const wheelWrapper = ref<HTMLDivElement | null>(null)
const currentRotation = ref(0)

const fields = ref<{ label: string }[]>([])

// Parse input fields
watch(fieldsInput, parseFields, { immediate: true })
function parseFields() {
  fields.value = fieldsInput.value
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => ({ label: line.trim() }))
  drawWheel()
}

// Draw the wheel on canvas
function drawWheel() {
  nextTick(() => {
    const canvas = wheelCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const count = fields.value.length
    ctx.clearRect(0, 0, wheelSize, wheelSize)
    if (count === 0) return

    const angleStep = (2 * Math.PI) / count
    // Offset to start at top (12 o'clock) instead of right (3 o'clock)
    const startAngle = -Math.PI / 2

    fields.value.forEach((field, i) => {
      // Draw slice - starting from top (12 o'clock)
      const angle1 = startAngle + i * angleStep
      const angle2 = startAngle + (i + 1) * angleStep

      ctx.beginPath()
      ctx.moveTo(wheelSize / 2, wheelSize / 2)
      ctx.arc(wheelSize / 2, wheelSize / 2, wheelSize / 2, angle1, angle2)
      ctx.closePath()

      // Color the slice
      ctx.fillStyle = `hsl(${(i * 360) / count}, 80%, 70%)`
      ctx.fill()

      // Add border
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(wheelSize / 2, wheelSize / 2)
      ctx.rotate(startAngle + i * angleStep + angleStep / 2)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillStyle = '#000'
      ctx.fillText(field.label, wheelSize / 2 - 20, 0)
      ctx.restore()
    })
  })
}

// Spin the wheel
async function spin() {
  if (spinning.value || fields.value.length === 0) return

  spinning.value = true
  winner.value = null
  winnerIndex.value = null

  const count = fields.value.length
  const degreesPerField = 360 / count

  // Calculate target rotation: just spin multiple times with random stop
  const minSpins = 5
  const randomAngle = Math.random() * 360
  const targetRotation = currentRotation.value + minSpins * 360 + randomAngle

  // Animate
  const startRotation = currentRotation.value
  const startTime = Date.now()
  const duration = spinDuration.value * 1000

  function animate() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (easeOutCubic)
    const eased = 1 - Math.pow(1 - progress, 3)

    currentRotation.value = startRotation + (targetRotation - startRotation) * eased

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // Animation complete - NOW calculate which field is under the pointer
      const finalRotation = targetRotation % 360
      currentRotation.value = finalRotation

      // Normalize rotation to positive
      const normalizedRotation = ((finalRotation % 360) + 360) % 360

      const angleAtTop = (360 - normalizedRotation) % 360
      let winningIndex = Math.floor(angleAtTop / degreesPerField) % count

      // Ensure the index is valid
      if (winningIndex < 0) winningIndex = 0
      if (winningIndex >= fields.value.length) winningIndex = fields.value.length - 1

      winner.value = fields.value[winningIndex]
      winnerIndex.value = winningIndex
      spinning.value = false

      // Remove winning field if option is enabled (but keep at least 1 field)
      if (removeOnWin.value === true && fields.value.length > 1) {
        isRemoving.value = true
        setTimeout(() => {
          winner.value = null
          winnerIndex.value = null
          fields.value.splice(winningIndex, 1)
          fieldsInput.value = fields.value.map((f) => f.label).join('\n')
          drawWheel()
          isRemoving.value = false
        }, 2000)
      }
    }
  }

  animate()
}

onMounted(() => drawWheel())
watch(fields, () => drawWheel())
</script>
