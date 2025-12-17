<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Validate YAML syntax for Kubernetes, Docker Compose, and more
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:file-code" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          YAML Validator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3 sm:space-y-4">
        <!-- Mode Toggle -->
        <div class="grid grid-cols-3 gap-2">
          <Button
            @click="mode = 'validate'"
            :variant="mode === 'validate' ? 'default' : 'outline'"
            class="h-9 text-xs sm:h-10 sm:text-sm"
          >
            <Icon icon="mdi:check-circle" class="mr-1.5 h-4 w-4" />
            Validate
          </Button>
          <Button
            @click="mode = 'yaml-to-json'"
            :variant="mode === 'yaml-to-json' ? 'default' : 'outline'"
            class="h-9 text-xs sm:h-10 sm:text-sm"
          >
            <Icon icon="mdi:code-json" class="mr-1.5 h-4 w-4" />
            YAML → JSON
          </Button>
          <Button
            @click="mode = 'json-to-yaml'"
            :variant="mode === 'json-to-yaml' ? 'default' : 'outline'"
            class="h-9 text-xs sm:h-10 sm:text-sm"
          >
            <Icon icon="mdi:file-code" class="mr-1.5 h-4 w-4" />
            JSON → YAML
          </Button>
        </div>

        <!-- Input -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs sm:text-sm">{{
              mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'
            }}</Label>
            <div class="flex gap-2">
              <Button @click="loadExample" variant="ghost" size="sm" class="h-6 text-xs">
                <Icon icon="mdi:lightbulb-outline" class="mr-1 h-3 w-3" />
                Example
              </Button>
              <Button @click="input = ''" variant="ghost" size="sm" class="h-6 text-xs">
                <Icon icon="mdi:close" class="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            v-model="input"
            @input="processInput"
            :placeholder="
              mode === 'json-to-yaml'
                ? `{
  &quot;name&quot;: &quot;example&quot;,
  &quot;version&quot;: &quot;1.0.0&quot;
}`
                : `# Enter your YAML here
apiVersion: v1
kind: Pod
metadata:
  name: example-pod`
            "
            class="max-h-[300px] min-h-[250px] font-mono text-xs sm:text-sm"
          />
        </div>

        <!-- Validation Status -->
        <div
          v-if="validationStatus"
          :class="[
            'rounded-lg border p-3',
            validationStatus.valid
              ? 'border-green-500/50 bg-green-50 dark:bg-green-950/20'
              : 'border-red-500/50 bg-red-50 dark:bg-red-950/20',
          ]"
        >
          <div
            :class="[
              'flex items-center gap-2 text-sm font-medium',
              validationStatus.valid
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300',
            ]"
          >
            <Icon
              :icon="validationStatus.valid ? 'mdi:check-circle' : 'mdi:alert-circle'"
              class="h-5 w-5"
            />
            {{ validationStatus.valid ? 'Valid YAML' : 'Invalid YAML' }}
          </div>
          <p
            v-if="validationStatus.message"
            :class="[
              'mt-1 text-xs',
              validationStatus.valid
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            ]"
          >
            {{ validationStatus.message }}
          </p>
        </div>

        <!-- Convert Button -->
        <Button
          v-if="mode !== 'validate'"
          @click="convert"
          class="h-9 w-full text-xs sm:h-10 sm:text-sm"
        >
          <Icon icon="mdi:swap-horizontal" class="mr-2 h-4 w-4" />
          Convert
        </Button>

        <!-- Output -->
        <div v-if="output && mode !== 'validate'" class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs sm:text-sm">{{
              mode === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'
            }}</Label>
            <Button @click="copyOutput" variant="ghost" size="sm" class="h-6 text-xs">
              <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" class="mr-1 h-3 w-3" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <Textarea
            v-model="output"
            readonly
            class="max-h-[300px] min-h-[200px] font-mono text-xs sm:text-sm"
          />
        </div>

        <!-- YAML Info -->
        <div class="bg-muted/30 rounded-lg border p-3">
          <Label class="mb-2 text-xs font-semibold sm:text-sm">YAML Quick Reference</Label>
          <div class="space-y-1 text-[10px] sm:text-xs">
            <div class="font-mono">
              <span class="text-muted-foreground"># Comments start with #</span>
            </div>
            <div class="font-mono">
              <span class="text-primary">key:</span> value
              <span class="text-muted-foreground"># Key-value pairs</span>
            </div>
            <div class="font-mono">
              <span class="text-primary">array:</span>
              <span class="text-muted-foreground"># Arrays</span>
            </div>
            <div class="pl-2 font-mono">- item1</div>
            <div class="pl-2 font-mono">- item2</div>
            <div class="font-mono">
              <span class="text-primary">nested:</span>
              <span class="text-muted-foreground"># Nested objects (2 space indent)</span>
            </div>
            <div class="pl-2 font-mono"><span class="text-primary">child:</span> value</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

