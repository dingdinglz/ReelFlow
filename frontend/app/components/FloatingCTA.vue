<template>
  <div class="floating-cta-wrapper">
    <div 
      class="floating-cta-container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <UPageCTA
        :title="title"
        :description="description"
        :links="links"
        :variant="variant"
        class="floating-cta"
      >
        <template #default>
          <slot />
        </template>
      </UPageCTA>
    </div>
    
    <!-- 装饰性元素 -->
    <div class="floating-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ButtonVariant = 'link' | 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost'
type CTAVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'naked'

interface CTALink {
  label: string
  to: string
  trailingIcon?: string
  target?: string
  variant?: ButtonVariant
  icon?: string
}

interface Props {
  title: string
  description: string
  links: CTALink[]
  variant?: CTAVariant
}

defineProps<Props>()

const isHovered = ref(false)

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}
</script>

<style scoped>
.floating-cta-wrapper {
  position: relative;
  padding: 4rem 0;
  overflow: hidden;
}

.floating-cta-container {
  position: relative;
  z-index: 10;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation: float-cta 10s ease-in-out infinite;
  transform-origin: center center;
}

.floating-cta {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 51, 234, 0.1) 50%,
    rgba(239, 68, 68, 0.1) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.floating-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.2) 0%,
    rgba(147, 51, 234, 0.2) 50%,
    rgba(239, 68, 68, 0.2) 100%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.floating-cta-container:hover {
  transform: translateY(-20px) scale(1.02);
  animation-play-state: paused;
}

.floating-cta-container:hover .floating-cta::before {
  opacity: 1;
}

.floating-cta-container:hover .floating-cta {
  box-shadow: 
    0 40px 80px -12px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* CTA 按钮增强效果 */
.floating-cta :deep(.cta-button) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.floating-cta :deep(.cta-button::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.6s ease;
}

.floating-cta-container:hover :deep(.cta-button) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

.floating-cta-container:hover :deep(.cta-button::before) {
  left: 100%;
}

/* 标题和描述动画 */
.floating-cta :deep(.cta-title) {
  transition: all 0.4s ease;
}

.floating-cta :deep(.cta-description) {
  transition: all 0.4s ease;
}

.floating-cta-container:hover :deep(.cta-title) {
  transform: translateY(-2px);
  text-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.floating-cta-container:hover :deep(.cta-description) {
  transform: translateY(-1px);
}

/* 装饰性浮动球体 */
.floating-orbs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.3),
    rgba(147, 51, 234, 0.3)
  );
  backdrop-filter: blur(10px);
  animation: float-orb 12s ease-in-out infinite;
}

.orb-1 {
  width: 60px;
  height: 60px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 40px;
  height: 40px;
  top: 60%;
  right: 15%;
  animation-delay: -4s;
}

.orb-3 {
  width: 80px;
  height: 80px;
  bottom: 30%;
  left: 80%;
  animation-delay: -8s;
}

.floating-cta-container:hover .orb {
  animation-play-state: paused;
  transform: scale(1.2);
}

/* 浮动动画 */
@keyframes float-cta {
  0%, 100% {
    transform: translateY(0px) rotateZ(0deg);
  }
  25% {
    transform: translateY(-15px) rotateZ(0.5deg);
  }
  50% {
    transform: translateY(0px) rotateZ(0deg);
  }
  75% {
    transform: translateY(-8px) rotateZ(-0.3deg);
  }
}

@keyframes float-orb {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.6;
  }
  33% {
    transform: translateY(-30px) translateX(20px) scale(1.1);
    opacity: 0.8;
  }
  66% {
    transform: translateY(10px) translateX(-15px) scale(0.9);
    opacity: 0.4;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-cta-wrapper {
    padding: 2rem 0;
  }
  
  .floating-cta-container:hover {
    transform: translateY(-12px) scale(1.01);
  }
  
  .orb {
    display: none; /* 移动端隐藏装饰球体 */
  }
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .floating-cta-container {
    animation: none;
  }
  
  .orb {
    animation: none;
    opacity: 0.3;
  }
  
  .floating-cta-container:hover {
    transform: translateY(-10px);
  }
}

/* 高性能模式 */
@media (hover: hover) and (pointer: fine) {
  .floating-cta-container {
    will-change: transform;
  }
}
</style>