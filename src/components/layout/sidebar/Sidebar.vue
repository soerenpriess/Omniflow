<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch } from 'vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getCategories } from '@/data/tools/_index'
import NavMain from '@/components/layout/sidebar/components/SidebarContent.vue'
import { Icon } from '@iconify/vue'
import type { Category } from '@/types/Category'
import SearchForm from '@/components/layout/sidebar/components/SearchForm.vue'

const navCategories = ref<{
  favorites: Category[]
  info: Category[]
  tools: Category[]
}>({
  favorites: [],
  info: [],
  tools: [],
})
const favoriteCards = ref<Category>({
  title: 'Favorites',
  hoverColor: '#FFD700',
  waveDesign: {
    waveColors: [],
    waveHeights: [],
    waveAmplitudes: [],
  },
  cards: [],
})
const favoriteCardsUpdated = inject('favoriteCardsUpdated', ref(false)) as ReturnType<typeof ref> // reactive ref to track updates

// Update favoriteCards based on localStorage
function updateFavorites() {
  const rawFavoriteCards = localStorage.getItem('favoriteCards')
  let parsedFavoriteCards: any[] = []
  favoriteCards.value.cards = []

  if (rawFavoriteCards) {
    try {
      parsedFavoriteCards = JSON.parse(rawFavoriteCards)

      parsedFavoriteCards.forEach((item) => {
        if (item.category && item.card) {
          favoriteCards.value.cards.push(item.card)
        }
      })
    } catch (error) {
      console.error('Error parsing favorite cards:', error)
    }
  }
}

function generateNavCategories() {
  const categories = getCategories()
  updateFavorites()

  const favoriteCategory = favoriteCards.value.cards.length ? favoriteCards.value : null
  const infoCategory = categories.find((cat) => cat.title === 'Welcome to Omniflow')
  const toolCategories = categories.filter((cat) => cat.title !== 'Welcome to Omniflow')

  navCategories.value = {
    favorites: favoriteCategory ? [favoriteCategory] : [],
    info: infoCategory ? [infoCategory] : [],
    tools: toolCategories,
  }
}

function onStorageChange(event: StorageEvent) {
  if (event.key === 'favoriteCards') {
    updateFavorites()
    generateNavCategories()
  }
}

watch(favoriteCardsUpdated, () => {
  updateFavorites()
  generateNavCategories()
})

onMounted(() => {
  generateNavCategories()
  window.addEventListener('storage', onStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', onStorageChange)
})

const getNavCategories = computed(() => navCategories.value)
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <div
        class="hover:bg-secondary flex w-full cursor-pointer items-center justify-center rounded-lg p-2 transition-all ease-in-out hover:scale-105"
        @click="$router.push('/')"
      >
        <img src="@/assets/logo.png" alt="Omniflow Logo" class="mr-2 h-6 w-6" />
        <p class="text-xl">Omniflow</p>
      </div>
      <SearchForm />
    </SidebarHeader>
    <SidebarContent>
      <NavMain
        v-if="getNavCategories.favorites.length > 0"
        :items="getNavCategories.favorites"
        label="Favorites"
      />
      <NavMain
        v-if="getNavCategories.info.length > 0"
        :items="getNavCategories.info"
        label="Info"
      />
      <NavMain :items="getNavCategories.tools" label="Tools" />
    </SidebarContent>
    <SidebarFooter>
      <div class="space-y-2">
        <div
          @click="$router.push('/settings')"
          class="hover:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-all hover:scale-[1.02]"
        >
          <Icon icon="mdi:cog" width="20" height="20" class="text-muted-foreground" />
          <span class="text-sm">Settings</span>
        </div>
        <div class="border-border/50 flex items-center justify-center gap-4 border-t pt-2">
          <a
            href="https://github.com/soerenpriess/Omniflow"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon
              icon="mdi:github"
              width="20"
              height="20"
              class="cursor-pointer transition-transform hover:scale-110"
            />
          </a>
        </div>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>
