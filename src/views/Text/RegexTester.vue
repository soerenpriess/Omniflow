<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Test and debug regular expressions in real-time
    </p>
    <Card class="route-transition-animation mt-12 w-full max-w-7xl rounded-2xl shadow-lg sm:mt-0">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <Icon icon="mdi:regex" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Regex Tester
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <!-- Regex Input & Flags -->
        <div
          class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-colors"
        >
          <Label class="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Icon icon="mdi:regex" class="h-4 w-4" />
            Regular Expression
          </Label>
          <div class="space-y-2">
            <div class="relative flex-1">
              <span class="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">/</span>
              <Input
                id="regex"
                v-model="regexPattern"
                placeholder="Enter your regex pattern"
                class="pr-16 pl-7 font-mono text-sm"
                @input="testRegex"
              />
              <span class="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm"
                >/{{ flags }}</span
              >
            </div>
            <div
              v-if="regexError"
              class="rounded-lg border border-red-500/50 bg-red-50 p-2 dark:bg-red-950/20"
            >
              <p class="text-xs text-red-600 dark:text-red-400">{{ regexError }}</p>
            </div>
            <!-- Flags -->
            <div class="flex flex-wrap gap-3 pt-1">
              <div class="flex items-center gap-1.5">
                <Switch id="flag-g" v-model:checked="flagG" @update:checked="testRegex" />
                <Label for="flag-g" class="cursor-pointer text-xs">g</Label>
              </div>
              <div class="flex items-center gap-1.5">
                <Switch id="flag-i" v-model:checked="flagI" @update:checked="testRegex" />
                <Label for="flag-i" class="cursor-pointer text-xs">i</Label>
              </div>
              <div class="flex items-center gap-1.5">
                <Switch id="flag-m" v-model:checked="flagM" @update:checked="testRegex" />
                <Label for="flag-m" class="cursor-pointer text-xs">m</Label>
              </div>
              <div class="flex items-center gap-1.5">
                <Switch id="flag-s" v-model:checked="flagS" @update:checked="testRegex" />
                <Label for="flag-s" class="cursor-pointer text-xs">s</Label>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content: Two Column Layout -->
        <div class="flex flex-col gap-3 lg:flex-row">
          <!-- Left: Test String -->
          <div class="space-y-3 lg:w-1/2">
            <div
              class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-colors"
            >
              <Label class="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Icon icon="mdi:text-box" class="h-4 w-4" />
                Test String
              </Label>
              <Textarea
                id="testString"
                v-model="testString"
                rows="8"
                placeholder="Enter text to test against your regex..."
                class="font-mono text-xs"
                @input="testRegex"
              />
            </div>

            <!-- Common Patterns -->
            <Collapsible>
              <CollapsibleTrigger as-child>
                <Button variant="outline" size="sm" class="h-8 w-full justify-between text-xs">
                  <span class="flex items-center gap-2">
                    <Icon icon="mdi:lightning-bolt" class="h-4 w-4" />
                    Common Patterns
                  </span>
                  <Icon icon="mdi:chevron-down" class="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent class="mt-2 max-h-48 overflow-auto">
                <ScrollArea class="rounded-lg border">
                  <div class="space-y-1.5 p-1.5">
                    <Button
                      v-for="pattern in commonPatterns"
                      :key="pattern.name"
                      variant="outline"
                      size="sm"
                      class="h-auto justify-start overflow-hidden py-1.5 text-left"
                      style="width: calc(100% - 12px)"
                      @click="applyPattern(pattern)"
                    >
                      <div class="w-full min-w-0 overflow-hidden">
                        <p class="truncate text-xs font-semibold">{{ pattern.name }}</p>
                        <code
                          class="text-muted-foreground overflow-wrap-anywhere block text-[10px] leading-tight break-all"
                          >{{ pattern.pattern }}</code
                        >
                      </div>
                    </Button>
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <!-- Right: Results -->
          <div class="space-y-3 lg:w-1/2">
            <div class="space-y-3">
              <!-- Match Status -->
              <div
                class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <Icon
                    :icon="matches.length > 0 ? 'mdi:check-circle' : 'mdi:close-circle'"
                    :class="matches.length > 0 ? 'text-green-500' : 'text-red-500'"
                    class="h-5 w-5"
                  />
                  <div>
                    <p class="text-sm font-semibold">
                      {{ matches.length > 0 ? 'Match Found' : 'No Match' }}
                    </p>
                    <p class="text-muted-foreground text-xs">
                      {{ matches.length }} {{ matches.length === 1 ? 'match' : 'matches' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Matches -->
              <div
                v-if="matches.length > 0"
                class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-colors"
              >
                <Label class="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Icon icon="mdi:format-list-bulleted" class="h-4 w-4" />
                  Matches
                </Label>
                <ScrollArea class="h-48 rounded-lg border">
                  <div class="space-y-1.5 p-2">
                    <div
                      v-for="(match, index) in matches"
                      :key="index"
                      class="hover:bg-muted/50 rounded-lg border p-2 transition-colors"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <p class="font-mono text-xs font-semibold break-all">
                            {{ match.value }}
                          </p>
                          <p class="text-muted-foreground text-[10px]">
                            Pos {{ match.index }} · Len {{ match.value.length }}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          class="h-6 w-6"
                          @click="copyToClipboard(match.value, index)"
                        >
                          <Icon
                            :icon="copiedIndices.includes(index) ? 'mdi:check' : 'mdi:content-copy'"
                            class="h-3 w-3"
                          />
                        </Button>
                      </div>
                      <!-- Groups -->
                      <div
                        v-if="match.groups && match.groups.length > 0"
                        class="mt-1.5 space-y-0.5"
                      >
                        <p class="text-[10px] font-medium">Capture Groups:</p>
                        <div
                          v-for="(group, gIndex) in match.groups"
                          :key="gIndex"
                          class="flex items-center gap-1.5 text-[10px]"
                        >
                          <span class="text-muted-foreground">{{ gIndex + 1 }}:</span>
                          <code class="bg-muted rounded px-1 break-all">{{ group }}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              <!-- Highlighted Text -->
              <div
                class="border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-colors"
              >
                <Label class="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Icon icon="mdi:highlighter" class="h-4 w-4" />
                  Highlighted Matches
                </Label>
                <div class="bg-background/50 max-h-48 overflow-auto rounded-lg border p-2">
                  <pre
                    class="font-mono text-xs break-words whitespace-pre-wrap"
                    v-html="highlightedText"
                  ></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Icon } from '@iconify/vue'

const regexPattern = ref('')
const testString = ref(
  'The quick brown fox jumps over the lazy dog.\nEmail: test@example.com\nPhone: +1-234-567-8900',
)
const flagG = ref(true)
const flagI = ref(false)
const flagM = ref(false)
const flagS = ref(false)
const regexError = ref('')

interface Match {
  value: string
  index: number
  groups: string[]
}

const matches = ref<Match[]>([])
const copiedIndices = ref<number[]>([])

const flags = computed(() => {
  let f = ''
  if (flagG.value) f += 'g'
  if (flagI.value) f += 'i'
  if (flagM.value) f += 'm'
  if (flagS.value) f += 's'
  return f
})

const highlightedText = computed(() => {
  if (!testString.value || !regexPattern.value || regexError.value) {
    return escapeHtml(testString.value)
  }

  let result = escapeHtml(testString.value)
  const sortedMatches = [...matches.value].sort((a, b) => b.index - a.index)

  for (const match of sortedMatches) {
    const before = result.substring(0, match.index)
    const matchText = result.substring(match.index, match.index + match.value.length)
    const after = result.substring(match.index + match.value.length)
    result =
      before + '<mark class="bg-yellow-300 dark:bg-yellow-600">' + matchText + '</mark>' + after
  }

  return result
})

const commonPatterns = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  {
    name: 'URL',
    pattern:
      'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
  },
  { name: 'Phone (US)', pattern: '\\+?1?[-.]?\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}' },
  { name: 'IPv4', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' },
  { name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}\\b|#[0-9A-Fa-f]{3}\\b' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { name: 'Time (HH:MM)', pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9]' },
  { name: 'HTML Tag', pattern: '<\\/?[a-z][a-z0-9]*[^<>]*>' },
]

function testRegex() {
  regexError.value = ''
  matches.value = []

  if (!regexPattern.value || !testString.value) return

  try {
    const regex = new RegExp(regexPattern.value, flags.value)
    const lines = testString.value.split('\n')
    let currentIndex = 0

    // Test each line separately
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex]
      const matchArray = line.matchAll(regex)

      for (const match of matchArray) {
        matches.value.push({
          value: match[0],
          index: currentIndex + (match.index || 0),
          groups: match.slice(1).filter((g) => g !== undefined),
        })
      }

      currentIndex += line.length + 1
    }
  } catch (error) {
    regexError.value = error instanceof Error ? error.message : 'Invalid regex pattern'
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function applyPattern(pattern: { name: string; pattern: string }) {
  regexPattern.value = pattern.pattern
  testRegex()
}

function copyToClipboard(text: string, index?: number) {
  navigator.clipboard.writeText(text)
  if (index !== undefined) {
    copiedIndices.value.push(index)
    setTimeout(() => {
      copiedIndices.value = copiedIndices.value.filter((i) => i !== index)
    }, 1500)
  }
}
</script>
