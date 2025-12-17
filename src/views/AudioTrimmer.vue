<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Trim and cut audio files directly in your browser. Upload an audio file, select the portion
      you want to keep, and download the result.
    </p>
    <Card class="route-transition-animation w-full max-w-6xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:content-cut" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Audio Trimmer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:upload" class="text-primary" />
              Upload Audio File
            </Label>
            <input
              type="file"
              accept="audio/*"
              @change="handleFileUpload"
              class="bg-background border-input ring-offset-background focus:ring-ring flex w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
            />
          </div>
          <div v-if="audioLoaded" class="space-y-4">
            <div class="bg-muted/30 rounded-lg border p-4">
              <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:waveform" class="text-primary" />
                Audio Player
              </Label>
              <audio
                ref="audioElement"
                class="hidden"
                @loadedmetadata="handleLoadedMetadata"
                @timeupdate="handleTimeUpdate"
                @ended="isPlaying = false"
              >
                <source :src="audioUrl" />
              </audio>
              <div class="flex items-center gap-2">
                <Button
                  @click="togglePlayPause"
                  size="icon"
                  class="h-7 w-7 shrink-0 rounded-full"
                  variant="default"
                >
                  <Icon :icon="isPlaying ? 'mdi:pause' : 'mdi:play'" class="h-5 w-5" />
                </Button>
                <div class="flex-1 space-y-1">
                  <div
                    class="bg-muted relative h-1.5 w-full cursor-pointer overflow-hidden rounded-full transition-all hover:h-2"
                    @click="handleProgressBarClick"
                    ref="progressBarElement"
                  >
                    <div
                      class="bg-primary h-full transition-all"
                      :style="{ width: `${playbackProgress}%` }"
                    ></div>
                  </div>
                  <div class="text-muted-foreground flex justify-between text-[10px]">
                    <span>{{ formatTime(currentTime) }}</span>
                    <span>{{ formatTime(duration) }}</span>
                  </div>
                </div>
                <div class="mb-4 flex shrink-0 items-center gap-1">
                  <Button
                    @click="toggleMute"
                    size="icon"
                    variant="ghost"
                    class="h-7 w-7 shrink-0 rounded-full"
                  >
                    <Icon :icon="isMuted ? 'mdi:volume-off' : 'mdi:volume-high'" class="h-5 w-5" />
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    v-model.number="volume"
                    @input="handleVolumeChange"
                    class="bg-muted accent-primary h-1.5 w-20 cursor-pointer appearance-none rounded-full"
                  />
                </div>
              </div>
            </div>
            <div class="bg-muted/30 rounded-lg border p-4">
              <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:chart-timeline-variant" class="text-primary" />
                Visual Trimmer
              </Label>
              <div class="relative">
                <canvas
                  ref="waveformCanvas"
                  class="border-primary/20 w-full cursor-crosshair rounded-md border-2"
                  height="50"
                  @mousedown="handleCanvasMouseDown"
                  @mousemove="handleCanvasMouseMove"
                  @mouseup="handleCanvasMouseUp"
                  @mouseleave="handleCanvasMouseUp"
                  @touchstart="handleCanvasTouchStart"
                  @touchmove="handleCanvasTouchMove"
                  @touchend="handleCanvasTouchEnd"
                  @touchcancel="handleCanvasTouchEnd"
                ></canvas>
                <div class="text-muted-foreground mt-1.5 flex justify-between text-[10px]">
                  <span>0:00</span>
                  <span>{{ formatTime(duration) }}</span>
                </div>
              </div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
                <Label for="startTime" class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:clock-start" class="text-primary" />
                  Start Time (seconds)
                </Label>
                <Input
                  id="startTime"
                  v-model.number="startTime"
                  type="number"
                  min="0"
                  :max="duration"
                  step="0.01"
                  class="bg-background font-medium"
                  @blur="startTime = Number(startTime.toFixed(2))"
                />
              </div>
              <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
                <Label for="endTime" class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:clock-end" class="text-primary" />
                  End Time (seconds)
                </Label>
                <Input
                  id="endTime"
                  v-model.number="endTime"
                  type="number"
                  :min="startTime"
                  :max="duration"
                  step="0.01"
                  class="bg-background font-medium"
                  @blur="endTime = Number(endTime.toFixed(2))"
                />
              </div>
            </div>
            <div
              class="border-primary/20 from-primary/5 to-primary/10 rounded-lg border-2 bg-gradient-to-br p-4"
            >
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p class="text-muted-foreground text-sm">Total Duration</p>
                  <p class="text-xl font-bold">{{ duration.toFixed(1) }}s</p>
                </div>
                <div>
                  <p class="text-muted-foreground text-sm">Trimmed Duration</p>
                  <p class="text-primary text-xl font-bold">{{ trimmedDuration.toFixed(1) }}s</p>
                </div>
                <div>
                  <p class="text-muted-foreground text-sm">Size</p>
                  <p class="text-xl font-bold">{{ fileSizeKB }} KB</p>
                </div>
              </div>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <Button @click="preview" class="h-12 text-lg font-semibold">
                <Icon icon="mdi:play" class="mr-2" />
                Preview Selection
              </Button>
              <Button @click="trim" variant="outline" class="h-12 text-lg font-semibold">
                <Icon icon="mdi:content-cut" class="mr-2" />
                Trim & Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const audioElement = ref<HTMLAudioElement | null>(null)
