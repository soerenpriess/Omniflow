<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Compare two texts and visualize the differences line by line or word by word. Easily spot
      changes, additions, and deletions with color-coded highlighting.
    </p>
    <Card class="route-transition-animation mt-16 w-full max-w-6xl rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:ab-testing" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Text Diff Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Input Section -->
        <div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <!-- Original Text -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="originalText" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:file-document-outline" />
              Original Text
            </Label>
            <Textarea
              id="originalText"
              v-model="originalText"
              rows="10"
              placeholder="Enter or paste the original text here..."
              class="custom-scroll mt-2 w-full resize-none rounded-lg border p-3 text-base"
              style="max-height: 300px; overflow-y: auto"
            />
            <div class="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
              <Icon icon="mdi:text" class="h-4 w-4" />
              Lines: {{ originalLines.length }} | Characters: {{ originalText.length }}
            </div>
          </div>

          <!-- Modified Text -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="modifiedText" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:file-document-edit-outline" />
              Modified Text
            </Label>
            <Textarea
              id="modifiedText"
              v-model="modifiedText"
              rows="10"
              placeholder="Enter or paste the modified text here..."
              class="custom-scroll mt-2 w-full resize-none rounded-lg border p-3 text-base"
              style="max-height: 300px; overflow-y: auto"
            />
            <div class="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
              <Icon icon="mdi:text" class="h-4 w-4" />
              Lines: {{ modifiedLines.length }} | Characters: {{ modifiedText.length }}
            </div>
          </div>
        </div>

        <!-- Diff Mode Toggle -->
        <div class="bg-muted/30 mb-4 rounded-lg border p-4">
          <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:target" />
            Comparison Mode
          </Label>
          <div class="flex gap-2">
            <Button
              @click="diffMode = 'line'"
              :variant="diffMode === 'line' ? 'default' : 'outline'"
              size="sm"
              class="flex items-center gap-2"
            >
              <Icon icon="mdi:format-line-spacing" class="h-4 w-4" />
              Line-by-Line
            </Button>
            <Button
              @click="diffMode = 'word'"
              :variant="diffMode === 'word' ? 'default' : 'outline'"
              size="sm"
              class="flex items-center gap-2"
            >
              <Icon icon="mdi:format-letter-spacing" class="h-4 w-4" />
              Word-by-Word
            </Button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mb-6 flex flex-wrap gap-3">
          <Button @click="compareTexts" class="h-12 text-base font-semibold">
            <Icon icon="mdi:compare" class="mr-2" />
            Compare Texts
          </Button>
          <Button @click="clearAll" variant="outline" class="h-12">
            <Icon icon="mdi:close-circle-outline" class="mr-2" />
            Clear All
          </Button>
          <Button @click="swapTexts" variant="outline" class="h-12">
            <Icon icon="mdi:swap-horizontal" class="mr-2" />
            Swap Texts
          </Button>
        </div>

        <!-- Statistics -->
        <div
          v-if="hasCompared"
          class="from-primary/5 to-primary/10 mb-6 rounded-lg border bg-gradient-to-br p-6"
        >
          <div class="mb-4 flex items-center gap-2">
            <Icon icon="mdi:chart-box-outline" class="text-primary" />
            <h3 class="text-lg font-semibold">Comparison Statistics</h3>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <div class="mb-2 flex items-center gap-2">
                <Icon icon="mdi:plus-circle" class="text-green-600 dark:text-green-400" />
              </div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ stats.additions }}
              </div>
              <div class="text-sm text-green-700 dark:text-green-300">Additions</div>
            </div>
            <div class="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <div class="mb-2 flex items-center gap-2">
                <Icon icon="mdi:minus-circle" class="text-red-600 dark:text-red-400" />
              </div>
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                {{ stats.deletions }}
              </div>
              <div class="text-sm text-red-700 dark:text-red-300">Deletions</div>
            </div>
            <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <div class="mb-2 flex items-center gap-2">
                <Icon icon="mdi:swap-horizontal" class="text-blue-600 dark:text-blue-400" />
              </div>
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ stats.changes }}
              </div>
              <div class="text-sm text-blue-700 dark:text-blue-300">Changes</div>
            </div>
          </div>
        </div>

        <!-- Diff View -->
        <div v-if="hasCompared" class="mb-4">
          <div class="mb-3 flex items-center justify-between">
            <Label class="flex items-center gap-2 text-base font-medium">
              <Icon icon="mdi:file-document-multiple-outline" />
              Diff Result
            </Label>
            <div class="flex gap-2">
              <Button
                @click="viewMode = 'unified'"
                :variant="viewMode === 'unified' ? 'default' : 'outline'"
                size="sm"
              >
                <Icon icon="mdi:view-agenda" class="mr-2 h-4 w-4" />
                Unified
              </Button>
              <Button
                @click="viewMode = 'split'"
                :variant="viewMode === 'split' ? 'default' : 'outline'"
                size="sm"
              >
                <Icon icon="mdi:view-split-vertical" class="mr-2 h-4 w-4" />
                Split
              </Button>
            </div>
          </div>

          <!-- Unified View -->
          <div
            v-if="viewMode === 'unified'"
            class="custom-scroll overflow-auto rounded-lg border bg-gray-50 dark:bg-gray-900"
            style="max-height: 400px"
          >
            <div class="font-mono text-sm">
              <div
                v-for="(line, index) in diffLines"
                :key="index"
                :class="getDiffLineClass(line.type)"
                class="flex border-b px-3 py-1 dark:border-gray-700"
              >
                <span class="mr-4 w-12 text-right text-gray-400 select-none">{{
                  line.lineNumber
                }}</span>
                <span class="mr-2 font-bold select-none">{{ line.prefix }}</span>
                <span
                  v-if="diffMode === 'word' && line.wordDiffs"
                  class="flex-1 break-all whitespace-pre-wrap"
                >
                  <template v-for="(part, i) in line.wordDiffs" :key="i">
                    <span
                      v-if="part.type === 'added'"
                      class="bg-green-200 font-semibold dark:bg-green-800"
                      >{{ part.value }}</span
                    >
                    <span
                      v-else-if="part.type === 'removed'"
                      class="bg-red-200 font-semibold dark:bg-red-800"
                      >{{ part.value }}</span
                    >
                    <span v-else>{{ part.value }}</span>
                  </template>
                </span>
                <span v-else class="flex-1 break-all whitespace-pre-wrap">{{ line.content }}</span>
              </div>
            </div>
          </div>

          <!-- Split View -->
          <div v-if="viewMode === 'split'" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <!-- Original (Left) -->
            <div
              class="custom-scroll overflow-auto rounded-lg border bg-gray-50 dark:bg-gray-900"
              style="max-height: 400px"
            >
              <div class="border-b bg-red-100 px-3 py-2 font-semibold dark:bg-red-950">
                <Icon icon="mdi:file-document-outline" class="mr-2 inline h-5 w-5" />
                Original
              </div>
              <div class="font-mono text-sm">
                <div
                  v-for="(line, index) in splitViewOriginal"
                  :key="index"
                  :class="line.type === 'deleted' ? 'bg-red-50 dark:bg-red-950/50' : ''"
                  class="flex border-b px-3 py-1 dark:border-gray-700"
                >
                  <span class="mr-4 w-12 text-right text-gray-400 select-none">{{
                    line.lineNumber
                  }}</span>
                  <span
                    v-if="line.type === 'deleted'"
                    class="mr-2 font-bold text-red-600 select-none"
                    >-</span
                  >
                  <span v-else class="mr-2 text-gray-400 select-none"> </span>
                  <span
                    v-if="diffMode === 'word' && line.wordDiffs"
                    class="flex-1 break-all whitespace-pre-wrap"
                  >
                    <template v-for="(part, i) in line.wordDiffs" :key="i">
                      <span
                        v-if="part.type === 'removed'"
                        class="bg-red-200 font-semibold dark:bg-red-800"
                        >{{ part.value }}</span
                      >
                      <span v-else>{{ part.value }}</span>
                    </template>
                  </span>
                  <span v-else class="flex-1 break-all whitespace-pre-wrap">{{
                    line.content
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Modified (Right) -->
            <div
              class="custom-scroll overflow-auto rounded-lg border bg-gray-50 dark:bg-gray-900"
              style="max-height: 400px"
            >
              <div class="border-b bg-green-100 px-3 py-2 font-semibold dark:bg-green-950">
                <Icon icon="mdi:file-document-edit-outline" class="mr-2 inline h-5 w-5" />
                Modified
              </div>
              <div class="font-mono text-sm">
                <div
                  v-for="(line, index) in splitViewModified"
                  :key="index"
                  :class="line.type === 'added' ? 'bg-green-50 dark:bg-green-950/50' : ''"
                  class="flex border-b px-3 py-1 dark:border-gray-700"
                >
                  <span class="mr-4 w-12 text-right text-gray-400 select-none">{{
                    line.lineNumber
                  }}</span>
                  <span
                    v-if="line.type === 'added'"
                    class="mr-2 font-bold text-green-600 select-none"
                    >+</span
                  >
                  <span v-else class="mr-2 text-gray-400 select-none"> </span>
                  <span
                    v-if="diffMode === 'word' && line.wordDiffs"
                    class="flex-1 break-all whitespace-pre-wrap"
                  >
                    <template v-for="(part, i) in line.wordDiffs" :key="i">
                      <span
                        v-if="part.type === 'added'"
                        class="bg-green-200 font-semibold dark:bg-green-800"
                        >{{ part.value }}</span
                      >
                      <span v-else>{{ part.value }}</span>
                    </template>
                  </span>
                  <span v-else class="flex-1 break-all whitespace-pre-wrap">{{
                    line.content
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!hasCompared"
          class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center"
        >
          <Icon icon="mdi:file-compare" class="mb-4 h-16 w-16 text-gray-300" />
          <p class="mb-2 text-lg font-semibold">Compare Two Texts</p>
          <p class="text-muted-foreground">
            Enter two texts above and click "Compare Texts" to see the differences
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const originalText = ref('')
const modifiedText = ref('')
const hasCompared = ref(false)
const viewMode = ref<'unified' | 'split'>('unified')
const diffMode = ref<'line' | 'word'>('word')

watch(diffMode, () => {
  if (hasCompared.value) {
    compareTexts()
  }
})

interface WordDiff {
  type: 'added' | 'removed' | 'unchanged'
  value: string
}

interface DiffLine {
  type: 'added' | 'deleted' | 'unchanged'
  content: string
  lineNumber: string
  prefix: string
  wordDiffs?: WordDiff[]
}

const diffLines = ref<DiffLine[]>([])
const splitViewOriginal = ref<
  { type: string; content: string; lineNumber: string; wordDiffs?: WordDiff[] }[]
>([])
const splitViewModified = ref<
  { type: string; content: string; lineNumber: string; wordDiffs?: WordDiff[] }[]
>([])

const stats = ref({
  additions: 0,
  deletions: 0,
  changes: 0,
  unchanged: 0,
})

const originalLines = computed(() => originalText.value.split('\n'))
const modifiedLines = computed(() => modifiedText.value.split('\n'))

function compareTexts() {
  if (!originalText.value && !modifiedText.value) return

  const original = originalLines.value
  const modified = modifiedLines.value

  // Simple line-by-line diff algorithm
  const diff = simpleDiff(original, modified)
  diffLines.value = diff.unified
  splitViewOriginal.value = diff.original
  splitViewModified.value = diff.modified

  // Calculate statistics
  stats.value = {
    additions: diff.unified.filter((l) => l.type === 'added').length,
    deletions: diff.unified.filter((l) => l.type === 'deleted').length,
    changes: diff.unified.filter((l) => l.type === 'added' || l.type === 'deleted').length,
    unchanged: diff.unified.filter((l) => l.type === 'unchanged').length,
  }

  hasCompared.value = true
}

function getWordDiff(str1: string, str2: string): WordDiff[] {
  const words1 = str1.split(/(\s+)/)
  const words2 = str2.split(/(\s+)/)
  const result: WordDiff[] = []

  const maxLen = Math.max(words1.length, words2.length)
  let i = 0
  let j = 0

  while (i < words1.length || j < words2.length) {
    if (i >= words1.length) {
      // Only words in str2 remain (additions)
      result.push({ type: 'added', value: words2[j] })
      j++
    } else if (j >= words2.length) {
      // Only words in str1 remain (deletions)
      result.push({ type: 'removed', value: words1[i] })
      i++
    } else if (words1[i] === words2[j]) {
      // Words match
      result.push({ type: 'unchanged', value: words1[i] })
      i++
      j++
    } else {
      // Words differ - look ahead to see if we can find a match
      let foundMatch = false

      // Check if word1[i] appears later in words2
      for (let k = j + 1; k < Math.min(j + 5, words2.length); k++) {
        if (words1[i] === words2[k]) {
          // Found it - mark words2[j...k-1] as added
          for (let m = j; m < k; m++) {
            result.push({ type: 'added', value: words2[m] })
          }
          result.push({ type: 'unchanged', value: words1[i] })
          i++
          j = k + 1
          foundMatch = true
          break
        }
      }

      if (!foundMatch) {
        // Check if word2[j] appears later in words1
        for (let k = i + 1; k < Math.min(i + 5, words1.length); k++) {
          if (words2[j] === words1[k]) {
            // Found it - mark words1[i...k-1] as removed
            for (let m = i; m < k; m++) {
              result.push({ type: 'removed', value: words1[m] })
            }
            result.push({ type: 'unchanged', value: words2[j] })
            j++
            i = k + 1
            foundMatch = true
            break
          }
        }
      }

      if (!foundMatch) {
        // No match found nearby - mark as changed
        result.push({ type: 'removed', value: words1[i] })
        result.push({ type: 'added', value: words2[j] })
        i++
        j++
      }
    }
  }

  return result
}

function simpleDiff(original: string[], modified: string[]) {
  const unified: DiffLine[] = []
  const originalView: {
    type: string
    content: string
    lineNumber: string
    wordDiffs?: WordDiff[]
  }[] = []
  const modifiedView: {
    type: string
    content: string
    lineNumber: string
    wordDiffs?: WordDiff[]
  }[] = []

  const maxLen = Math.max(original.length, modified.length)
  let origLineNum = 1
  let modLineNum = 1

  for (let i = 0; i < maxLen; i++) {
    const origLine = original[i]
    const modLine = modified[i]

    if (origLine === modLine && origLine !== undefined) {
      // Unchanged
      unified.push({
        type: 'unchanged',
        content: origLine,
        lineNumber: `${origLineNum}`,
        prefix: ' ',
      })
      originalView.push({ type: 'unchanged', content: origLine, lineNumber: `${origLineNum}` })
      modifiedView.push({ type: 'unchanged', content: modLine, lineNumber: `${modLineNum}` })
      origLineNum++
      modLineNum++
    } else {
      // Lines are different - compute word-level diff if both exist
      let wordDiffs: WordDiff[] | undefined

      if (origLine !== undefined && modLine !== undefined) {
        wordDiffs = getWordDiff(origLine, modLine)
      }

      // Changed
      if (origLine !== undefined) {
        const deletedLine: DiffLine = {
          type: 'deleted',
          content: origLine,
          lineNumber: `${origLineNum}`,
          prefix: '-',
        }

        if (wordDiffs && diffMode.value === 'word') {
          deletedLine.wordDiffs = wordDiffs.filter((w) => w.type !== 'added')
        }

        unified.push(deletedLine)
        originalView.push({
          type: 'deleted',
          content: origLine,
          lineNumber: `${origLineNum}`,
          wordDiffs:
            wordDiffs && diffMode.value === 'word'
              ? wordDiffs.filter((w) => w.type !== 'added')
              : undefined,
        })
        origLineNum++
      }

      if (modLine !== undefined) {
        const addedLine: DiffLine = {
          type: 'added',
          content: modLine,
          lineNumber: `${modLineNum}`,
          prefix: '+',
        }

        if (wordDiffs && diffMode.value === 'word') {
          addedLine.wordDiffs = wordDiffs.filter((w) => w.type !== 'removed')
        }

        unified.push(addedLine)
        modifiedView.push({
          type: 'added',
          content: modLine,
          lineNumber: `${modLineNum}`,
          wordDiffs:
            wordDiffs && diffMode.value === 'word'
              ? wordDiffs.filter((w) => w.type !== 'removed')
              : undefined,
        })
        modLineNum++
      }
    }
  }

  return { unified, original: originalView, modified: modifiedView }
}

function getDiffLineClass(type: string) {
  if (type === 'added') {
    return 'bg-green-50 text-green-800 dark:bg-green-950/50 dark:text-green-300'
  } else if (type === 'deleted') {
    return 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300'
  }
  return 'bg-white dark:bg-gray-900'
}

function clearAll() {
  originalText.value = ''
  modifiedText.value = ''
  hasCompared.value = false
  diffLines.value = []
  splitViewOriginal.value = []
  splitViewModified.value = []
  stats.value = { additions: 0, deletions: 0, changes: 0, unchanged: 0 }
}

function swapTexts() {
  const temp = originalText.value
  originalText.value = modifiedText.value
  modifiedText.value = temp
  if (hasCompared.value) {
    compareTexts()
  }
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: #f3f4f6;
  border-radius: 8px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #a3a3a3;
  border-radius: 8px;
}
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #a3a3a3 #f3f4f6;
}
</style>
