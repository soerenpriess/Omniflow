<template>
  <div class="h-full w-full overflow-y-auto p-4 sm:p-6 lg:p-8">
    <div class="mx-auto max-w-6xl space-y-8 pb-8">
      <!-- Hero Section -->
      <div class="text-center">
        <div class="mb-4 flex items-center justify-center gap-3">
          <Icon icon="mdi:apps" class="h-16 w-16 text-purple-500" />
          <h1 class="text-5xl font-bold">Omniflow</h1>
        </div>
        <p class="text-muted-foreground text-xl">Die All-in-One Werkzeugsammlung für den Alltag</p>
      </div>

      <!-- Main Introduction -->
      <Card
        class="border-purple-500/20 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-2xl">
            <Icon icon="mdi:lightbulb-on" class="h-7 w-7 text-yellow-500" />
            Was ist Omniflow?
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4 text-base leading-relaxed">
          <p>
            <strong>Omniflow</strong> ist eine umfassende Web-Plattform, die über 30 nützliche
            Online-Tools unter einem Dach vereint. Von mathematischen Berechnungen über
            Verschlüsselung bis hin zu Bildbearbeitung – alles was du für produktives Arbeiten
            brauchst, findest du hier an einem Ort.
          </p>
          <p>
            Die Idee hinter Omniflow ist simpel: Schluss mit dem ständigen Wechseln zwischen
            verschiedenen Webseiten und Anwendungen. Stattdessen bietet Omniflow eine zentrale,
            moderne Oberfläche mit allem, was du für deinen digitalen Alltag benötigst.
          </p>
        </CardContent>
      </Card>

      <!-- Philosophy -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-2xl">
            <Icon icon="mdi:heart" class="h-7 w-7 text-red-500" />
            Die Philosophie
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex gap-3">
              <div
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30"
              >
                <Icon icon="mdi:shield-lock" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 class="mb-1 font-semibold">Privacy First</h4>
                <p class="text-muted-foreground text-sm">
                  Alle Tools arbeiten zu 100% lokal in deinem Browser. Keine Daten werden an Server
                  gesendet.
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <div
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30"
              >
                <Icon icon="mdi:rocket-launch" class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 class="mb-1 font-semibold">Blitzschnell</h4>
                <p class="text-muted-foreground text-sm">
                  Keine Wartezeiten durch Server-Kommunikation. Alles läuft direkt auf deinem Gerät.
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <div
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30"
              >
                <Icon
                  icon="mdi:download-off"
                  class="h-5 w-5 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <h4 class="mb-1 font-semibold">Keine Installation</h4>
                <p class="text-muted-foreground text-sm">
                  Einfach Browser öffnen und loslegen. Kein Download, keine Registrierung nötig.
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <div
                class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30"
              >
                <Icon icon="mdi:cloud-off" class="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 class="mb-1 font-semibold">Offline-fähig</h4>
                <p class="text-muted-foreground text-sm">
                  Einmal geladen, funktionieren die meisten Tools auch ohne Internetverbindung.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Features Overview -->
      <div class="space-y-4">
        <h2 class="text-center text-3xl font-bold">Was Omniflow kann</h2>
        <p class="text-muted-foreground text-center">
          Über 30 sorgfältig ausgewählte Tools in 5 Kategorien
        </p>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Calculators -->
          <Card class="transition-all hover:border-blue-500/50 hover:shadow-lg">
            <CardHeader>
              <div class="mb-2 flex items-center gap-2">
                <Icon icon="fa6-solid:calculator" class="h-6 w-6 text-blue-500" />
                <CardTitle class="text-lg">Calculators</CardTitle>
              </div>
              <p class="text-muted-foreground text-sm">9 verschiedene Rechner</p>
            </CardHeader>
            <CardContent>
              <ul class="space-y-1.5 text-sm">
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-blue-500" />
                  Basis-Taschenrechner
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-blue-500" />
                  Einheitenumrechner
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-blue-500" />
                  Währungsrechner
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-blue-500" />
                  Krypto-Converter
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-blue-500" />
                  Prozent-, BMI-, Datums-, Kredit- & Trinkgeld-Rechner
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Cryptography -->
          <Card class="transition-all hover:border-purple-500/50 hover:shadow-lg">
            <CardHeader>
              <div class="mb-2 flex items-center gap-2">
                <Icon icon="mdi:shield-key" class="h-6 w-6 text-purple-500" />
                <CardTitle class="text-lg">Kryptographie</CardTitle>
              </div>
              <p class="text-muted-foreground text-sm">5 Sicherheits-Tools</p>
            </CardHeader>
            <CardContent>
              <ul class="space-y-1.5 text-sm">
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-purple-500" />
                  Passwort-Generator
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-purple-500" />
                  Bcrypt Hash Generator
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-purple-500" />
                  SHA Hash Generator
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-purple-500" />
                  AES Verschlüsselung
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-purple-500" />
                  Base64 Encoder/Decoder
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Image Tools -->
          <Card class="transition-all hover:border-yellow-500/50 hover:shadow-lg">
            <CardHeader>
              <div class="mb-2 flex items-center gap-2">
                <Icon icon="mdi:image-multiple" class="h-6 w-6 text-yellow-500" />
                <CardTitle class="text-lg">Bild-Werkzeuge</CardTitle>
              </div>
              <p class="text-muted-foreground text-sm">3 Bildbearbeitungs-Tools</p>
            </CardHeader>
            <CardContent>
              <ul class="space-y-1.5 text-sm">
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-yellow-500" />
                  Bild-Kompressor
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-yellow-500" />
                  Crop & Rotate
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-yellow-500" />
                  GIF Frame Extractor
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Text Tools -->
          <Card class="transition-all hover:border-green-500/50 hover:shadow-lg">
            <CardHeader>
              <div class="mb-2 flex items-center gap-2">
                <Icon icon="mdi:text-box-multiple" class="h-6 w-6 text-green-500" />
                <CardTitle class="text-lg">Text-Werkzeuge</CardTitle>
              </div>
              <p class="text-muted-foreground text-sm">6 Text-Tools</p>
            </CardHeader>
            <CardContent>
              <ul class="space-y-1.5 text-sm">
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-green-500" />
                  Wörter & Zeichen zählen
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-green-500" />
                  Lorem Ipsum Generator
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-green-500" />
                  Text-Manipulation
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-green-500" />
                  Duplikate entfernen
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-green-500" />
                  JSON Formatter
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-green-500" />
                  Text-Diff Tool
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Other Tools (spans 2 columns on larger screens) -->
          <Card
            class="transition-all hover:border-orange-500/50 hover:shadow-lg sm:col-span-2 lg:col-span-1"
          >
            <CardHeader>
              <div class="mb-2 flex items-center gap-2">
                <Icon icon="mdi:tools" class="h-6 w-6 text-orange-500" />
                <CardTitle class="text-lg">Weitere Tools</CardTitle>
              </div>
              <p class="text-muted-foreground text-sm">5 zusätzliche Helfer</p>
            </CardHeader>
            <CardContent>
              <ul class="space-y-1.5 text-sm">
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-orange-500" />
                  QR-Code Generator
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-orange-500" />
                  Glücksrad
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-orange-500" />
                  Farbpaletten-Generator
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-orange-500" />
                  Farbwähler
                </li>
                <li class="flex items-center gap-2">
                  <Icon icon="mdi:check" class="h-4 w-4 text-orange-500" />
                  Kontrast-Prüfer
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Technical Details -->
      <Card class="border-purple-500/20">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-2xl">
            <Icon icon="mdi:code-braces" class="h-7 w-7 text-purple-500" />
            Technologie
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-muted-foreground">
            Omniflow wurde mit modernsten Web-Technologien entwickelt, um eine schnelle,
            zuverlässige und sichere Erfahrung zu bieten:
          </p>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-lg border p-3 text-center">
              <Icon icon="mdi:vuejs" class="mx-auto mb-2 h-8 w-8 text-green-500" />
              <p class="font-semibold">Vue 3</p>
              <p class="text-muted-foreground text-xs">Framework</p>
            </div>
            <div class="rounded-lg border p-3 text-center">
              <Icon icon="mdi:language-typescript" class="mx-auto mb-2 h-8 w-8 text-blue-500" />
              <p class="font-semibold">TypeScript</p>
              <p class="text-muted-foreground text-xs">Type-Safety</p>
            </div>
            <div class="rounded-lg border p-3 text-center">
              <Icon icon="mdi:tailwind" class="mx-auto mb-2 h-8 w-8 text-cyan-500" />
              <p class="font-semibold">Tailwind CSS</p>
              <p class="text-muted-foreground text-xs">Styling</p>
            </div>
            <div class="rounded-lg border p-3 text-center">
              <Icon icon="mdi:lightning-bolt" class="mx-auto mb-2 h-8 w-8 text-yellow-500" />
              <p class="font-semibold">Vite</p>
              <p class="text-muted-foreground text-xs">Build Tool</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Features Highlight -->
      <Card class="bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-2xl">
            <Icon icon="mdi:star-circle" class="h-7 w-7 text-yellow-500" />
            Besondere Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex gap-3">
              <Icon icon="mdi:star" class="h-6 w-6 flex-shrink-0 text-yellow-500" />
              <div>
                <h4 class="mb-1 font-semibold">Favoriten-System</h4>
                <p class="text-muted-foreground text-sm">
                  Markiere deine meistgenutzten Tools als Favoriten für schnellen Zugriff.
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <Icon icon="mdi:theme-light-dark" class="h-6 w-6 flex-shrink-0 text-purple-500" />
              <div>
                <h4 class="mb-1 font-semibold">Dark Mode & Custom Themes</h4>
                <p class="text-muted-foreground text-sm">
                  Wähle zwischen Hell, Dunkel oder erstelle deine eigenen Farb-Themes.
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <Icon icon="mdi:keyboard" class="h-6 w-6 flex-shrink-0 text-blue-500" />
              <div>
                <h4 class="mb-1 font-semibold">Keyboard Shortcuts</h4>
                <p class="text-muted-foreground text-sm">
                  Passe Tastatur-Kürzel nach deinen Wünschen an und arbeite effizienter.
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <Icon icon="mdi:responsive" class="h-6 w-6 flex-shrink-0 text-green-500" />
              <div>
                <h4 class="mb-1 font-semibold">Responsive Design</h4>
                <p class="text-muted-foreground text-sm">
                  Funktioniert perfekt auf Desktop, Tablet und Smartphone.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Call to Action -->
      <Card class="border-purple-500 bg-gradient-to-br from-purple-500/10 to-transparent">
        <CardContent class="p-8 text-center">
          <Icon icon="mdi:rocket-launch" class="mx-auto mb-4 h-12 w-12 text-purple-500" />
          <h3 class="mb-2 text-2xl font-bold">Bereit loszulegen?</h3>
          <p class="text-muted-foreground mb-6">
            Entdecke alle Tools und finde heraus, wie Omniflow deinen Alltag vereinfachen kann.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/"
              class="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-600"
            >
              <Icon icon="mdi:apps" class="h-5 w-5" />
              Alle Tools ansehen
            </a>
            <a
              href="/settings"
              class="inline-flex items-center gap-2 rounded-lg border border-purple-500 px-6 py-3 font-semibold text-purple-500 transition-colors hover:bg-purple-500/10"
            >
              <Icon icon="mdi:cog" class="h-5 w-5" />
              Einstellungen
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
</script>
