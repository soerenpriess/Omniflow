<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-8 p-6">
    <!-- Header -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <Icon icon="mdi:file-document-outline" width="32" height="32" class="text-primary" />
        <h1 class="text-4xl font-bold">Imprint</h1>
      </div>
      <p class="text-muted-foreground text-lg">Legal information and contact details</p>
    </div>

    <!-- Information according to § 5 TMG -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:information-outline" width="24" height="24" class="text-primary" />
        Information according to § 5 TMG
      </h2>
      <div class="space-y-2">
        <p class="font-semibold">Omniflow</p>
        <p class="text-muted-foreground">
          Sören Prieß<br />
          24937, Flensburg<br />
          Germany
        </p>
      </div>
    </section>

    <!-- Contact -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:email-outline" width="24" height="24" class="text-primary" />
        Contact
      </h2>
      <div class="text-muted-foreground space-y-2">
        <p>
          <span class="font-semibold">Email:</span>
          <a href="mailto:info@soerenpriess.de" class="text-primary ml-2 hover:underline">
            info@soerenpriess.de
          </a>
        </p>
        <p>
          <span class="font-semibold">Website:</span>
          <a href="https://omniflow.dev" class="text-primary ml-2 hover:underline">
            https://omniflow.dev
          </a>
        </p>
      </div>
    </section>

    <!-- Responsible for content -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:account-outline" width="24" height="24" class="text-primary" />
        Responsible for content according to § 55 Abs. 2 RStV
      </h2>
      <p class="text-muted-foreground">
        Sören Prieß<br />
        24937, Flensburg<br />
        Germany
      </p>
    </section>

    <!-- Disclaimer -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:scale-balance" width="24" height="24" class="text-primary" />
        Liability Disclaimer
      </h2>

      <div class="text-muted-foreground space-y-4">
        <div>
          <h3 class="text-foreground mb-2 font-semibold">Liability for Content</h3>
          <p class="text-sm">
            The contents of our pages were created with the greatest care. However, we cannot
            guarantee the accuracy, completeness and up-to-dateness of the content. As a service
            provider, we are responsible for our own content on these pages in accordance with
            general legislation. However, as a service provider, we are not obliged to monitor
            transmitted or stored third-party information or to investigate circumstances that
            indicate illegal activity.
          </p>
        </div>

        <div>
          <h3 class="text-foreground mb-2 font-semibold">Liability for Links</h3>
          <p class="text-sm">
            Our offer contains links to external third-party websites over whose content we have no
            influence. Therefore, we cannot accept any liability for this third-party content. The
            respective provider or operator of the pages is always responsible for the content of
            the linked pages. The linked pages were checked for possible legal violations at the
            time of linking. Illegal content was not recognizable at the time of linking.
          </p>
        </div>

        <div>
          <h3 class="text-foreground mb-2 font-semibold">Copyright</h3>
          <p class="text-sm">
            The content and works created by the site operators on these pages are subject to
            copyright law. The reproduction, editing, distribution and any kind of use outside the
            limits of copyright law require the written consent of the respective author or creator.
            This website and its content is available as open source under the terms specified in
            the LICENSE file.
          </p>
        </div>
      </div>
    </section>

    <!-- Source -->
    <section class="text-muted-foreground text-center text-sm">
      <p class="italic">
        Disclaimer template provided by
        <a
          href="https://www.e-recht24.de"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:underline"
        >
          eRecht24
        </a>
      </p>
    </section>
  </div>
</template>
