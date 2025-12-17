<template>
  <div>
    <Button
      variant="outline"
      class="group flex h-12 w-20 cursor-pointer items-center justify-start overflow-hidden px-4 py-2 md:absolute"
      @click="$emit('back')"
    >
      <Icon
        icon="fa6-solid:arrow-left"
        class="ml-4 w-full transition-transform duration-300 group-hover:-translate-x-16"
      />
      <span
        class="absolute left-10 translate-x-2 text-base font-medium opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
      >
        BACK
      </span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

defineEmits(['back'])
</script>
