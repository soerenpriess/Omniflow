<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-8 p-6">
    <!-- Header -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <Icon icon="mdi:information-outline" width="32" height="32" class="text-primary" />
        <h1 class="text-4xl font-bold">About Omniflow</h1>
      </div>
      <p class="text-muted-foreground text-lg">
        Your comprehensive all-in-one tool suite for everyday tasks
      </p>
    </div>

    <!-- Mission -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:target" width="24" height="24" class="text-primary" />
        Our Mission
      </h2>
      <p class="text-muted-foreground">
        Omniflow was created to provide developers, students, and professionals with a fast,
        reliable, and privacy-focused collection of essential tools. All in one place, all running
        in your browser, with no data leaving your device.
      </p>
    </section>

    <!-- Features -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:star-outline" width="24" height="24" class="text-primary" />
        What Makes Us Different
      </h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex gap-3">
          <Icon icon="mdi:shield-check" width="24" height="24" class="text-primary flex-shrink-0" />
          <div>
            <h3 class="font-semibold">Privacy First</h3>
            <p class="text-muted-foreground text-sm">
              All processing happens locally in your browser. No data is sent to external servers.
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <Icon icon="mdi:flash" width="24" height="24" class="text-primary flex-shrink-0" />
          <div>
            <h3 class="font-semibold">Blazing Fast</h3>
            <p class="text-muted-foreground text-sm">
              Built with Vue 3 and Vite for optimal performance and instant tool responses.
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <Icon
            icon="mdi:open-source-initiative"
            width="24"
            height="24"
            class="text-primary flex-shrink-0"
          />
          <div>
            <h3 class="font-semibold">Open Source</h3>
            <p class="text-muted-foreground text-sm">
              Transparently developed and available on GitHub for community contributions.
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <Icon
            icon="mdi:currency-usd-off"
            width="24"
            height="24"
            class="text-primary flex-shrink-0"
          />
          <div>
            <h3 class="font-semibold">Free Forever</h3>
            <p class="text-muted-foreground text-sm">
              No subscriptions, no paywalls, no account required. Just tools when you need them.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:code-tags" width="24" height="24" class="text-primary" />
        Technology Stack
      </h2>
      <p class="text-muted-foreground">
        Omniflow is built with modern web technologies to ensure the best user experience:
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">Vue 3</span>
        <span class="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">TypeScript</span>
        <span class="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">Vite</span>
        <span class="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">Tailwind CSS</span>
        <span class="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">Radix Vue</span>
      </div>
    </section>

    <!-- Contact -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:github" width="24" height="24" class="text-primary" />
        Open Source
      </h2>
      <p class="text-muted-foreground">
        Omniflow is open source and available on GitHub. Contributions, bug reports, and feature
        requests are always welcome!
      </p>
      <a
        href="https://github.com/soerenpriess/Omniflow"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors"
      >
        <Icon icon="mdi:github" width="20" height="20" />
        View on GitHub
      </a>
    </section>

    <!-- Version -->
    <section class="text-muted-foreground text-center text-sm">
      <p>Omniflow © {{ new Date().getFullYear() }} • Made with ❤️ for the community</p>
    </section>
  </div>
</template>
