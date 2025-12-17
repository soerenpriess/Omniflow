<template>
  <div class="flex h-full w-full items-center justify-center p-8">
    <Card class="w-full max-w-6xl rounded-2xl p-8 shadow-lg">
      <CardHeader>
        <CardTitle class="mb-6 flex items-center gap-3 text-4xl font-bold">
          <Icon icon="mdi:feature-search-outline" class="h-10 w-10 text-orange-500" />
          Features & Tools
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-8 text-lg leading-relaxed">
        <p class="text-xl">
          Discover the wide range of tools available in Omniflow, organized into convenient
          categories:
        </p>

        <!-- PDF Tools -->
        <div
          class="rounded-lg border-2 border-red-200 bg-red-50/50 p-6 dark:border-red-800 dark:bg-red-950/20"
        >
          <div class="mb-4 flex items-center gap-3">
            <Icon icon="mdi:file-pdf-box" class="h-8 w-8 text-red-500" />
            <h3 class="text-2xl font-semibold text-red-700 dark:text-red-300">PDF Tools</h3>
          </div>
          <p class="mb-3 text-gray-700 dark:text-gray-300">
            Work with PDF documents directly in your browser
          </p>
          <ul
            class="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2 dark:text-gray-400"
          >
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-red-500" />
              PDF Merger - Combine multiple PDFs
            </li>
          </ul>
        </div>

        <!-- Calculators -->
        <div
          class="rounded-lg border-2 border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800 dark:bg-blue-950/20"
        >
          <div class="mb-4 flex items-center gap-3">
            <Icon icon="mdi:calculator" class="h-8 w-8 text-blue-500" />
            <h3 class="text-2xl font-semibold text-blue-700 dark:text-blue-300">Calculators</h3>
          </div>
          <p class="mb-3 text-gray-700 dark:text-gray-300">
            Powerful calculators for everyday needs
          </p>
          <ul
            class="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2 dark:text-gray-400"
          >
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-blue-500" />
              Basic Calculator
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-blue-500" />
              BMI Calculator
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-blue-500" />
              Currency Converter
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-blue-500" />
              Crypto Converter
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-blue-500" />
              Unit Converter
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-blue-500" />
              Percentage Calculator
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-blue-500" />
              Tip Calculator
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-blue-500" />
              Loan/Mortgage Calculator
            </li>
          </ul>
        </div>

        <!-- Cryptography -->
        <div
          class="rounded-lg border-2 border-green-200 bg-green-50/50 p-6 dark:border-green-800 dark:bg-green-950/20"
        >
          <div class="mb-4 flex items-center gap-3">
            <Icon icon="mdi:lock" class="h-8 w-8 text-green-500" />
            <h3 class="text-2xl font-semibold text-green-700 dark:text-green-300">Cryptography</h3>
          </div>
          <p class="mb-3 text-gray-700 dark:text-gray-300">
            Security and encryption tools for your sensitive data
          </p>
          <ul
            class="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2 dark:text-gray-400"
          >
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-green-500" />
              Password Generator
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-green-500" />
              AES Encryption/Decryption
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-green-500" />
              Base64 Encoder/Decoder
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-green-500" />
              SHA Hash Generator
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-green-500" />
              Bcrypt Generator
            </li>
          </ul>
        </div>

        <!-- Image Tools -->
        <div
          class="rounded-lg border-2 border-orange-200 bg-orange-50/50 p-6 dark:border-orange-800 dark:bg-orange-950/20"
        >
          <div class="mb-4 flex items-center gap-3">
            <Icon icon="mdi:image" class="h-8 w-8 text-orange-500" />
            <h3 class="text-2xl font-semibold text-orange-700 dark:text-orange-300">Image Tools</h3>
          </div>
          <p class="mb-3 text-gray-700 dark:text-gray-300">
            Edit and manipulate images without uploading
          </p>
          <ul
            class="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2 dark:text-gray-400"
          >
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-orange-500" />
              Image Compressor
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-orange-500" />
              Image Crop & Rotate
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-orange-500" />
              GIF Frame Extractor
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-orange-500" />
              Video Trim Tool
            </li>
          </ul>
        </div>

        <!-- Text Tools -->
        <div
          class="rounded-lg border-2 border-purple-200 bg-purple-50/50 p-6 dark:border-purple-800 dark:bg-purple-950/20"
        >
          <div class="mb-4 flex items-center gap-3">
            <Icon icon="mdi:text" class="h-8 w-8 text-purple-500" />
            <h3 class="text-2xl font-semibold text-purple-700 dark:text-purple-300">Text Tools</h3>
          </div>
          <p class="mb-3 text-gray-700 dark:text-gray-300">Manipulate and analyze text content</p>
          <ul
            class="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2 dark:text-gray-400"
          >
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-purple-500" />
              Word Counter
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-purple-500" />
              Text Diff Tool
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-purple-500" />
              JSON Formatter
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-purple-500" />
              Lorem Ipsum Generator
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-purple-500" />
              Duplicate Line Remover
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-purple-500" />
              Text Tools (various)
            </li>
          </ul>
        </div>

        <!-- Other Tools -->
        <div
          class="rounded-lg border-2 border-yellow-200 bg-yellow-50/50 p-6 dark:border-yellow-800 dark:bg-yellow-950/20"
        >
          <div class="mb-4 flex items-center gap-3">
            <Icon icon="mdi:tools" class="h-8 w-8 text-yellow-600" />
            <h3 class="text-2xl font-semibold text-yellow-700 dark:text-yellow-300">Other Tools</h3>
          </div>
          <p class="mb-3 text-gray-700 dark:text-gray-300">Miscellaneous useful utilities</p>
          <ul
            class="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2 dark:text-gray-400"
          >
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-yellow-600" />
              QR Code Generator
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-yellow-600" />
              Color Picker
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-yellow-600" />
              Color Palette Generator
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-yellow-600" />
              Contrast Checker
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="mdi:check" class="text-yellow-600" />
              Spinning Wheel
            </li>
          </ul>
        </div>

        <div class="rounded-lg bg-gray-100 p-6 text-center dark:bg-gray-800">
          <p class="text-lg font-semibold">
            🚀 More tools are being added regularly! Check back often for updates.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
</script>
