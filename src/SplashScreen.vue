<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { animate } from 'animejs'

const emit = defineEmits<{
  complete: []
}>()

const logoCircleRef = ref<HTMLDivElement>()
const path1Ref = ref<SVGPathElement>()
const path2Ref = ref<SVGPathElement>()
const path3Ref = ref<SVGPathElement>()
const screenRef = ref<HTMLDivElement>()

onMounted(() => {
  // Logo Circle Pulse Animation
  animate(logoCircleRef.value!, {
    scale: [1, 1.05, 1],
    duration: 2000,
    easing: 'easeInOutSine',
    loop: true,
  })

  // Path 1 Drawing
  animate(path1Ref.value!, {
    strokeDashoffset: [100, 0],
    duration: 1200,
    delay: 200,
    easing: 'easeOutCubic',
  })

  // Path 2 Drawing
  animate(path2Ref.value!, {
    strokeDashoffset: [100, 0],
    duration: 1200,
    delay: 500,
    easing: 'easeOutCubic',
  })

  // Path 3 Drawing
  animate(path3Ref.value!, {
    strokeDashoffset: [100, 0],
    duration: 1200,
    delay: 700,
    easing: 'easeOutCubic',
  })

  // Fade Out
  setTimeout(() => {
    if (screenRef.value) {
      screenRef.value.classList.add('fade-out')

      setTimeout(() => {
        emit('complete')
      }, 400)
    }
  }, 2000)
})
</script>

<template>
  <div
    ref="screenRef"
    class="bg-background welcome-screen fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-600"
  >
    <!-- Content -->
    <div class="relative z-10 text-center">
      <div class="logo-container mb-8">
        <div
          ref="logoCircleRef"
          class="logo-circle mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full"
        >
          <svg
            class="text-primary-foreground h-[60px] w-[60px]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref="path1Ref"
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="path-animate"
            />
            <path
              ref="path2Ref"
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="path-animate"
            />
            <path
              ref="path3Ref"
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="path-animate"
            />
          </svg>
        </div>
      </div>

      <h1 class="text-foreground welcome-title m-0 text-6xl font-extrabold tracking-tight">
        Omniflow
      </h1>
      <p class="text-muted-foreground welcome-subtitle mt-3 text-xl font-medium">
        Your all-in-one toolbox
      </p>
    </div>
  </div>
</template>

<style scoped>
.welcome-screen.fade-out {
  opacity: 0;
}

.logo-container {
  animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.logo-circle {
  background: var(--primary);
  box-shadow:
    0 10px 40px color-mix(in srgb, var(--primary) 30%, transparent),
    0 0 0 1px color-mix(in srgb, var(--primary) 10%, transparent);
}

.path-animate {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
}

.welcome-title {
  animation: fadeIn 0.8s ease-out 0.3s backwards;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  animation: fadeIn 0.8s ease-out 0.5s backwards;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 3rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .logo-circle {
    width: 100px;
    height: 100px;
  }

  .logo-circle svg {
    width: 50px;
    height: 50px;
  }
}
</style>
