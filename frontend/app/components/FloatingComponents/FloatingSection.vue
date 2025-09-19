<template>
  <div 
    class="floating-section-wrapper"
    :class="{ 'reverse': reverse }"
  >
    <UPageSection
      :title="title"
      :description="description"
      :orientation="orientation"
      :reverse="reverse"
      :features="features"
      class="floating-section"
      :style="sectionStyle"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <template #default>
        <slot />
      </template>
    </UPageSection>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  name?: string
  title?: string
  description: string
  icon: string
}

interface Props {
  title: string
  description: string
  orientation?: 'horizontal' | 'vertical'
  reverse?: boolean
  features?: Feature[]
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'vertical',
  reverse: false,
  delay: 0
})

const isHovered = ref(false)

const sectionStyle = computed(() => ({
  '--animation-delay': `${props.delay}s`
}))

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}
</script>

<style scoped>
.floating-section-wrapper {
  position: relative;
  padding: 2rem 0;
  overflow: hidden;
}

.floating-section {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation: float-section 8s ease-in-out infinite;
  animation-delay: var(--animation-delay, 0s);
  will-change: transform;
  transform-origin: center center;
}

.floating-section:hover {
  transform: translateY(-12px) scale(1.01);
  animation-play-state: paused;
}

.floating-section:hover :deep(.features-grid) {
  transform: translateY(-4px);
}

.floating-section:hover :deep(.section-content) {
  transform: translateY(-2px);
}

/* 为特性卡片添加交互效果 */
.floating-section :deep(.feature-item) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.floating-section:hover :deep(.feature-item) {
  transform: translateY(-6px);
}

.floating-section :deep(.feature-item:nth-child(1)) {
  transition-delay: 0ms;
}

.floating-section :deep(.feature-item:nth-child(2)) {
  transition-delay: 100ms;
}

.floating-section :deep(.feature-item:nth-child(3)) {
  transition-delay: 200ms;
}

/* 浮动动画 */
@keyframes float-section {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-8px) rotate(0.5deg);
  }
  66% {
    transform: translateY(4px) rotate(-0.3deg);
  }
}

/* 反向区域的不同动画 */
.reverse .floating-section {
  animation: float-section-reverse 9s ease-in-out infinite;
  animation-delay: var(--animation-delay, 0s);
}

@keyframes float-section-reverse {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  40% {
    transform: translateY(6px) rotate(-0.4deg);
  }
  80% {
    transform: translateY(-10px) rotate(0.6deg);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .floating-section {
    animation-duration: 10s;
  }
  
  .floating-section:hover {
    transform: translateY(-8px) scale(1.005);
  }
}

/* 减少动画强度（适用于喜欢减少动效的用户） */
@media (prefers-reduced-motion: reduce) {
  .floating-section {
    animation: none;
  }
  
  .floating-section:hover {
    transform: translateY(-4px);
  }
}
</style>