const waveformCanvas = ref<HTMLCanvasElement | null>(null)
const progressBarElement = ref<HTMLDivElement | null>(null)
const audioUrl = ref('')
const audioLoaded = ref(false)
const duration = ref(0)
const startTime = ref(0)
const endTime = ref(0)
const fileSize = ref(0)
const isDragging = ref(false)
const dragType = ref<'start' | 'end' | 'region' | null>(null)
const dragStartX = ref(0)
const dragStartValue = ref(0)
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const volume = ref(100)
let audioBlob: Blob | null = null
let audioContext: AudioContext | null = null
let audioBuffer: AudioBuffer | null = null

const trimmedDuration = computed(() => endTime.value - startTime.value)
const fileSizeKB = computed(() => Math.round(fileSize.value / 1024))
const playbackProgress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// Watch for changes to redraw canvas (debounced for input fields only)
let drawTimeout: number | null = null
watch([startTime, endTime], () => {
  if (!isDragging.value) {
    if (drawTimeout) clearTimeout(drawTimeout)
    drawTimeout = window.setTimeout(() => {
      drawWaveform()
    }, 50)
  }
})

// Watch currentTime to update playback indicator on waveform
watch(currentTime, () => {
  if (isPlaying.value) {
    drawWaveform()
  }
})

async function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  audioBlob = file
  fileSize.value = file.size
  audioUrl.value = URL.createObjectURL(file)
  audioLoaded.value = true

  // Load audio into Web Audio API for waveform visualization
  try {
    audioContext = new AudioContext()
    const arrayBuffer = await file.arrayBuffer()
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    // Draw waveform immediately after audio buffer is loaded
    setTimeout(() => {
      drawWaveform()
    }, 50)
  } catch (error) {
    console.error('Error loading audio:', error)
  }
}

function handleLoadedMetadata() {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
    endTime.value = Number(duration.value.toFixed(2))
    drawWaveform()
  }
}

function handleTimeUpdate() {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

function togglePlayPause() {
  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
    isPlaying.value = false
  } else {
    audioElement.value.play()
    isPlaying.value = true
  }
}

function toggleMute() {
  if (!audioElement.value) return

  audioElement.value.muted = !audioElement.value.muted
  isMuted.value = audioElement.value.muted
}

function handleVolumeChange() {
  if (!audioElement.value) return

  audioElement.value.volume = volume.value / 100
  if (volume.value === 0) {
    isMuted.value = true
  } else if (isMuted.value) {
    isMuted.value = false
    audioElement.value.muted = false
  }
}

function handleProgressBarClick(event: MouseEvent) {
  if (!audioElement.value || !progressBarElement.value) return

  const rect = progressBarElement.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const clickPosition = x / rect.width
  const newTime = clickPosition * duration.value

  audioElement.value.currentTime = newTime
  currentTime.value = newTime
}

