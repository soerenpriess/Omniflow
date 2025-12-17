<template>
  <div ref="containerRef" class="flex h-full w-full flex-col">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { animate } from 'animejs'

const containerRef = ref<HTMLElement | null>(null)
const animatedElements = new WeakSet<HTMLElement>()

function playEnterAnimation() {
  const elements = Array.from(
    containerRef.value?.querySelectorAll('.route-transition-animation') || [],
  ) as HTMLElement[]

  if (!elements.length) return

  // Filter out elements that have already been animated
  const newElements = elements.filter((el) => !animatedElements.has(el))

  if (!newElements.length) return

  // Mark elements as animated
  newElements.forEach((el) => {
    animatedElements.add(el)
  })

  // Set initial state
  newElements.forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateX(100%)'
  })

  // Wait for next frame to ensure styles are applied
  requestAnimationFrame(() => {
    const totalDuration = 300
    const delayStep = totalDuration / newElements.length
    const shuffled = newElements.sort(() => Math.random() - 0.5)

    shuffled.forEach((el, i) => {
      const delay = i * delayStep + Math.random() * 5
      animate(el, {
        translateX: ['100%', '0%'],
        opacity: [0, 1],
        duration: 150,
        delay,
        easing: 'easeOutQuart',
      })
    })
  })
}

onMounted(() => {
  // Initial animation
  nextTick(() => {
    playEnterAnimation()
  })

  // Watch for new elements being added
  const observer = new MutationObserver(() => {
    nextTick(() => {
      playEnterAnimation()
    })
  })

  if (containerRef.value) {
    observer.observe(containerRef.value, {
      childList: true,
      subtree: true,
    })
  }
})

function playExitAnimation(onComplete: () => void) {
  const elements = Array.from(
    containerRef.value?.querySelectorAll('.route-transition-animation') || [],
  ) as HTMLElement[]

  if (!elements.length) {
    onComplete()
    return
  }

  const totalDuration = 300
  const delayStep = totalDuration / elements.length
  const shuffled = elements.sort(() => Math.random() - 0.5)

  let maxEndTime = 0

  shuffled.forEach((el, i) => {
    const delay = i * delayStep
    const duration = 150

    animate(el, {
      translateX: ['0%', '-100%'],
      opacity: [1, 0],
      duration,
      delay,
      easing: 'easeInExpo',
    })

    const endTime = delay + duration
    if (endTime > maxEndTime) maxEndTime = endTime
  })

  setTimeout(onComplete, maxEndTime)
}

defineExpose({ playExitAnimation })
</script>
