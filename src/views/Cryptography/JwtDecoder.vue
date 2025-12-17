<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Decode and analyze JSON Web Tokens (JWT). View header, payload, and signature.
    </p>
    <Card class="route-transition-animation w-full max-w-4xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:key-variant" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          JWT Decoder
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- JWT Input -->
        <div class="space-y-2">
          <Label for="jwtInput">JWT Token</Label>
          <Textarea
            id="jwtInput"
            v-model="jwtInput"
            rows="4"
            placeholder="Paste your JWT token here..."
            class="font-mono text-sm"
            @input="decodeJWT"
          />
        </div>

        <!-- Decode Status -->
        <div
          v-if="jwtInput && error"
          class="rounded-lg border border-red-500/50 bg-red-50 p-3 dark:bg-red-950/20"
        >
          <div class="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300">
            <Icon icon="mdi:alert-circle" class="h-5 w-5" />
            Invalid JWT Token
          </div>
          <p class="mt-1 text-xs text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Decoded JWT -->
        <div v-if="decodedJWT && !error" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <!-- Header -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label class="text-sm font-semibold">Header</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  @click="copyToClipboard(decodedJWT.header, 'header')"
                  class="h-7"
                >
                  <Icon :icon="copiedHeader ? 'mdi:check' : 'mdi:content-copy'" class="h-3 w-3" />
                </Button>
              </div>
              <div class="bg-muted/30 rounded-lg border p-3">
                <pre class="overflow-x-auto text-xs">{{ formatJSON(decodedJWT.header) }}</pre>
              </div>
            </div>

            <!-- Payload -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label class="text-sm font-semibold">Payload</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  @click="copyToClipboard(decodedJWT.payload, 'payload')"
                  class="h-7"
                >
                  <Icon :icon="copiedPayload ? 'mdi:check' : 'mdi:content-copy'" class="h-3 w-3" />
                </Button>
              </div>
              <div class="bg-muted/30 rounded-lg border p-3">
                <pre class="overflow-x-auto text-xs">{{ formatJSON(decodedJWT.payload) }}</pre>
              </div>
            </div>
          </div>

          <!-- Payload Details -->
          <div v-if="payloadDetails.length > 0" class="space-y-2">
            <Label class="text-sm font-medium">Claims</Label>
            <div class="grid gap-2 sm:grid-cols-2">
              <div
                v-for="detail in payloadDetails"
                :key="detail.key"
                class="rounded-lg border p-2.5"
              >
                <div class="mb-1 flex items-center justify-between">
                  <span class="text-xs font-medium">{{ detail.label }}</span>
                  <span
                    v-if="detail.description"
                    class="text-muted-foreground text-xs"
                    :class="{
                      'text-red-600 dark:text-red-400': detail.description.includes('Expired'),
                      'text-green-600 dark:text-green-400': detail.description.includes('Valid'),
                    }"
                  >
                    {{ detail.description }}
                  </span>
                </div>
                <p class="font-mono text-xs">{{ detail.value }}</p>
              </div>
            </div>
          </div>

          <!-- Signature -->
          <div class="space-y-2">
            <Label class="text-sm font-semibold">Signature</Label>
            <div class="bg-muted/30 rounded-lg border p-3">
              <p class="font-mono text-xs break-all">{{ decodedJWT.signature }}</p>
            </div>
          </div>

          <!-- Warning -->
          <div
            class="rounded-lg border border-yellow-500/50 bg-yellow-50 p-3 dark:bg-yellow-950/20"
          >
            <div class="flex items-start gap-2">
              <Icon
                icon="mdi:shield-alert"
                class="mt-0.5 h-4 w-4 text-yellow-700 dark:text-yellow-300"
              />
              <p class="text-xs text-yellow-600 dark:text-yellow-400">
                This tool only decodes JWTs. Signature verification requires the secret key and
                should be done server-side.
              </p>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div v-if="!jwtInput" class="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
          <div
            class="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300"
          >
            <Icon icon="mdi:information" class="h-5 w-5" />
            About JWT
          </div>
          <p class="text-xs text-blue-600 dark:text-blue-400">
            JSON Web Tokens are an open, industry standard (RFC 7519) method for representing claims
            securely between two parties. JWTs consist of three parts: Header, Payload, and
            Signature, separated by dots (.).
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Icon } from '@iconify/vue'

const jwtInput = ref('')
const error = ref('')
const copiedHeader = ref(false)
const copiedPayload = ref(false)
const decodedJWT = ref<{
  header: any
  payload: any
  signature: string
} | null>(null)

interface PayloadDetail {
  key: string
  label: string
  value: string
  description?: string
}

const payloadDetails = computed<PayloadDetail[]>(() => {
  if (!decodedJWT.value?.payload) return []

  const details: PayloadDetail[] = []
  const payload = decodedJWT.value.payload

  // Standard JWT claims
  const claimDefinitions: Record<string, { label: string; formatter?: (val: any) => string }> = {
    iss: { label: 'Issuer' },
    sub: { label: 'Subject' },
    aud: { label: 'Audience' },
    exp: {
      label: 'Expiration Time',
      formatter: (val) => new Date(val * 1000).toLocaleString(),
    },
    nbf: {
      label: 'Not Before',
      formatter: (val) => new Date(val * 1000).toLocaleString(),
    },
    iat: {
      label: 'Issued At',
      formatter: (val) => new Date(val * 1000).toLocaleString(),
    },
    jti: { label: 'JWT ID' },
  }

  for (const [key, value] of Object.entries(payload)) {
    if (claimDefinitions[key]) {
      const def = claimDefinitions[key]
      let displayValue = def.formatter ? def.formatter(value) : String(value)
      let description

      if (key === 'exp') {
        const expDate = new Date(Number(value) * 1000)
        const isExpired = expDate < new Date()
        description = isExpired ? '⚠️ Expired' : '✓ Valid'
      }

      details.push({
        key,
        label: def.label,
        value: displayValue,
        description,
      })
    }
  }

  return details
})

function decodeJWT() {
  error.value = ''
  decodedJWT.value = null

  if (!jwtInput.value.trim()) return

  try {
    const parts = jwtInput.value.trim().split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. Expected 3 parts separated by dots.')
    }

    const [headerB64, payloadB64, signature] = parts

    const decodeBase64URL = (str: string): string => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
      const pad = str.length % 4
      if (pad) {
        base64 += '='.repeat(4 - pad)
      }
      return atob(base64)
    }

    const header = JSON.parse(decodeBase64URL(headerB64))
    const payload = JSON.parse(decodeBase64URL(payloadB64))

    decodedJWT.value = {
      header,
      payload,
      signature,
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to decode JWT'
  }
}

function formatJSON(obj: any): string {
  return JSON.stringify(obj, null, 2)
}

function copyToClipboard(data: any, type?: string) {
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  navigator.clipboard.writeText(text)
  if (type === 'header') {
    copiedHeader.value = true
    setTimeout(() => {
      copiedHeader.value = false
    }, 1500)
  } else if (type === 'payload') {
    copiedPayload.value = true
    setTimeout(() => {
      copiedPayload.value = false
    }, 1500)
  }
}
</script>