function drawWaveform() {
  if (!waveformCanvas.value || !audioBuffer) return

  const canvas = waveformCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas size to match display size
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = 100

  const width = canvas.width
  const height = canvas.height
  const data = audioBuffer.getChannelData(0)
  const step = Math.ceil(data.length / width)
  const amp = height / 2

  // Clear canvas
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, width, height)

  // Draw waveform with optimized rendering
  ctx.fillStyle = '#60a5fa'
  ctx.beginPath()

  for (let i = 0; i < width; i += 2) {
    let min = 1.0
    let max = -1.0

    for (let j = 0; j < step; j++) {
      const index = i * step + j
      if (index < data.length) {
        const datum = data[index]
        if (datum < min) min = datum
        if (datum > max) max = datum
      }
    }

    const y1 = (1 + min) * amp
    const y2 = (1 + max) * amp
    ctx.fillRect(i, y1, 2, Math.max(1, y2 - y1))
  }

  // Draw selection overlay
  const startX = (startTime.value / duration.value) * width
  const endX = (endTime.value / duration.value) * width

  // Dimmed areas outside selection
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(0, 0, startX, height)
  ctx.fillRect(endX, 0, width - endX, height)

  // Draw selection boundaries
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(startX, 0)
  ctx.lineTo(startX, height)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(endX, 0)
  ctx.lineTo(endX, height)
  ctx.stroke()

  // Draw current playback position indicator
  if (isPlaying.value && currentTime.value > 0) {
    const playheadX = (currentTime.value / duration.value) * width

    // Draw playhead line with glow effect
    ctx.shadowBlur = 10
    ctx.shadowColor = '#ef4444'
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(playheadX, 0)
    ctx.lineTo(playheadX, height)
    ctx.stroke()

    // Reset shadow
    ctx.shadowBlur = 0

    // Draw playhead circle at top
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(playheadX, 10, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // Draw handles
  drawHandle(ctx, startX, height)
  drawHandle(ctx, endX, height)
}

function drawHandle(ctx: CanvasRenderingContext2D, x: number, height: number) {
  // Draw handle with glow effect
  ctx.shadowBlur = 8
  ctx.shadowColor = '#3b82f6'
  ctx.fillStyle = '#3b82f6'
  ctx.beginPath()
  ctx.arc(x, height / 2, 8, 0, Math.PI * 2)
  ctx.fill()

  // Inner white circle
  ctx.shadowBlur = 0
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(x, height / 2, 4, 0, Math.PI * 2)
  ctx.fill()
}

function handleCanvasMouseDown(event: MouseEvent) {
  if (!waveformCanvas.value) return

  const canvas = waveformCanvas.value
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const canvasWidth = rect.width

  const startX = (startTime.value / duration.value) * canvasWidth
  const endX = (endTime.value / duration.value) * canvasWidth

  // Check if clicking near start or end handles (within 15px)
  if (Math.abs(x - startX) < 15) {
    isDragging.value = true
    dragType.value = 'start'
    dragStartX.value = x
    dragStartValue.value = startTime.value
  } else if (Math.abs(x - endX) < 15) {
    isDragging.value = true
    dragType.value = 'end'
    dragStartX.value = x
    dragStartValue.value = endTime.value
  } else if (x > startX && x < endX) {
    // Clicking in the selection region - seek to that position
    const clickTime = (x / canvasWidth) * duration.value
    if (audioElement.value) {
      audioElement.value.currentTime = clickTime
      currentTime.value = clickTime
    }
  } else {
    // Clicking outside - seek to that position
    const clickTime = (x / canvasWidth) * duration.value
    if (audioElement.value) {
      audioElement.value.currentTime = clickTime
      currentTime.value = clickTime
    }
  }
}

function handleCanvasMouseMove(event: MouseEvent) {
  if (!isDragging.value || !waveformCanvas.value) return

  const canvas = waveformCanvas.value
  const rect = canvas.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  const clickTime = (x / rect.width) * duration.value

  if (dragType.value === 'start') {
    startTime.value = Number(Math.max(0, Math.min(clickTime, endTime.value - 0.1)).toFixed(2))
    drawWaveform()
  } else if (dragType.value === 'end') {
    endTime.value = Number(
      Math.max(startTime.value + 0.1, Math.min(clickTime, duration.value)).toFixed(2),
    )
    drawWaveform()
  } else if (dragType.value === 'region') {
    const regionDuration = endTime.value - startTime.value
    const delta = x - dragStartX.value
    const timeDelta = (delta / rect.width) * duration.value

    let newStart = (dragStartValue.value / rect.width) * duration.value + timeDelta
    newStart = Math.max(0, Math.min(newStart, duration.value - regionDuration))

    startTime.value = Number(newStart.toFixed(2))
    endTime.value = Number((newStart + regionDuration).toFixed(2))
    drawWaveform()
  }
}

function handleCanvasMouseUp() {
  isDragging.value = false
  dragType.value = null
}

function handleCanvasTouchStart(event: TouchEvent) {
  event.preventDefault()
  if (!waveformCanvas.value || event.touches.length === 0) return

  const canvas = waveformCanvas.value
  const rect = canvas.getBoundingClientRect()
  const touch = event.touches[0]
  const x = touch.clientX - rect.left
  const canvasWidth = rect.width

  const startX = (startTime.value / duration.value) * canvasWidth
  const endX = (endTime.value / duration.value) * canvasWidth

  // Check if touching near start or end handles (within 20px for better touch target)
  if (Math.abs(x - startX) < 20) {
    isDragging.value = true
    dragType.value = 'start'
    dragStartX.value = x
    dragStartValue.value = startTime.value
  } else if (Math.abs(x - endX) < 20) {
    isDragging.value = true
    dragType.value = 'end'
    dragStartX.value = x
    dragStartValue.value = endTime.value
  } else if (x > startX && x < endX) {
    // Touching in the selection region - seek to that position
    const clickTime = (x / canvasWidth) * duration.value
    if (audioElement.value) {
      audioElement.value.currentTime = clickTime
      currentTime.value = clickTime
    }
  } else {
    // Touching outside - seek to that position
    const clickTime = (x / canvasWidth) * duration.value
    if (audioElement.value) {
      audioElement.value.currentTime = clickTime
      currentTime.value = clickTime
    }
  }
}

function handleCanvasTouchMove(event: TouchEvent) {
  event.preventDefault()
  if (!isDragging.value || !waveformCanvas.value || event.touches.length === 0) return

  const canvas = waveformCanvas.value
  const rect = canvas.getBoundingClientRect()
  const touch = event.touches[0]
  const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width))
  const clickTime = (x / rect.width) * duration.value

  if (dragType.value === 'start') {
    startTime.value = Number(Math.max(0, Math.min(clickTime, endTime.value - 0.1)).toFixed(2))
    drawWaveform()
  } else if (dragType.value === 'end') {
    endTime.value = Number(
      Math.max(startTime.value + 0.1, Math.min(clickTime, duration.value)).toFixed(2),
    )
    drawWaveform()
  } else if (dragType.value === 'region') {
    const regionDuration = endTime.value - startTime.value
    const delta = x - dragStartX.value
    const timeDelta = (delta / rect.width) * duration.value

    let newStart = (dragStartValue.value / rect.width) * duration.value + timeDelta
    newStart = Math.max(0, Math.min(newStart, duration.value - regionDuration))

    startTime.value = Number(newStart.toFixed(2))
    endTime.value = Number((newStart + regionDuration).toFixed(2))
    drawWaveform()
  }
}

