<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { getCategories } from '@/data/tools/_index'
import { Icon } from '@iconify/vue'
import { KeyboardService } from '@/services/keyboardService'

const isCommandOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const searchTerm = ref('')
const favoriteCards = ref<any[]>([])
const shortcutText = ref('')

const allCategories = computed(() => getCategories())
const router = useRouter()
const hoveredCard = ref<string | null>(null)

// Load shortcut from localStorage
function loadShortcutText() {
  const saved = localStorage.getItem('keyboardShortcuts')

  // Default shortcut: Ctrl + K
  let searchShortcut = { key: 'k', ctrl: true, shift: false, alt: false }

  // Override with saved shortcut if available
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.search) {
        searchShortcut = parsed.search
      }
    } catch {
      console.error(
        'Failed to parse keyboard shortcut for search from localStorage! Please reset your shortcuts in settings.',
      )
    }
  }

  shortcutText.value = KeyboardService.getShortcutDisplay(searchShortcut)
}

// Open command dialog and load favorites
function openCommand() {
  isCommandOpen.value = true
  const saved = localStorage.getItem('favoriteCards')
  if (saved) favoriteCards.value = JSON.parse(saved)
}

// Handle openSearch event to toggle command dialog
function handleOpenSearch() {
  if (isCommandOpen.value) {
    isCommandOpen.value = false
  } else {
    openCommand()
  }
}

// Handle click on input to open command dialog
function handleInputClick() {
  openCommand()
}

onMounted(() => {
  // Listen for openSearch event from keyboardService
  window.addEventListener('openSearch', handleOpenSearch)

  // Listen for shortcut updates
  window.addEventListener('shortcutsUpdated', loadShortcutText)

  // Load favorite cards initially
  const saved = localStorage.getItem('favoriteCards')
  if (saved) favoriteCards.value = JSON.parse(saved)

  // Load initial shortcut text
  loadShortcutText()
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('openSearch', handleOpenSearch)
  window.removeEventListener('shortcutsUpdated', loadShortcutText)
})

const filteredCategories = computed(() => {
  // if no search term, return all categories with active tools
  if (!searchTerm.value)
    return allCategories.value.filter(
      (category) => category.cards.filter((tool) => tool.isActive).length,
    )

  const term = searchTerm.value.toLowerCase()

  // Filter cards in each category
  const filtered = allCategories.value.map((category) => {
    const filteredCards = category.cards.filter((tool) => {
      const titleMatch = tool.title.toLowerCase().includes(term) // check if title matches
      const descriptionMatch = tool.description.toLowerCase().includes(term) // check if description matches
      const categoryMatch = category.title.toLowerCase().includes(term) // check if category matches
      return tool.isActive && (titleMatch || descriptionMatch || categoryMatch)
    })

    // return current category with all matching cards from this category
    return {
      ...category,
      cards: filteredCards,
    }
  })

  return filtered.filter(({ cards }) => cards.length > 0)
})

function handleSelect(tool: any) {
  isCommandOpen.value = false
  searchTerm.value = ''
  router.push(tool.path)
}

function getTripleWaveBackground(colors: string[], heights: number[], amplitudes: number[]) {
  const svgs = colors.map((color, i) => {
    const height = heights[i]
    const amplitude = amplitudes[i]
    const cp1 = 360 + i * 50
    const cp2 = 1080 - i * 50
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${height}" viewBox="0 0 1440 ${height}" preserveAspectRatio="none">
        <path fill="${color}" d="
          M0,${height / 2}
          C${cp1},${height / 2 + amplitude} ${cp2},${height / 2 - amplitude} 1440,${height / 2}
          L1440,${height}
          L0,${height}
          Z
        "/>
      </svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  })
  return svgs.join(', ')
}
</script>

<template>
  <form>
    <SidebarGroup class="py-0">
      <SidebarGroupContent class="relative">
        <Label for="search" class="sr-only">Search</Label>
        <SidebarInput
          ref="searchInput"
          id="search"
          placeholder="Search the tools..."
          class="pr-20 pl-8"
          @click="handleInputClick"
          readonly
        />
        <div class="pointer-events-none absolute inset-y-0 left-2 flex items-center">
          <Search class="size-4 opacity-50 select-none" />
        </div>
        <Badge
          variant="outline"
          class="pointer-events-none absolute inset-y-0 right-2 my-auto flex h-6 w-auto items-center gap-1 text-xs"
        >
          <span>{{ shortcutText }}</span>
        </Badge>
      </SidebarGroupContent>
    </SidebarGroup>
  </form>

  <CommandDialog v-model:open="isCommandOpen">
    <CommandInput placeholder="Search the tools..." v-model="searchTerm" />
    <div class="flex flex-wrap gap-2 p-2">
      <div
        v-for="(element, index) in favoriteCards"
        :key="element.card.title"
        class="bg-card border-secondary flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-1 transition-all ease-in-out"
        :style="{
          backgroundImage: getTripleWaveBackground(
            element.category.waveDesign.waveColors,
            element.category.waveDesign.waveHeights,
            element.category.waveDesign.waveAmplitudes,
          ),
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          backgroundSize: '200% 100%',
          '--hover-ring-color': element.category.hoverColor,
        }"
        @mouseover="hoveredCard = `${element.category.title}-${index}`"
        @mouseleave="hoveredCard = null"
        @click="element.card.path && router.push(element.card.path) && (isCommandOpen = false)"
        :class="{
          'custom-ring-1 scale-105': hoveredCard === `${element.category.title}-${index}`,
        }"
      >
        <Icon
          :icon="element.card.icon"
          class="text-opacity-80 h-6 w-6 text-[color:var(--hover-color)]"
        />
      </div>
    </div>

    <hr />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <template v-for="category in filteredCategories" :key="category.title">
        <CommandGroup :heading="category.title">
          <CommandItem
            v-for="tool in category.cards"
            :key="tool.title"
            :value="tool.title"
            :disabled="!tool.isActive"
            @select="() => handleSelect(tool)"
          >
            <div
              class="h-4 w-0.5 flex-shrink-0 rounded-full"
              :style="{
                background: `linear-gradient(to bottom, ${category.hoverColor}, ${category.hoverColor}99)`,
              }"
            ></div>
            <Icon :icon="tool.icon" class="mr-2 text-lg" />
            <span class="max-w-md truncate font-medium">{{ tool.title }}</span>
            <span class="text-muted-foreground truncate text-xs">{{ tool.description }}</span>
          </CommandItem>
        </CommandGroup>
      </template>
    </CommandList>
  </CommandDialog>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 12px;
  background: #111114;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #742d31 0%, #a53c3f 100%);
  border-radius: 6px;
  border: 3px solid #111114;
}

::-webkit-scrollbar-track {
  background: #111114;
  border-radius: 6px;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #742d31 #111114;
}
</style>
