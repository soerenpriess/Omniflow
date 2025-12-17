<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Securely encrypt and decrypt text using AES-256-GCM encryption with password-based key
      derivation. Your data is processed locally in your browser for maximum security.
    </p>
    <Card class="route-transition-animation w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:lock" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          AES Encrypt / Decrypt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs v-model="tab" class="mb-4 w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>

          <!-- Encrypt Tab Content -->
          <TabsContent value="encrypt">
            <div class="space-y-4">
              <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
                <Label for="plainText" class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:text" class="text-primary" />
                  Text
                </Label>
                <Textarea
                  id="plainText"
                  v-model="plainText"
                  rows="3"
                  class="bg-background w-full resize-none rounded-lg border p-3 text-base"
                  placeholder="Enter text"
                />
              </div>
              <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
                <Label for="password" class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:key" class="text-primary" />
                  Password
                </Label>
                <Input
                  id="password"
                  v-model="password"
                  type="password"
                  class="bg-background w-full"
                />
              </div>
            </div>
            <Button
              class="mt-4 h-12 w-full text-lg font-semibold"
              @click="encrypt"
              :disabled="!plainText || !password"
            >
              <Icon icon="mdi:lock" class="mr-2" />
              Encrypt
            </Button>

            <div v-if="encrypted" class="mt-4">
              <Label>Encrypted (Base64)</Label>
              <Textarea
                v-model="encrypted"
                rows="3"
                readonly
                class="w-full resize-none rounded-lg border p-3 font-mono text-sm"
              />
              <div class="mt-2 flex justify-end">
                <Button size="sm" variant="outline" @click="copyToClipboard(encrypted)">
                  {{ copied ? 'Copied!' : 'Copy' }}
                </Button>
              </div>
            </div>
          </TabsContent>

          <!-- Decrypt Tab Content -->
          <TabsContent value="decrypt">
            <div class="space-y-4">
              <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
                <Label for="cipherText" class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:code-braces" class="text-primary" />
                  Cipher (Base64)
                </Label>
                <Textarea
                  id="cipherText"
                  v-model="cipherText"
                  rows="3"
                  class="bg-background w-full resize-none rounded-lg border p-3 text-base"
                  placeholder="Enter cipher text"
                />
              </div>
              <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
                <Label for="password2" class="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon icon="mdi:key" class="text-primary" />
                  Password
                </Label>
                <Input
                  id="password2"
                  v-model="password2"
                  type="password"
                  class="bg-background w-full"
                />
              </div>
            </div>
            <Button
              class="mt-4 h-12 w-full text-lg font-semibold"
              @click="decrypt"
              :disabled="!cipherText || !password2"
            >
              <Icon icon="mdi:lock-open" class="mr-2" />
              Decrypt
            </Button>

            <div v-if="decrypted !== null" class="mt-4">
              <Label>Decrypted</Label>
              <Textarea
                v-model="decrypted"
                rows="3"
                readonly
                class="w-full resize-none rounded-lg border p-3 font-mono text-sm"
              />
              <div class="mt-2 flex justify-end">
                <Button size="sm" variant="outline" @click="copyToClipboard(decrypted)">
                  {{ copied ? 'Copied!' : 'Copy' }}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Icon } from '@iconify/vue'

const tab = ref<'encrypt' | 'decrypt'>('encrypt')
const plainText = ref('')
const password = ref('')
const encrypted = ref('')
const cipherText = ref('')
const password2 = ref('')
const decrypted = ref<string | null>(null)
const copied = ref(false)

async function encrypt() {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    await crypto.subtle.digest('SHA-256', enc.encode(password.value)),
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  )
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plainText.value),
  )

  const combined = new Uint8Array(iv.length + cipherBuffer.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(cipherBuffer), iv.length)
  encrypted.value = btoa(String.fromCharCode(...combined))
}

async function decrypt() {
  try {
    const data = atob(cipherText.value)
    const combined = Uint8Array.from(data, (c) => c.charCodeAt(0))
    const iv = combined.slice(0, 12)
    const cipher = combined.slice(12)
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      await crypto.subtle.digest('SHA-256', enc.encode(password2.value)),
      { name: 'AES-GCM' },
      false,
      ['decrypt'],
    )
    const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)
    decrypted.value = new TextDecoder().decode(plainBuffer)
  } catch {
    decrypted.value = 'Decryption failed!'
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>
