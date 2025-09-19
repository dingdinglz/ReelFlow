<template>
  <div class="floating-card-grid">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="floating-card-wrapper"
      :style="{ '--card-delay': `${index * 0.15}s` }"
      @mouseenter="handleCardMouseEnter(index)"
      @mouseleave="handleCardMouseLeave(index)"
    >
      <UPageCard
        v-bind="item"
        :spotlight="true"
        class="floating-card"
        :class="{ 'is-hovered': hoveredCard === index }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">


interface CardItem {
  title: string
  description: string
  icon: string
  name?: string
  [key: string]: any
}

interface Props {
  items: CardItem[]
}

defineProps<Props>()

const hoveredCard = ref<number | null>(null)

const handleCardMouseEnter = (index: number) => {
  hoveredCard.value = index
}

const handleCardMouseLeave = (index: number) => {
  hoveredCard.value = null
}
</script>

<style scoped>
.floating-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.floating-card-wrapper {
  position: relative;
}

.floating-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: float-card 7s ease-in-out infinite;
  animation-delay: var(--card-delay, 0s);
  transform-origin: center bottom;
  will-change: transform;
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.floating-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 51, 234, 0.1) 50%,
    rgba(239, 68, 68, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  border-radius: 16px;
}

.floating-card:hover::before,
.floating-card.is-hovered::before {
  opacity: 1;
}

.floating-card:hover,
.floating-card.is-hovered {
  transform: translateY(-15px) scale(1.03) rotateX(2deg);
  box-shadow: 
    0 25px 50px -10px rgba(59, 130, 246, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  animation-play-state: paused;
}

/* 卡片图标动画 */
.floating-card :deep(.card-icon) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-card:hover :deep(.card-icon) {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
}

/* 卡片内容动画 */
.floating-card :deep(.card-content) {
  transition: all 0.3s ease;
}

.floating-card:hover :deep(.card-content) {
  transform: translateY(-2px);
}

/* 卡片标题动画 */
.floating-card :deep(.card-title) {
  transition: all 0.3s ease;
}

.floating-card:hover :deep(.card-title) {
  color: rgba(59, 130, 246, 1);
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

/* 浮动动画关键帧 */
@keyframes float-card {
  0%, 100% {
    transform: translateY(0px) rotateY(0deg);
  }
  25% {
    transform: translateY(-6px) rotateY(1deg);
  }
  50% {
    transform: translateY(0px) rotateY(0deg);
  }
  75% {
    transform: translateY(-3px) rotateY(-0.5deg);
  }
}

/* 邻近卡片效果 */
.floating-card-wrapper:hover ~ .floating-card-wrapper .floating-card {
  transform: translateY(-3px) scale(0.98);
  opacity: 0.8;
}

.floating-card-wrapper:hover + .floating-card-wrapper .floating-card,
.floating-card-wrapper:has(+ .floating-card-wrapper:hover) .floating-card {
  transform: translateY(-6px) scale(0.99);
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-card-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .floating-card:hover {
    transform: translateY(-10px) scale(1.02);
  }
}

@media (max-width: 480px) {
  .floating-card-grid {
    gap: 1rem;
  }
  
  .floating-card {
    animation-duration: 8s;
  }
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .floating-card {
    animation: none;
  }
  
  .floating-card:hover {
    transform: translateY(-8px);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .floating-card {
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
}
</style>