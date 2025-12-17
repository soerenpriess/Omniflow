<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

type SortOption = 'none' | 'name-asc' | 'name-desc' | 'favorites'
type ViewMode = 'category' | 'all'

interface Props {
  totalToolsCount: number
  viewMode: ViewMode
  sortBy: SortOption
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:viewMode': [value: ViewMode]
  'update:sortBy': [value: SortOption]
}>()

const sortOptions = [
  { value: 'none', label: 'Default Order', icon: 'mdi:sort' },
  { value: 'name-asc', label: 'Name (A-Z)', icon: 'mdi:sort-alphabetical-ascending' },
  { value: 'name-desc', label: 'Name (Z-A)', icon: 'mdi:sort-alphabetical-descending' },
  { value: 'favorites', label: 'Favorites First', icon: 'mdi:star' },
]

const currentSortLabel = computed(() => {
  return sortOptions.find((opt) => opt.value === props.sortBy)?.label || 'Sort By'
})
</script>

<template>
  <div
    class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-4 z-10 flex items-center justify-between gap-4 rounded-2xl border p-4 shadow-lg backdrop-blur"
  >
    <div class="flex items-center gap-3">
      <div class="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
        <Icon icon="mdi:view-dashboard" class="text-primary h-5 w-5" />
      </div>
      <div>
        <h2 class="text-sm font-semibold">Dashboard</h2>
        <p class="text-muted-foreground text-xs">{{ totalToolsCount }} tools available</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <!-- View Mode Toggle -->
      <div class="bg-muted flex gap-1 rounded-lg p-1">
        <Button
          @click="emit('update:viewMode', 'category')"
          :variant="viewMode === 'category' ? 'default' : 'ghost'"
          size="sm"
          class="h-8 gap-1.5 px-3"
        >
          <Icon icon="mdi:view-grid" class="h-4 w-4" />
          <span class="hidden sm:inline">Categories</span>
        </Button>
        <Button
          @click="emit('update:viewMode', 'all')"
          :variant="viewMode === 'all' ? 'default' : 'ghost'"
          size="sm"
          class="h-8 gap-1.5 px-3"
        >
          <Icon icon="mdi:view-list" class="h-4 w-4" />
          <span class="hidden sm:inline">All Tools</span>
        </Button>
      </div>

      <!-- Sort Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="sm" class="h-8 gap-2">
            <Icon icon="mdi:sort" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ currentSortLabel }}</span>
            <Icon icon="mdi:chevron-down" class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuItem
            v-for="option in sortOptions"
            :key="option.value"
            @click="emit('update:sortBy', option.value as SortOption)"
            class="cursor-pointer gap-2"
          >
            <Icon :icon="option.icon" class="h-4 w-4" />
            <span>{{ option.label }}</span>
            <Icon
              v-if="sortBy === option.value"
              icon="mdi:check"
              class="text-primary ml-auto h-4 w-4"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
