<template>
  <div class="flex h-full w-full items-center justify-center p-8">
    <Card class="w-full max-w-4xl rounded-2xl p-8 shadow-lg">
      <CardHeader>
        <CardTitle class="mb-6 flex items-center gap-3 text-4xl font-bold">
          <Icon icon="mdi:shield-lock-outline" class="h-10 w-10 text-green-500" />
          Privacy First
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6 text-lg leading-relaxed">
        <div class="rounded-lg bg-green-50 p-6 dark:bg-green-950/30">
          <p class="text-xl font-semibold text-green-700 dark:text-green-300">
            Your data never leaves your computer. Period.
          </p>
        </div>

        <p>
          At Omniflow, we take your privacy seriously. That's why we've built all our tools to run
          <strong>100% client-side</strong> in your browser. This means:
        </p>

        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div
              class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
            >
              <Icon icon="mdi:server-off" class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 class="mb-1 font-semibold">No Server Processing</h3>
              <p class="text-gray-600 dark:text-gray-400">
                All computations happen directly in your browser. We don't have servers that process
                your data.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div
              class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
            >
              <Icon
                icon="mdi:cloud-off-outline"
                class="h-5 w-5 text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <h3 class="mb-1 font-semibold">No Data Upload</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Your files, text, and inputs are never uploaded to any server. Everything stays on
                your device.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div
              class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
            >
              <Icon icon="mdi:database-off" class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 class="mb-1 font-semibold">No Data Storage</h3>
              <p class="text-gray-600 dark:text-gray-400">
                We don't store, log, or track what you do with our tools. No databases, no tracking
                scripts.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div
              class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
            >
              <Icon icon="mdi:wifi-off" class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 class="mb-1 font-semibold">Works Offline</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Once the page is loaded, you can even disconnect from the internet and continue
                using most tools.
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-lg border-l-4 border-green-500 bg-gray-50 p-4 dark:bg-gray-900">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            <strong>Technical Note:</strong> All processing is done using JavaScript in your
            browser. The source code is open and can be inspected to verify that no data is being
            transmitted.
          </p>
        </div>

        <p>
          This approach ensures maximum privacy and security for sensitive operations like password
          generation, file encryption, or working with personal documents. You can trust that your
          data remains completely private.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
</script>