const mode = ref<'validate' | 'yaml-to-json' | 'json-to-yaml'>('validate')
const input = ref('')
const output = ref('')
const validationStatus = ref<{ valid: boolean; message: string } | null>(null)
const copied = ref(false)

function parseYaml(yamlStr: string): any {
  const lines = yamlStr.split('\n')
  const result: any = {}
  const stack: any[] = [{ obj: result, indent: -1, key: null }]
  const errors: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trimEnd()

    // Skip empty lines
    if (!trimmed) continue

    // Skip comments
    if (trimmed.trim().startsWith('#')) continue

    const indent = line.search(/\S/)
    const content = trimmed.trim()

    // Check for tabs (common error)
    if (line.includes('\t')) {
      throw new Error(`Line ${i + 1}: Tabs are not allowed in YAML. Use spaces for indentation.`)
    }

    // Check for inconsistent indentation
    if (indent % 2 !== 0 && indent > 0) {
      errors.push(`Line ${i + 1}: Inconsistent indentation (use 2 or 4 spaces consistently)`)
    }

    // Pop stack until we find the right parent
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop()
    }

    const parent = stack[stack.length - 1].obj

    // Array item
    if (content.startsWith('- ')) {
      const value = content.substring(2).trim()

      if (!Array.isArray(parent)) {
        throw new Error(`Line ${i + 1}: Array item in non-array context`)
      }

      if (value.includes(':')) {
        // Check for proper key-value format
        const colonIndex = value.indexOf(':')
        const key = value.substring(0, colonIndex).trim()
        const val = value.substring(colonIndex + 1).trim()

        // Validate key
        if (!key || key.includes(' ')) {
          throw new Error(`Line ${i + 1}: Invalid key format "${key}"`)
        }

        const obj: any = {}
        parent.push(obj)
        stack.push({ obj, indent, key })
        obj[key] = val || null
      } else {
        parent.push(value)
      }
      continue
    }

    // Key-value pair
    if (content.includes(':')) {
      const colonIndex = content.indexOf(':')
      const key = content.substring(0, colonIndex).trim()
      const value = content.substring(colonIndex + 1).trim()

      // Validate key
      if (!key) {
        throw new Error(`Line ${i + 1}: Empty key is not allowed`)
      }

      // Check for duplicate keys
      if (typeof parent === 'object' && !Array.isArray(parent) && key in parent) {
        errors.push(`Line ${i + 1}: Duplicate key "${key}"`)
      }

      // Check for invalid characters in unquoted keys
      if (key.match(/[{}[\],&*#?|<>=!%@`]/)) {
        errors.push(
          `Line ${i + 1}: Key "${key}" contains special characters. Consider using quotes.`,
        )
      }

      if (!value) {
        // Object or array coming
        const nextLine = lines[i + 1]
        if (nextLine) {
          const nextIndent = nextLine.search(/\S/)
          const nextContent = nextLine.trim()

          if (nextContent.startsWith('-')) {
            parent[key] = []
            stack.push({ obj: parent[key], indent, key })
          } else if (nextIndent > indent) {
            parent[key] = {}
            stack.push({ obj: parent[key], indent, key })
          } else {
            parent[key] = null
          }
        } else {
          parent[key] = null
        }
      } else {
        // Parse value with type detection
        if (value === 'true' || value === 'True' || value === 'TRUE') {
          parent[key] = true
        } else if (value === 'false' || value === 'False' || value === 'FALSE') {
          parent[key] = false
        } else if (value === 'null' || value === 'Null' || value === 'NULL' || value === '~') {
          parent[key] = null
        } else if (value.match(/^-?\d+$/)) {
          parent[key] = parseInt(value)
        } else if (value.match(/^-?\d+\.\d+$/)) {
          parent[key] = parseFloat(value)
        } else if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          parent[key] = value.slice(1, -1)
        } else if (value.startsWith('[') && value.endsWith(']')) {
          // Inline array
          try {
            parent[key] = JSON.parse(value)
          } catch {
            errors.push(`Line ${i + 1}: Invalid inline array format`)
            parent[key] = value
          }
        } else if (value.startsWith('{') && value.endsWith('}')) {
          // Inline object
          try {
            parent[key] = JSON.parse(value)
          } catch {
            errors.push(`Line ${i + 1}: Invalid inline object format`)
            parent[key] = value
          }
        } else {
          parent[key] = value
        }
      }
    } else {
      throw new Error(`Line ${i + 1}: Invalid YAML syntax - expected key:value format`)
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  return result
}

// JSON to YAML converter
function jsonToYaml(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent)
  let yaml = ''

  if (obj === null || obj === undefined) {
    return 'null'
  }

  if (typeof obj === 'string') {
    // Check if string needs quoting
    if (
      obj.includes(':') ||
      obj.includes('#') ||
      obj.includes('\n') ||
      obj.match(/^[\d.]+$/) ||
      ['true', 'false', 'null', 'yes', 'no', 'on', 'off'].includes(obj.toLowerCase())
    ) {
      return `"${obj.replace(/"/g, '\\"')}"`
    }
    return obj
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj)
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    obj.forEach((item) => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        // Handle object in array
        const keys = Object.keys(item)
        keys.forEach((key, index) => {
          const prefix = index === 0 ? `${spaces}- ` : `${spaces}  `
          const value = item[key]

          yaml += `${prefix}${key}:`

          if (value === null || value === undefined) {
            yaml += ' null\n'
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            yaml += '\n' + jsonToYaml(value, indent + 2) + '\n'
          } else if (Array.isArray(value)) {
            if (value.length === 0) {
              yaml += ' []\n'
            } else {
              yaml += '\n' + jsonToYaml(value, indent + 2) + '\n'
            }
          } else {
            yaml += ` ${jsonToYaml(value, 0)}\n`
          }
        })
      } else {
        yaml += `${spaces}- ${jsonToYaml(item, 0)}\n`
      }
    })
    return yaml.trimEnd()
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj)
    if (keys.length === 0) return '{}'
    keys.forEach((key, index) => {
      const value = obj[key]
      yaml += `${spaces}${key}:`

      if (value === null || value === undefined) {
        yaml += ' null\n'
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        yaml += '\n' + jsonToYaml(value, indent + 1) + '\n'
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          yaml += ' []\n'
        } else {
          yaml += '\n' + jsonToYaml(value, indent + 1) + '\n'
        }
      } else {
        yaml += ` ${jsonToYaml(value, indent)}\n`
      }
    })
    return yaml.trimEnd()
  }

  return String(obj)
}

