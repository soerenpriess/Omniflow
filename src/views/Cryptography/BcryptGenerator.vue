<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate secure bcrypt hashes for password storage and verify existing hashes.
    </p>
    <Tabs v-model="tab" class="mb-6 w-full max-w-lg">
      <TabsList class="mb-2 grid w-full grid-cols-2">
        <TabsTrigger :value="'generate'" :class="{ 'bg-primary text-white': tab === 'generate' }">
          Generate Hash
        </TabsTrigger>
        <TabsTrigger :value="'verify'" :class="{ 'bg-primary text-white': tab === 'verify' }">
          Verify Hash
        </TabsTrigger>
      </TabsList>
      <Card class="route-transition-animation w-full">
        <CardHeader class="space-y-1">
          <CardTitle class="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
            <Icon icon="mdi:shield-key" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
            Bcrypt Hash Generator & Verifier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Generate Tab Content -->
          <TabsContent value="generate">
            <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
              <Label for="plainText" class="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:text" class="text-primary" />
                Text to hash
              </Label>
              <Input
                id="plainText"
                v-model="generateText"
                placeholder="Enter text"
                type="text"
                class="bg-background text-lg font-medium"
              />
            </div>

            <div class="from-primary/5 to-primary/10 mb-4 rounded-lg border bg-gradient-to-br p-4">
              <Label for="rounds" class="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:speedometer" class="text-primary" />
                Rounds (cost factor)
              </Label>
              <Input
                id="rounds"
                v-model.number="generateRounds"
                type="number"
                min="4"
                max="31"
                step="1"
                class="bg-background text-lg font-medium"
              />
              <p class="text-muted-foreground mt-1 text-sm">
                Recommended: 10-12 (higher = slower but more secure)
              </p>
              <div class="mt-2 flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm">Security level:</span>
                  <span
                    :class="{
                      'text-green-600': securityLevel >= 2,
                      'text-amber-600': securityLevel === 1,
                      'text-red-600': securityLevel === 0,
                    }"
                  >
                    {{ getSecurityLevel(generateRounds) }}
                  </span>
                </div>
                <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :style="{
                      width: `${Math.min(Math.max(((generateRounds || 4) / 31) * 100, 0), 100)}%`,
                      backgroundColor: getSecurityColor(securityLevel),
                    }"
                  ></div>
                </div>
              </div>
            </div>

            <Button
              class="h-12 w-full cursor-pointer text-lg font-semibold"
              :disabled="!generateText || loading"
              @click="generateHash"
            >
              <template v-if="loading">
                <Icon icon="svg-spinners:ring-resize" class="mr-2 h-4 w-4" />
                Generating...
              </template>
              <template v-else>
                <Icon icon="mdi:pound-box" class="mr-2" />
                Generate Hash
              </template>
            </Button>

            <div v-if="errorMessage" class="mt-2 text-sm text-red-600">
              {{ errorMessage }}
            </div>

            <div
              v-if="generatedHash"
              class="mt-4 flex flex-col gap-2 rounded-md bg-gray-100 p-3 font-mono text-sm break-words sm:flex-row sm:items-center dark:bg-gray-800"
            >
              <span class="flex-1 overflow-x-auto break-all">{{ generatedHash }}</span>
              <Button
                variant="outline"
                size="sm"
                @click="copyToClipboard(generatedHash)"
                class="w-full cursor-pointer sm:w-auto"
              >
                <Icon icon="material-symbols:content-copy" class="mr-1" />
                {{ copied ? 'Copied!' : 'Copy' }}
              </Button>
            </div>
          </TabsContent>

          <!-- Verify Tab Content -->
          <TabsContent value="verify">
            <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
              <Label for="verifyText" class="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:text" class="text-primary" />
                Original Text
              </Label>
              <Input
                id="verifyText"
                v-model="verifyText"
                placeholder="Enter original text"
                type="text"
                class="bg-background text-lg font-medium"
              />
            </div>

            <div class="bg-muted/30 hover:bg-muted/50 mb-4 rounded-lg border p-4 transition-all">
              <Label for="verifyHash" class="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon icon="mdi:pound" class="text-primary" />
                Hash
              </Label>
              <Input
                id="verifyHash"
                v-model="verifyHash"
                placeholder="Enter bcrypt hash"
                type="text"
                class="bg-background text-lg font-medium"
              />
            </div>

            <Button
              class="h-12 w-full cursor-pointer text-lg font-semibold"
              :disabled="!verifyText || !verifyHash || loading"
              @click="verifyHashFn"
            >
              <template v-if="loading">
                <Icon icon="svg-spinners:ring-resize" class="mr-2 h-4 w-4" />
                Verifying...
              </template>
              <template v-else>
                <Icon icon="mdi:shield-check" class="mr-2" />
                Verify Hash
              </template>
            </Button>
            <div
              v-if="verificationResult !== null"
              class="mt-4 text-center font-semibold"
              :class="verificationResult ? 'text-green-600' : 'text-red-600'"
            >
              {{
                verificationResult ? '✅ Hash matches the text' : '❌ Hash does NOT match the text'
              }}
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Icon } from '@iconify/vue'
import bcrypt from 'bcryptjs'

const tab = ref<'generate' | 'verify'>('generate')

const generateText = ref('')
const generateRounds = ref(10)
const generatedHash = ref('')
const errorMessage = ref('')

const verifyText = ref('')
const verifyHash = ref('')
const verificationResult = ref<boolean | null>(null)

const loading = ref(false)
const copied = ref(false)

const securityLevel = computed(() => {
  if (generateRounds.value >= 12) return 2 // Very strong
  if (generateRounds.value >= 8) return 1 // Strong
  return 0 // Weak
})

function getSecurityLevel(rounds: number): string {
  if (rounds >= 12) return 'Very strong'
  if (rounds >= 8) return 'Strong'
  return 'Weak'
}

function getSecurityColor(level: number): string {
  if (level >= 2) return '#16a34a' // green-600
  if (level === 1) return '#d97706' // amber-600
  return '#dc2626' // red-600
}

async function generateHash() {
  if (!generateText.value) return
  loading.value = true
  generatedHash.value = ''
  errorMessage.value = ''
  try {
    const salt = bcrypt.genSaltSync(generateRounds.value)
    const hash = bcrypt.hashSync(generateText.value, salt)
    generatedHash.value = hash
  } catch (e) {
    errorMessage.value = 'Failed to generate hash. Please try again.'
    generatedHash.value = ''
  } finally {
    loading.value = false
  }
}

async function verifyHashFn() {
  if (!verifyText.value || !verifyHash.value) return
  loading.value = true
  verificationResult.value = null
  try {
    const match = bcrypt.compareSync(verifyText.value, verifyHash.value)
    verificationResult.value = match
  } catch (e) {
    verificationResult.value = false
  } finally {
    loading.value = false
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<style scoped>
@media (max-width: 640px) {
  .w-full.max-w-2xl {
    max-width: 100% !important;
  }
  .font-mono {
    font-size: 0.85rem;
  }
  .p-3 {
    padding: 0.75rem !important;
  }
}
</style>
