<template>
  <div class="flex h-full w-full items-center justify-center p-8">
    <Card class="w-full max-w-4xl rounded-2xl p-8 shadow-lg">
      <CardHeader>
        <CardTitle class="mb-6 flex items-center gap-3 text-4xl font-bold">
          <Icon icon="mdi:open-source-initiative" class="h-10 w-10 text-blue-500" />
          Free & Open Source
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6 text-lg leading-relaxed">
        <p>
          Omniflow is completely <strong>free to use</strong> with no hidden costs, premium tiers,
          or paywalls. We believe that useful tools should be accessible to everyone.
        </p>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="rounded-lg bg-blue-50 p-6 dark:bg-blue-950/30">
            <div class="mb-3 flex items-center gap-2">
              <Icon icon="mdi:currency-usd-off" class="h-6 w-6 text-blue-500" />
              <h3 class="text-xl font-semibold text-blue-700 dark:text-blue-300">100% Free</h3>
            </div>
            <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>✓ No registration required</li>
              <li>✓ No credit card needed</li>
              <li>✓ No usage limits</li>
              <li>✓ No ads or tracking</li>
            </ul>
          </div>

          <div class="rounded-lg bg-blue-50 p-6 dark:bg-blue-950/30">
            <div class="mb-3 flex items-center gap-2">
              <Icon icon="mdi:github" class="h-6 w-6 text-blue-500" />
              <h3 class="text-xl font-semibold text-blue-700 dark:text-blue-300">Open Source</h3>
            </div>
            <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>✓ Source code available</li>
              <li>✓ Transparent development</li>
              <li>✓ Community driven</li>
              <li>✓ Contributions welcome</li>
            </ul>
          </div>
        </div>

        <div
          class="rounded-lg border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800 dark:bg-blue-950/20"
        >
          <h3 class="mb-3 text-xl font-semibold">Why Open Source?</h3>
          <p class="mb-3 text-gray-700 dark:text-gray-300">
            Open source software promotes transparency, security, and collaboration. By making our
            code public, we allow:
          </p>
          <ul class="space-y-2 text-gray-700 dark:text-gray-300">
            <li class="flex items-start gap-2">
              <Icon icon="mdi:eye" class="mt-1 h-5 w-5 text-blue-500" />
              <span
                ><strong>Transparency:</strong> Anyone can inspect the code to verify it does what
                we claim</span
              >
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="mdi:security" class="mt-1 h-5 w-5 text-blue-500" />
              <span
                ><strong>Security:</strong> More eyes on the code means better security and faster
                bug fixes</span
              >
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="mdi:account-group" class="mt-1 h-5 w-5 text-blue-500" />
              <span
                ><strong>Community:</strong> Developers can contribute improvements and new
                features</span
              >
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="mdi:school" class="mt-1 h-5 w-5 text-blue-500" />
              <span><strong>Learning:</strong> Others can learn from and build upon our work</span>
            </li>
          </ul>
        </div>

        <div
          class="flex flex-col gap-4 rounded-lg bg-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800"
        >
          <div>
            <h3 class="mb-1 text-xl font-semibold">View on GitHub</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Check out the source code, report issues, or contribute
            </p>
          </div>
          <Button
            as="a"
            href="https://github.com/soerenpriess/Omniflow"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2"
          >
            <Icon icon="mdi:github" class="h-5 w-5" />
            Visit Repository
          </Button>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400">
          By using Omniflow, you support the open source community and the idea that quality
          software should be accessible to everyone, everywhere.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
</script>
