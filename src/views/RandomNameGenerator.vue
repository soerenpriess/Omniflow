<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate random names for projects, characters, or testing
    </p>
    <Card class="route-transition-animation w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:account-question" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Random Name Generator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Options -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label>Name Type</Label>
            <Select v-model="nameType">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Name</SelectItem>
                <SelectItem value="first">First Name Only</SelectItem>
                <SelectItem value="last">Last Name Only</SelectItem>
                <SelectItem value="username">Username</SelectItem>
                <SelectItem value="business">Business Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Gender</Label>
            <Select v-model="gender">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Quantity -->
        <div class="space-y-2">
          <Label>Number of Names: {{ quantity[0] }}</Label>
          <Slider v-model="quantity" :min="1" :max="50" :step="1" />
        </div>

        <!-- Generate Button -->
        <Button @click="generateNames" class="h-12 w-full text-lg font-semibold">
          <Icon icon="mdi:refresh" class="mr-2 h-5 w-5" />
          Generate Names
        </Button>

        <!-- Results -->
        <div v-if="generatedNames.length > 0" class="space-y-2">
          <div class="flex items-center justify-between">
            <Label>Generated Names ({{ generatedNames.length }})</Label>
            <div class="flex gap-2">
              <Button @click="copyAll" size="sm" variant="outline">
                <Icon icon="mdi:content-copy" class="mr-1 h-3 w-3" />
                {{ copiedAll ? 'Copied!' : 'Copy All' }}
              </Button>
              <Button @click="clearNames" size="sm" variant="outline">
                <Icon icon="mdi:close" class="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
          </div>
          <ScrollArea class="h-64 rounded-lg border">
            <div class="space-y-1 p-2">
              <div
                v-for="(name, index) in generatedNames"
                :key="index"
                class="hover:bg-muted/50 flex items-center justify-between rounded p-2 transition-colors"
              >
                <span class="flex-1">{{ name }}</span>
                <Button size="icon" variant="ghost" class="h-7 w-7" @click="copyName(name, index)">
                  <Icon
                    :icon="copiedIndices.includes(index) ? 'mdi:check' : 'mdi:content-copy'"
                    class="h-3 w-3"
                  />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>

        <!-- Export Options -->
        <div v-if="generatedNames.length > 0" class="flex gap-2">
          <Button @click="exportAsText" variant="outline" class="flex-1">
            <Icon icon="mdi:file-document" class="mr-2 h-4 w-4" />
            Export as TXT
          </Button>
          <Button @click="exportAsJson" variant="outline" class="flex-1">
            <Icon icon="mdi:code-json" class="mr-2 h-4 w-4" />
            Export as JSON
          </Button>
          <Button @click="exportAsCsv" variant="outline" class="flex-1">
            <Icon icon="mdi:file-delimited" class="mr-2 h-4 w-4" />
            Export as CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Icon } from '@iconify/vue'

const nameType = ref('full')
const gender = ref('any')
const quantity = ref([10])
const generatedNames = ref<string[]>([])
const copiedIndices = ref<number[]>([])
const copiedAll = ref(false)

const firstNamesMale = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Richard',
  'Joseph',
  'Thomas',
  'Charles',
  'Christopher',
  'Daniel',
  'Matthew',
  'Anthony',
  'Mark',
  'Donald',
  'Steven',
  'Paul',
  'Andrew',
  'Joshua',
]
const firstNamesFemale = [
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'Elizabeth',
  'Barbara',
  'Susan',
  'Jessica',
  'Sarah',
  'Karen',
  'Nancy',
  'Lisa',
  'Betty',
  'Margaret',
  'Sandra',
  'Ashley',
  'Kimberly',
  'Emily',
  'Donna',
  'Michelle',
]
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'White',
  'Harris',
  'Thompson',
]
const businessWords = [
  'Tech',
  'Solutions',
  'Digital',
  'Global',
  'Pro',
  'Smart',
  'Cloud',
  'Innovations',
  'Consulting',
  'Systems',
  'Group',
  'Services',
  'Industries',
  'Dynamics',
  'Ventures',
  'Partners',
  'Associates',
  'Labs',
  'Studio',
  'Works',
]

function generateNames() {
  generatedNames.value = []

  for (let i = 0; i < quantity.value[0]; i++) {
    let name = ''

    switch (nameType.value) {
      case 'full':
        name = generateFullName()
        break
      case 'first':
        name = generateFirstName()
        break
      case 'last':
        name = generateLastName()
        break
      case 'username':
        name = generateUsername()
        break
      case 'business':
        name = generateBusinessName()
        break
    }

    generatedNames.value.push(name)
  }
}

function generateFirstName(): string {
  const names =
    gender.value === 'male'
      ? firstNamesMale
      : gender.value === 'female'
        ? firstNamesFemale
        : [...firstNamesMale, ...firstNamesFemale]
  return names[Math.floor(Math.random() * names.length)]
}

function generateLastName(): string {
  return lastNames[Math.floor(Math.random() * lastNames.length)]
}

function generateFullName(): string {
  return `${generateFirstName()} ${generateLastName()}`
}

function generateUsername(): string {
  const firstName = generateFirstName().toLowerCase()
  const lastName = generateLastName().toLowerCase()
  const number = Math.floor(Math.random() * 999)

  const patterns = [
    `${firstName}${lastName}`,
    `${firstName}.${lastName}`,
    `${firstName}_${lastName}`,
    `${firstName}${number}`,
    `${firstName.slice(0, 1)}${lastName}`,
    `${firstName}${lastName}${number}`,
  ]

  return patterns[Math.floor(Math.random() * patterns.length)]
}

function generateBusinessName(): string {
  const word1 = businessWords[Math.floor(Math.random() * businessWords.length)]
  const word2 = businessWords[Math.floor(Math.random() * businessWords.length)]

  const patterns = [
    `${word1} ${word2}`,
    `${word1}${word2}`,
    `${word1} ${generateLastName()}`,
    `${generateLastName()} ${word1}`,
  ]

  return patterns[Math.floor(Math.random() * patterns.length)]
}

function copyName(name: string, index: number) {
  navigator.clipboard.writeText(name)
  copiedIndices.value.push(index)
  setTimeout(() => {
    copiedIndices.value = copiedIndices.value.filter((i) => i !== index)
  }, 2000)
}

function copyAll() {
  const text = generatedNames.value.join('\n')
  navigator.clipboard.writeText(text)
  copiedAll.value = true
  setTimeout(() => {
    copiedAll.value = false
  }, 1500)
}

function clearNames() {
  generatedNames.value = []
}

function exportAsText() {
  const text = generatedNames.value.join('\n')
  downloadFile(text, 'names.txt', 'text/plain')
}

function exportAsJson() {
  const json = JSON.stringify(generatedNames.value, null, 2)
  downloadFile(json, 'names.json', 'application/json')
}

function exportAsCsv() {
  const csv = 'Name\n' + generatedNames.value.join('\n')
  downloadFile(csv, 'names.csv', 'text/csv')
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
