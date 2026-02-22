<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="container mx-auto max-w-4xl space-y-8 p-6">
    <!-- Header -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <Icon icon="mdi:shield-lock-outline" width="32" height="32" class="text-primary" />
        <h1 class="text-4xl font-bold">Privacy Policy</h1>
      </div>
      <p class="text-muted-foreground text-lg">How we protect your privacy and handle your data</p>
      <p class="text-muted-foreground text-sm italic">
        Last updated: {{ new Date().toLocaleDateString() }}
      </p>
    </div>

    <!-- Privacy First -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:shield-check" width="24" height="24" class="text-primary" />
        Privacy-First Approach
      </h2>
      <p class="text-muted-foreground">
        Omniflow is designed with privacy as a core principle. All tools run entirely in your
        browser, and <strong>no data is transmitted to our servers</strong>. Your inputs, results,
        and personal information remain on your device.
      </p>
    </section>

    <!-- Data Collection -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:database-outline" width="24" height="24" class="text-primary" />
        What Data We Collect
      </h2>

      <div class="space-y-4">
        <div>
          <h3 class="mb-2 font-semibold">Local Storage</h3>
          <p class="text-muted-foreground text-sm">
            We use your browser's local storage to save your preferences (theme, favorites, keyboard
            shortcuts). This data never leaves your device and can be cleared at any time through
            your browser settings or our Settings page.
          </p>
        </div>

        <div>
          <h3 class="mb-2 font-semibold">Analytics (Optional)</h3>
          <p class="text-muted-foreground text-sm">
            We may use Google Analytics or similar services to understand how our tools are used.
            This helps us improve the user experience. You can opt-out using browser extensions like
            uBlock Origin or by enabling Do Not Track in your browser.
          </p>
        </div>

        <div>
          <h3 class="mb-2 font-semibold">Advertising (AdSense)</h3>
          <p class="text-muted-foreground text-sm">
            This website displays advertisements via Google AdSense to support continued
            development. Google AdSense may use cookies to display personalized ads. You can learn
            more about how Google uses data in their
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              Privacy & Terms </a
            >.
          </p>
        </div>
      </div>
    </section>

    <!-- Data Processing -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:cog-outline" width="24" height="24" class="text-primary" />
        How We Process Data
      </h2>
      <div class="text-muted-foreground space-y-2">
        <p class="text-sm">
          ✓ <strong>Calculators & Converters:</strong> All calculations happen in your browser. No
          data is sent to servers.
        </p>
        <p class="text-sm">
          ✓ <strong>Text Tools:</strong> Text processing is done locally. Your text never leaves
          your device.
        </p>
        <p class="text-sm">
          ✓ <strong>Image Tools:</strong> Images are processed entirely in your browser using Canvas
          API.
        </p>
        <p class="text-sm">
          ✓ <strong>Cryptography Tools:</strong> Encryption and hashing happen locally for maximum
          security.
        </p>
        <p class="text-sm">
          ✓ <strong>Currency/Crypto Conversion:</strong> Exchange rates are fetched from public
          APIs, but your conversion amounts are not transmitted.
        </p>
      </div>
    </section>

    <!-- Cookies -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:cookie-outline" width="24" height="24" class="text-primary" />
        Cookies & Tracking
      </h2>
      <p class="text-muted-foreground text-sm">
        This website uses minimal cookies necessary for functionality and advertising:
      </p>
      <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-sm">
        <li>
          <strong>Essential cookies:</strong> Required for local storage functionality (theme,
          favorites)
        </li>
        <li>
          <strong>Advertising cookies (Google AdSense):</strong> Used to display relevant
          advertisements
        </li>
        <li>
          <strong>Analytics cookies (optional):</strong> Help us understand usage patterns to
          improve the service
        </li>
      </ul>
      <p class="text-muted-foreground mt-4 text-sm">
        You can disable cookies in your browser settings, though this may affect some functionality.
      </p>
    </section>

    <!-- Third-Party Services -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:link-variant" width="24" height="24" class="text-primary" />
        Third-Party Services
      </h2>
      <p class="text-muted-foreground mb-4 text-sm">We use the following third-party services:</p>
      <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-sm">
        <li>
          <strong>Google AdSense:</strong> For displaying advertisements (
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline"
          >
            Privacy Policy
          </a>
          )
        </li>
        <li>
          <strong>Exchange Rate APIs:</strong> For currency and cryptocurrency conversion data
        </li>
        <li><strong>CDNs:</strong> For faster loading of resources (fonts, libraries)</li>
      </ul>
    </section>

    <!-- Your Rights -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:account-check-outline" width="24" height="24" class="text-primary" />
        Your Rights (GDPR)
      </h2>
      <p class="text-muted-foreground text-sm">
        Under the General Data Protection Regulation (GDPR), you have the right to:
      </p>
      <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-sm">
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Object to data processing</li>
        <li>Data portability</li>
      </ul>
      <p class="text-muted-foreground mt-4 text-sm">
        Since all data is stored locally on your device, you have full control and can clear it
        anytime through your browser settings or our Settings page.
      </p>
    </section>

    <!-- Data Security -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:security" width="24" height="24" class="text-primary" />
        Data Security
      </h2>
      <p class="text-muted-foreground text-sm">
        We take security seriously. This website is served over HTTPS to ensure encrypted
        communication. Since all processing happens in your browser, your sensitive data (passwords,
        private keys, personal information) never leaves your device.
      </p>
    </section>

    <!-- Contact -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:email-outline" width="24" height="24" class="text-primary" />
        Contact Us
      </h2>
      <p class="text-muted-foreground text-sm">
        If you have any questions about this Privacy Policy, please contact us at:
        <a href="mailto:info@soerenpriess.de" class="text-primary ml-1 hover:underline">
          info@soerenpriess.de
        </a>
      </p>
    </section>

    <!-- Changes -->
    <section class="bg-card space-y-4 rounded-lg border p-6">
      <h2 class="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="mdi:update" width="24" height="24" class="text-primary" />
        Changes to This Policy
      </h2>
      <p class="text-muted-foreground text-sm">
        We may update this Privacy Policy from time to time. The latest version will always be
        available on this page with the "Last updated" date at the top.
      </p>
    </section>
  </div>
</template>