function processInput() {
  if (mode.value === 'validate') {
    validateYaml()
  }
}

function validateYaml() {
  validationStatus.value = null
  output.value = ''

  if (!input.value.trim()) {
    return
  }

  try {
    const parsed = parseYaml(input.value)
    output.value = JSON.stringify(parsed, null, 2)

    // Count elements for statistics
    const countElements = (obj: any): { keys: number; arrays: number; depth: number } => {
      let keys = 0
      let arrays = 0
      let maxDepth = 0

      const traverse = (item: any, depth: number) => {
        if (Array.isArray(item)) {
          arrays++
          item.forEach((el) => traverse(el, depth + 1))
        } else if (typeof item === 'object' && item !== null) {
          const itemKeys = Object.keys(item)
          keys += itemKeys.length
          itemKeys.forEach((key) => traverse(item[key], depth + 1))
        }
        maxDepth = Math.max(maxDepth, depth)
      }

      traverse(obj, 1)
      return { keys, arrays, depth: maxDepth }
    }

    const stats = countElements(parsed)
    const statsMsg = `Valid YAML (${stats.keys} keys, ${stats.arrays} arrays, depth: ${stats.depth})`

    validationStatus.value = {
      valid: true,
      message: statsMsg,
    }
  } catch (err: any) {
    validationStatus.value = {
      valid: false,
      message: err.message || 'Invalid YAML syntax',
    }
  }
}

function convert() {
  validationStatus.value = null
  output.value = ''

  if (!input.value.trim()) {
    toast.error('Please enter some input')
    return
  }

  try {
    if (mode.value === 'yaml-to-json') {
      const parsed = parseYaml(input.value)
      output.value = JSON.stringify(parsed, null, 2)
      toast.success('YAML converted to JSON!')
      validationStatus.value = {
        valid: true,
        message: 'Successfully converted YAML to JSON',
      }
    } else if (mode.value === 'json-to-yaml') {
      const parsed = JSON.parse(input.value)
      output.value = jsonToYaml(parsed, 0)
      toast.success('JSON converted to YAML!')
      validationStatus.value = {
        valid: true,
        message: 'Successfully converted JSON to YAML',
      }
    }
  } catch (err: any) {
    validationStatus.value = {
      valid: false,
      message: err.message || 'Conversion failed',
    }
    toast.error('Conversion failed')
  }
}

function copyOutput() {
  if (output.value) {
    navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
    toast.success('Copied to clipboard!')
  }
}

function loadExample() {
  input.value = `# Kubernetes Pod Example
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
      env:
        - name: ENVIRONMENT
          value: production`
  validateYaml()
}
</script>
