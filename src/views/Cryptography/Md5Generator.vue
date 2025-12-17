<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate MD5 hashes from text. Note: MD5 is not secure for cryptographic purposes but useful
      for checksums and legacy systems.
    </p>
    <Card class="route-transition-animation w-full max-w-lg rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:fingerprint" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          MD5 Hash Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Text Hash -->
        <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
          <Label for="inputText" class="mb-2 flex items-center gap-2 text-sm font-medium">
            <Icon icon="mdi:text" class="text-primary" />
            Text
          </Label>
          <Textarea
            id="inputText"
            v-model="inputText"
            rows="4"
            placeholder="Enter text to hash"
            class="bg-background max-h-50 w-full resize-none rounded-lg border p-3 text-base"
            @input="generateHash"
          />
        </div>

        <!-- Security Warning -->
        <div
          v-if="inputText"
          class="rounded-lg border border-yellow-500/50 bg-yellow-50 p-3 dark:bg-yellow-950/20"
        >
          <div
            class="mb-2 flex items-center gap-2 text-sm font-medium text-yellow-700 dark:text-yellow-300"
          >
            <Icon icon="mdi:alert" class="h-5 w-5" />
            Security Warning
          </div>
          <p class="text-xs text-yellow-600 dark:text-yellow-400">
            MD5 is cryptographically broken and should not be used for security purposes. Use
            SHA-256 or higher for secure hashing.
          </p>
        </div>

        <!-- Hash Result -->
        <div v-if="hashResult" class="mt-4 flex flex-col gap-2">
          <Label>MD5 Hash</Label>
          <div class="relative">
            <Input v-model="hashResult" readonly class="pr-10 font-mono text-sm" />
            <Button
              size="icon"
              variant="ghost"
              class="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
              @click="copyToClipboard(hashResult)"
            >
              <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <!-- File Hash -->
        <Separator class="my-4" />

        <div class="space-y-2">
          <Label for="fileInput" class="flex items-center gap-2">
            <Icon icon="mdi:file" class="text-primary" />
            Hash File
          </Label>
          <div class="flex gap-2">
            <Input id="fileInput" type="file" @change="handleFileUpload" class="flex-1" />
          </div>
          <div v-if="fileHash" class="mt-2 flex flex-col gap-2">
            <Label>File MD5 Hash</Label>
            <div class="relative">
              <Input v-model="fileHash" readonly class="pr-10 font-mono text-sm" />
              <Button
                size="icon"
                variant="ghost"
                class="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
                @click="copyToClipboard(fileHash)"
              >
                <Icon :icon="fileCopied ? 'mdi:check' : 'mdi:content-copy'" class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Icon } from '@iconify/vue'

const inputText = ref('')
const hashResult = ref('')
const fileHash = ref('')
const copied = ref(false)
const fileCopied = ref(false)

function md5(str: string): string {
  function rotateLeft(value: number, shift: number): number {
    return (value << shift) | (value >>> (32 - shift))
  }

  function addUnsigned(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  function f(x: number, y: number, z: number): number {
    return (x & y) | (~x & z)
  }

  function g(x: number, y: number, z: number): number {
    return (x & z) | (y & ~z)
  }

  function h(x: number, y: number, z: number): number {
    return x ^ y ^ z
  }

  function i(x: number, y: number, z: number): number {
    return y ^ (x | ~z)
  }

  function ff(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function gg(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function hh(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function ii(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function convertToWordArray(str: string): number[] {
    const wordArray: number[] = []
    for (let i = 0; i < str.length * 8; i += 8) {
      wordArray[i >> 5] |= (str.charCodeAt(i / 8) & 0xff) << i % 32
    }
    return wordArray
  }

  function wordToHex(value: number): string {
    let hex = ''
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 0xff
      hex += ('0' + byte.toString(16)).slice(-2)
    }
    return hex
  }

  const utf8Encode = unescape(encodeURIComponent(str))
  const x = convertToWordArray(utf8Encode)
  const len = utf8Encode.length * 8

  x[len >> 5] |= 0x80 << len % 32
  x[(((len + 64) >>> 9) << 4) + 14] = len

  let a = 1732584193
  let b = -271733879
  let c = -1732584194
  let d = 271733878

  for (let i = 0; i < x.length; i += 16) {
    const oldA = a
    const oldB = b
    const oldC = c
    const oldD = d

    a = ff(a, b, c, d, x[i], 7, -680876936)
    d = ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = ff(c, d, a, b, x[i + 10], 17, -42063)
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329)

    a = gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = gg(b, c, d, a, x[i], 20, -373897302)
    a = gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734)

    a = hh(a, b, c, d, x[i + 5], 4, -378558)
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = hh(a, b, c, d, x[i + 13], 4, 681279174)
    d = hh(d, a, b, c, x[i], 11, -358537222)
    c = hh(c, d, a, b, x[i + 3], 16, -722521979)
    b = hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = hh(a, b, c, d, x[i + 9], 4, -640364487)
    d = hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = hh(c, d, a, b, x[i + 15], 16, 530742520)
    b = hh(b, c, d, a, x[i + 2], 23, -995338651)

    a = ii(a, b, c, d, x[i], 6, -198630844)
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571)
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359)
    d = ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380)
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = ii(a, b, c, d, x[i + 4], 6, -145523070)
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = ii(c, d, a, b, x[i + 2], 15, 718787259)
    b = ii(b, c, d, a, x[i + 9], 21, -343485551)

    a = addUnsigned(a, oldA)
    b = addUnsigned(b, oldB)
    c = addUnsigned(c, oldC)
    d = addUnsigned(d, oldD)
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
}

function generateHash() {
  if (!inputText.value) {
    hashResult.value = ''
    return
  }
  hashResult.value = md5(inputText.value)
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    fileHash.value = md5(text)
  } catch (error) {
    console.error('Failed to read file')
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  if (text === hashResult.value) {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } else {
    fileCopied.value = true
    setTimeout(() => (fileCopied.value = false), 2000)
  }
}
</script>
