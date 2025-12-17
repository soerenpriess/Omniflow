<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Icon } from '@iconify/vue'
import type { Category } from '@/types/Category'
import router from '@/router/_index'

defineProps<{
  items: Category[]
  label?: string
}>()

const openCategory = ref<string | null>(null)

function toggleCategory(title: string) {
  openCategory.value = openCategory.value === title ? null : title
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>{{ label }}</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible
        v-for="item in items"
        :key="item.title"
        as-child
        :open="openCategory === item.title"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger as-child @click="toggleCategory(item.title)">
            <SidebarMenuButton :tooltip="item.title" class="gap-2 hover:cursor-pointer">
              <div
                class="h-4 w-0.5 rounded-full"
                :style="{
                  background: `linear-gradient(to bottom, ${item.hoverColor}, ${item.hoverColor}99)`,
                }"
              ></div>
              <span class="">{{ item.title }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem v-for="subItem in item.cards" :key="subItem.title">
                <SidebarMenuSubButton as-child>
                  <div @click="router.push(subItem.path)" class="cursor-pointer">
                    <Icon :icon="subItem.icon" v-if="subItem.icon" />
                    <span>{{ subItem.title }}</span>
                  </div>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
