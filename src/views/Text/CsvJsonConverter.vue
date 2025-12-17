<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert between CSV and JSON formats
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:table" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          CSV ⇄ JSON Converter
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Mode Toggle -->
        <div class="grid grid-cols-2 gap-2">
          <Button
            @click="mode = 'csv-to-json'"
            :variant="mode === 'csv-to-json' ? 'default' : 'outline'"
            class="h-9 text-xs sm:h-10 sm:text-sm"
          >
            <Icon icon="mdi:table" class="mr-1.5 h-4 w-4" />
            CSV → JSON
          </Button>
          <Button
            @click="mode = 'json-to-csv'"
            :variant="mode === 'json-to-csv' ? 'default' : 'outline'"
            class="h-9 text-xs sm:h-10 sm:text-sm"
          >
            <Icon icon="mdi:code-json" class="mr-1.5 h-4 w-4" />
            JSON → CSV
          </Button>
        </div>

        <!-- Input -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">{{
            mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'
          }}</Label>
          <div class="flex gap-2">
            <Button
              @click="triggerFileUpload"
              variant="outline"
              size="sm"
              class="h-9 flex-1 text-xs sm:text-sm"
            >
              <Icon icon="mdi:upload" class="mr-1.5 h-4 w-4" />
              {{ mode === 'csv-to-json' ? 'Upload CSV File' : 'Upload JSON File' }}
            </Button>
            <Button @click="input = ''" variant="outline" size="sm" class="h-9 px-3">
              <Icon icon="mdi:close" class="h-4 w-4" />
            </Button>
          </div>
          <input
            ref="fileInput"
            type="file"
            :accept="mode === 'csv-to-json' ? '.csv,text/csv' : '.json,application/json'"
            @change="handleFileUpload"
            class="hidden"
          />
          <Textarea
            v-model="input"
            :placeholder="
              mode === 'csv-to-json'
                ? `name,age,city
John,30,New York
Jane,25,London`
                : `[
  {&quot;name&quot;: &quot;John&quot;, &quot;age&quot;: 30, &quot;city&quot;: &quot;New York&quot;},
  {&quot;name&quot;: &quot;Jane&quot;, &quot;age&quot;: 25, &quot;city&quot;: &quot;London&quot;}
]`
            "
            class="max-h-[300px] min-h-[150px] overflow-y-auto font-mono text-xs sm:min-h-[200px] sm:text-sm"
          />
        </div>

        <!-- Options -->
        <div class="flex flex-wrap gap-3">
          <div v-if="mode === 'csv-to-json'" class="flex items-center gap-2">
            <Switch id="header" v-model:checked="hasHeader" />
            <Label for="header" class="cursor-pointer text-xs">First Row as Header</Label>
          </div>
          <div class="flex items-center gap-2">
            <Switch id="pretty" v-model:checked="prettyPrint" />
            <Label for="pretty" class="cursor-pointer text-xs">Pretty Print JSON</Label>
          </div>
          <div v-if="mode === 'csv-to-json'" class="flex items-center gap-2">
            <Label class="text-xs">Delimiter:</Label>
            <Select v-model="delimiter">
              <SelectTrigger class="h-7 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma</SelectItem>
                <SelectItem value=";">Semicolon</SelectItem>
                <SelectItem value="\t">Tab</SelectItem>
                <SelectItem value="|">Pipe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Convert Button -->
        <Button @click="convert" class="h-9 w-full text-xs sm:h-10 sm:text-sm">
          <Icon icon="mdi:swap-horizontal" class="mr-2 h-4 w-4" />
          Convert
        </Button>

        <!-- Error -->
        <div
          v-if="error"
          class="rounded-lg border border-red-500/50 bg-red-50 p-3 dark:bg-red-950/20"
        >
          <p class="text-xs text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Output -->
        <div v-if="output" class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs sm:text-sm">{{
              mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'
            }}</Label>
            <Button @click="copyOutput" variant="ghost" size="sm" class="h-6 text-xs">
              <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" class="mr-1 h-3 w-3" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <Textarea
            v-model="output"
            readonly
            class="max-h-[300px] min-h-[150px] overflow-y-auto font-mono text-xs sm:min-h-[200px] sm:text-sm"
          />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icon } from '@iconify/vue'

const mode = ref<'csv-to-json' | 'json-to-csv'>('csv-to-json')
const input = ref('')
const output = ref('')
const error = ref('')
const hasHeader = ref(true)
const prettyPrint = ref(true)
const delimiter = ref(',')
const copied = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const expectedExtension = mode.value === 'csv-to-json' ? '.csv' : '.json'
  const fileType = mode.value === 'csv-to-json' ? 'CSV' : 'JSON'

  if (!file.name.endsWith(expectedExtension)) {
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    input.value = content
  }
  reader.readAsText(file)

  target.value = ''
}

function csvToJson(csv: string): any[] {
  const lines = csv.trim().split('\n')
  if (lines.length === 0) {
    throw new Error('Empty CSV input')
  }

  const delim = delimiter.value === '\t' ? '\t' : delimiter.value

  const parseRow = (row: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      const nextChar = row[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === delim && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = hasHeader.value ? parseRow(lines[0]) : []
  const startIndex = hasHeader.value ? 1 : 0

  const result: any[] = []

  for (let i = startIndex; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const values = parseRow(lines[i])
    if (hasHeader.value) {
      const obj: any = {}
      headers.forEach((header, index) => {
        obj[header] = values[index] || ''
      })
      result.push(obj)
    } else {
      result.push(values)
    }
  }

  return result
}

function jsonToCsv(json: any[]): string {
  if (!Array.isArray(json) || json.length === 0) {
    throw new Error('JSON must be a non-empty array')
  }

  const delim = delimiter.value === '\t' ? '\t' : delimiter.value

  const escapeValue = (value: any): string => {
    const str = String(value)
    if (str.includes(delim) || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"'
    }
    return str
  }

  if (typeof json[0] === 'object' && !Array.isArray(json[0])) {
    const headers = Object.keys(json[0])
    const csvLines: string[] = []

    csvLines.push(headers.map(escapeValue).join(delim))

    json.forEach((row) => {
      const values = headers.map((header) => escapeValue(row[header] ?? ''))
      csvLines.push(values.join(delim))
    })

    return csvLines.join('\n')
  } else {
    const csvLines: string[] = []
    json.forEach((row) => {
      if (Array.isArray(row)) {
        csvLines.push(row.map(escapeValue).join(delim))
      } else {
        csvLines.push(escapeValue(row))
      }
    })
    return csvLines.join('\n')
  }
}

function convert() {
  error.value = ''
  output.value = ''

  if (!input.value.trim()) {
    error.value = 'Please enter some input'
    return
  }

  try {
    if (mode.value === 'csv-to-json') {
      const jsonObj = csvToJson(input.value)
      output.value = prettyPrint.value ? JSON.stringify(jsonObj, null, 2) : JSON.stringify(jsonObj)
    } else {
      const jsonObj = JSON.parse(input.value)
      output.value = jsonToCsv(jsonObj)
    }
  } catch (err: any) {
    error.value = err.message || 'Conversion failed'
  }
}

function copyOutput() {
  if (output.value) {
    navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  }
}
</script>
