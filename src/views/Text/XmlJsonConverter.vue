<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Convert between XML and JSON formats
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon
            icon="mdi:file-code-outline"
            class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
          />
          XML ⇄ JSON Converter
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Mode Toggle -->
        <div class="grid grid-cols-2 gap-2">
          <Button
            @click="mode = 'xml-to-json'"
            :variant="mode === 'xml-to-json' ? 'default' : 'outline'"
            class="h-9 text-xs sm:h-10 sm:text-sm"
          >
            <Icon icon="mdi:xml" class="mr-1.5 h-4 w-4" />
            XML → JSON
          </Button>
          <Button
            @click="mode = 'json-to-xml'"
            :variant="mode === 'json-to-xml' ? 'default' : 'outline'"
            class="h-9 text-xs sm:h-10 sm:text-sm"
          >
            <Icon icon="mdi:code-json" class="mr-1.5 h-4 w-4" />
            JSON → XML
          </Button>
        </div>

        <!-- Input -->
        <div class="space-y-2">
          <Label class="text-xs sm:text-sm">{{
            mode === 'xml-to-json' ? 'XML Input' : 'JSON Input'
          }}</Label>
          <div class="flex gap-2">
            <Button
              @click="triggerFileUpload"
              variant="outline"
              size="sm"
              class="h-9 flex-1 text-xs sm:text-sm"
            >
              <Icon icon="mdi:upload" class="mr-1.5 h-4 w-4" />
              {{ mode === 'xml-to-json' ? 'Upload XML File' : 'Upload JSON File' }}
            </Button>
            <Button @click="input = ''" variant="outline" size="sm" class="h-9 px-3">
              <Icon icon="mdi:close" class="h-4 w-4" />
            </Button>
          </div>
          <input
            ref="fileInput"
            type="file"
            :accept="
              mode === 'xml-to-json' ? '.xml,text/xml,application/xml' : '.json,application/json'
            "
            @change="handleFileUpload"
            class="hidden"
          />
          <Textarea
            v-model="input"
            :placeholder="
              mode === 'xml-to-json'
                ? `<root>
  <item>value</item>
</root>`
                : `{
  &quot;root&quot;: {
    &quot;item&quot;: &quot;value&quot;
  }
}`
            "
            class="max-h-[300px] min-h-[150px] overflow-y-auto font-mono text-xs sm:min-h-[200px] sm:text-sm"
          />
        </div>

        <!-- Options -->
        <div class="flex flex-wrap gap-3">
          <div class="flex items-center gap-2">
            <Switch id="pretty" v-model:checked="prettyPrint" />
            <Label for="pretty" class="cursor-pointer text-xs">Pretty Print</Label>
          </div>
          <div v-if="mode === 'json-to-xml'" class="flex items-center gap-2">
            <Switch id="declaration" v-model:checked="xmlDeclaration" />
            <Label for="declaration" class="cursor-pointer text-xs">XML Declaration</Label>
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
              mode === 'xml-to-json' ? 'JSON Output' : 'XML Output'
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
import { Icon } from '@iconify/vue'

const mode = ref<'xml-to-json' | 'json-to-xml'>('xml-to-json')
const input = ref('')
const output = ref('')
const error = ref('')
const prettyPrint = ref(true)
const xmlDeclaration = ref(true)
const copied = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const expectedExtensions = mode.value === 'xml-to-json' ? ['.xml'] : ['.json']
  const fileType = mode.value === 'xml-to-json' ? 'XML' : 'JSON'

  if (!expectedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
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

function xmlToJson(xml: string): any {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, 'text/xml')

  const parserError = xmlDoc.getElementsByTagName('parsererror')
  if (parserError.length > 0) {
    throw new Error('Invalid XML format')
  }

  function parseNode(node: any): any {
    const obj: any = {}

    if (node.attributes && node.attributes.length > 0) {
      obj['@attributes'] = {}
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i]
        obj['@attributes'][attr.nodeName] = attr.nodeValue
      }
    }

    // Handle child nodes
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i]

        if (child.nodeType === 3) {
          // Text node
          const text = child.nodeValue?.trim()
          if (text) {
            if (Object.keys(obj).length === 0) {
              return text
            }
            obj['#text'] = text
          }
        } else if (child.nodeType === 1) {
          // Element node
          const nodeName = child.nodeName
          const nodeValue = parseNode(child)

          if (obj[nodeName]) {
            if (!Array.isArray(obj[nodeName])) {
              obj[nodeName] = [obj[nodeName]]
            }
            obj[nodeName].push(nodeValue)
          } else {
            obj[nodeName] = nodeValue
          }
        }
      }
    }

    return obj
  }

  return parseNode(xmlDoc.documentElement)
}

function jsonToXml(json: any, rootName = 'root'): string {
  function buildXml(obj: any, nodeName: string, indent = 0): string {
    const spaces = '  '.repeat(indent)
    let xml = ''

    if (obj === null || obj === undefined) {
      return `${spaces}<${nodeName}/>\n`
    }

    if (typeof obj !== 'object') {
      return `${spaces}<${nodeName}>${escapeXml(String(obj))}</${nodeName}>\n`
    }

    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        xml += buildXml(item, nodeName, indent)
      })
      return xml
    }

    const attributes = obj['@attributes'] || {}
    const attrStr = Object.keys(attributes)
      .map((key) => `${key}="${escapeXml(String(attributes[key]))}"`)
      .join(' ')

    const hasContent = Object.keys(obj).some((key) => key !== '@attributes')

    if (!hasContent) {
      return `${spaces}<${nodeName}${attrStr ? ' ' + attrStr : ''}/>\n`
    }

    xml += `${spaces}<${nodeName}${attrStr ? ' ' + attrStr : ''}>\n`

    Object.keys(obj).forEach((key) => {
      if (key === '@attributes') return
      if (key === '#text') {
        xml += `${spaces}  ${escapeXml(String(obj[key]))}\n`
      } else {
        xml += buildXml(obj[key], key, indent + 1)
      }
    })

    xml += `${spaces}</${nodeName}>\n`
    return xml
  }

  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  let result = xmlDeclaration.value ? '<?xml version="1.0" encoding="UTF-8"?>\n' : ''
  result += buildXml(json, rootName, 0)
  return result.trim()
}

function convert() {
  error.value = ''
  output.value = ''

  if (!input.value.trim()) {
    error.value = 'Please enter some input'
    return
  }

  try {
    if (mode.value === 'xml-to-json') {
      const jsonObj = xmlToJson(input.value)
      output.value = prettyPrint.value ? JSON.stringify(jsonObj, null, 2) : JSON.stringify(jsonObj)
    } else {
      const jsonObj = JSON.parse(input.value)
      const rootKey = Object.keys(jsonObj)[0]
      output.value = jsonToXml(jsonObj[rootKey], rootKey)
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