function handleCanvasTouchEnd(event: TouchEvent) {
  event.preventDefault()
  isDragging.value = false
  dragType.value = null
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function preview() {
  if (!audioElement.value) return
  audioElement.value.currentTime = startTime.value
  audioElement.value.play()
  isPlaying.value = true

  setTimeout(() => {
    audioElement.value?.pause()
    isPlaying.value = false
  }, trimmedDuration.value * 1000)
}

async function trim() {
  if (!audioBuffer || !audioContext) {
    return
  }

  try {
    // Calculate sample positions
    const sampleRate = audioBuffer.sampleRate
    const startSample = Math.floor(startTime.value * sampleRate)
    const endSample = Math.floor(endTime.value * sampleRate)
    const trimmedLength = endSample - startSample

    // Create new buffer with trimmed audio
    const trimmedBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      trimmedLength,
      sampleRate,
    )

    // Copy trimmed data to new buffer
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const originalData = audioBuffer.getChannelData(channel)
      const trimmedData = trimmedBuffer.getChannelData(channel)
      for (let i = 0; i < trimmedLength; i++) {
        trimmedData[i] = originalData[startSample + i]
      }
    }

    // Convert to WAV
    const wav = audioBufferToWav(trimmedBuffer)
    const blob = new Blob([wav], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)

    // Download
    const a = document.createElement('a')
    a.href = url
    a.download = `trimmed_audio_${startTime.value}-${endTime.value}.wav`
    a.click()

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100)
  } catch (error) {
    console.error('Error trimming audio:', error)
  }
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length * buffer.numberOfChannels * 2 + 44
  const arrayBuffer = new ArrayBuffer(length)
  const view = new DataView(arrayBuffer)
  const channels: Float32Array[] = []
  let offset = 0
  let pos = 0

  // Write WAV header
  const setUint16 = (data: number) => {
    view.setUint16(pos, data, true)
    pos += 2
  }
  const setUint32 = (data: number) => {
    view.setUint32(pos, data, true)
    pos += 4
  }

  // RIFF identifier
  setUint32(0x46464952)
  // file length minus RIFF identifier length and file description length
  setUint32(length - 8)
  // RIFF type
  setUint32(0x45564157)
  // format chunk identifier
  setUint32(0x20746d66)
  // format chunk length
  setUint32(16)
  // sample format (raw)
  setUint16(1)
  // channel count
  setUint16(buffer.numberOfChannels)
  // sample rate
  setUint32(buffer.sampleRate)
  // byte rate (sample rate * block align)
  setUint32(buffer.sampleRate * buffer.numberOfChannels * 2)
  // block align (channel count * bytes per sample)
  setUint16(buffer.numberOfChannels * 2)
  // bits per sample
  setUint16(16)
  // data chunk identifier
  setUint32(0x61746164)
  // data chunk length
  setUint32(length - pos - 4)

  // Write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i))
  }

  while (pos < length) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]))
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
      view.setInt16(pos, sample, true)
      pos += 2
    }
    offset++
  }

  return arrayBuffer
}
</script>
