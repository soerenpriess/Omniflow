<template>
  <div
    class="relative flex h-full w-full flex-col items-center justify-start px-4 py-6 sm:justify-center sm:px-6 lg:flex-row lg:gap-6"
  >
    <div class="w-full max-w-2xl lg:max-w-sm">
      <div class="mb-4 text-center lg:text-left">
        <p class="text-muted-foreground text-center text-sm">
          A simple calculator supporting basic arithmetic operations, percentages, square roots, and
          exponents. Click buttons or use your keyboard for quick calculations.
        </p>
      </div>
      <Card class="route-transition-animation rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
            <Icon
              icon="fa6-solid:calculator"
              class="text-primary h-5 w-5 sm:h-6 sm:w-6"
            />Calculator</CardTitle
          >
        </CardHeader>
        <CardContent>
          <input
            ref="inputRef"
            v-model="display"
            @keydown="handleKeydown"
            type="text"
            class="mb-4 w-full rounded-lg bg-gray-100 p-4 text-right font-mono text-4xl text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <div class="grid grid-cols-4 gap-2">
            <Button
              v-for="btn in buttons"
              :key="btn.label"
              :variant="btn.variant || 'outline'"
              @click="handleInput(btn.label)"
              class="h-14 text-xl col-span-{{ btn.span || 1 }}"
            >
              {{ btn.label }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="mt-6 flex h-80 w-full max-w-2xl flex-col lg:mt-0 lg:h-2/3 lg:max-w-xs">
      <p class="ml-4 font-bold">History</p>
      <Separator class="mt-2 ml-4" />
      <ScrollArea class="ml-4 h-full w-full py-2">
        <div
          v-for="(entry, index) in history"
          :key="index"
          :ref="(el) => (historyEntriesRefs[index] = el as HTMLElement)"
          class="hover:text-primary cursor-pointer transition"
          @click="handleHistoryClick(entry)"
        >
          <Separator v-if="index > 0" class="my-2" />
          {{ decodeHistory(entry) }}
        </div>
      </ScrollArea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { animate } from 'animejs'
import { Icon } from '@iconify/vue'

const inputRef = ref<HTMLInputElement | null>(null)
const display = ref('')
const historyEntriesRefs = ref<HTMLElement[]>([])
const history = ref<string[]>([])

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  nextTick(() => {
    inputRef.value?.focus()
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

function handleGlobalKeydown(e: KeyboardEvent) {
  if (document.activeElement !== inputRef.value && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    inputRef.value?.focus()
    handleKeydown(e)
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      display.value += e.key
      e.preventDefault()
    }
  }
}

function addToHistory(result: string) {
  history.value.unshift(result)
}

function handleHistoryClick(entry: string) {
  const expression = entry.split(' = ').slice(1).join(' = ')
  display.value = decodeMath(expression)
  inputRef.value?.focus()
}

function decodeMath(expression: string): string {
  return expression
    .replace(/Math\.sqrt\(/g, '√(')
    .replace(/\*\*/g, '^')
    .replace(/\/100/g, '%')
}

function decodeHistory(entry: string): string {
  return entry
    .replace(/Math\.sqrt\(/g, '√(')
    .replace(/\*\*/g, '^')
    .replace(/\/100/g, '%')
}

const buttons = [
  { label: '(', variant: 'outline' as const },
  { label: ')', variant: 'outline' as const },
  { label: '√', variant: 'outline' as const },
  { label: 'C', variant: 'destructive' as const },
  { label: '7' },
  { label: '8' },
  { label: '9' },
  { label: '/', variant: 'outline' as const },
  { label: '4' },
  { label: '5' },
  { label: '6' },
  { label: '*', variant: 'outline' as const },
  { label: '1' },
  { label: '2' },
  { label: '3' },
  { label: '-', variant: 'outline' as const },
  { label: '0' },
  { label: '.', variant: 'outline' as const },
  { label: '^', variant: 'outline' as const },
  { label: '+', variant: 'outline' as const },
  { label: '+/-', variant: 'outline' as const },
  { label: '%', variant: 'outline' as const },
  { label: '=', span: 2, variant: 'default' as const },
]

const handleInput = (val: string) => {
  if (val === 'C') {
    display.value = ''
    return
  }

  if (val === '=') {
    calculate()
    return
  }

  if (val === '+/-') {
    toggleSign()
    return
  }

  if (val === '√') {
    display.value += '√('
    return
  }

  display.value += val
}

const toggleSign = () => {
  if (!display.value) return
  if (display.value.startsWith('-')) {
    display.value = display.value.slice(1)
  } else {
    display.value = '-' + display.value
  }
}

const calculate = () => {
  try {
    const expression = display.value
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/\^/g, '**')
      .replace(/%/g, '/100')
    const result = eval(expression)
    if (typeof result === 'number' && isFinite(result)) {
      const rounded = Math.round(result * 100) / 100
      display.value = rounded.toString()
      addToHistory(`${expression} = ${rounded}`)
    } else {
      display.value = 'Error'
      addToHistory('Error')
    }
  } catch (e) {
    display.value = 'Error'
    addToHistory('Error')
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  const allowed = '0123456789+-*/().%^√'
  if (e.key === 'Enter') {
    calculate()
    return
  }

  if (!allowed.includes(e.key) && !['Backspace', 'Delete'].includes(e.key)) {
    e.preventDefault()
  }
}

watch(
  history.value,
  (newVal, oldVal = []) => {
    if (!newVal && !oldVal) return
    if (newVal.length >= oldVal.length && newVal.length > 0) {
      nextTick(() => {
        animate(historyEntriesRefs.value[0], {
          opacity: [0, 1],
          translateY: [15, 0],
          duration: 300,
          easing: 'easeOutQuad',
        })
      })
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.history-container {
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
}

.history-container::-webkit-scrollbar {
  display: none;
}

.history-container::before,
.history-container::after {
  content: '';
  position: sticky;
  left: 0;
  right: 0;
  height: 2rem;
  display: block;
  background: linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 90%);
  z-index: 1;
}

.history-container::before {
  top: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 90%);
}

.history-container::after {
  bottom: 0;
}
</style>
