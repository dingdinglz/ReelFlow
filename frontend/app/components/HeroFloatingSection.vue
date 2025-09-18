<template>
  <div class="hero-floating-container">
    <div
      class="hero-floating-content"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="hero-text-content">
        <h1 class="hero-title">
          <MDC
            :value="title"
            unwrap="p"
          />
        </h1>
        <p class="hero-description">
          {{ description }}
        </p>
        <div class="hero-actions">
          <UButton
            v-for="(link, index) in links"
            :key="index"
            :label="link.label"
            :icon="link.icon"
            :trailing="link.trailing"
            :to="link.to"
            :size="link.size"
            :color="link.color || 'primary'"
            :variant="link.variant || 'solid'"
            :target="link.target"
            class="hero-action-button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
type ButtonVariant = 'link' | 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost'

interface HeroLink {
  label: string
  icon?: string
  trailing?: boolean
  to: string
  size?: ButtonSize
  color?: ButtonColor
  variant?: ButtonVariant
  target?: string
}

interface Props {
  title: string
  description: string
  links: HeroLink[]
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
.hero-floating-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  overflow: hidden;
}

.hero-floating-content {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 4rem 3rem;
  max-width: 900px;
  width: 100%;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0px);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.hero-floating-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 51, 234, 0.1) 50%,
    rgba(239, 68, 68, 0.1) 100%
  );
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.hero-floating-content:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 35px 60px -12px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.hero-floating-content:hover::before {
  opacity: 1;
}

.hero-text-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-action-button {
  transition: all 0.3s ease;
}

.hero-action-button:hover {
  transform: translateY(-2px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-floating-container {
    min-height: 70vh;
    padding: 1rem;
  }
  
  .hero-floating-content {
    padding: 2.5rem 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-floating-content {
    padding: 2rem 1.5rem;
  }
}
</style>