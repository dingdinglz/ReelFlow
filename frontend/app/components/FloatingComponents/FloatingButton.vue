<!-- 浮动按钮组件 - 回到顶部 + 页面进度 -->
<template>
  <Transition name="floating-button" appear>
    <button
      v-show="showButton"
      class="floating-button"
      :class="[
        `floating-button--${variant}`,
        `floating-button--${size}`,
        { 'floating-button--disabled': disabled }
      ]"
      :style="buttonStyles"
      :disabled="disabled"
      @click="scrollToTop"
      :aria-label="ariaLabel"
    >
      <!-- 进度环 -->
      <svg
        class="progress-ring"
        :width="ringSize"
        :height="ringSize"
        viewBox="0 0 100 100"
      >
        <circle
          class="progress-ring__background"
          cx="50"
          cy="50"
          :r="ringRadius"
          fill="none"
          :stroke-width="strokeWidth"
        />
        <circle
          class="progress-ring__progress"
          cx="50"
          cy="50"
          :r="ringRadius"
          fill="none"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 50 50)"
        />
      </svg>

      <!-- 按钮图标 -->
      <div class="button-icon">
        <svg
          v-if="icon === 'arrow-up'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m18 15-6-6-6 6"/>
        </svg>
        <svg
          v-else-if="icon === 'chevron-up'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m18 15-6-6-6 6"/>
        </svg>
        <svg
          v-else-if="icon === 'rocket'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
        </svg>
        <div v-else class="custom-icon" v-html="icon"></div>
      </div>

      <!-- 进度百分比文字（可选） -->
      <div v-if="showPercentage" class="progress-text">
        {{ Math.round(scrollProgress * 100) }}%
      </div>
    </button>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  /** 显示阈值（滚动多少像素后显示按钮） */
  threshold?: number
  /** 按钮变体 */
  variant?: 'default' | 'glass' | 'gradient' | 'minimal' | 'solid'
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 图标类型 */
  icon?: 'arrow-up' | 'chevron-up' | 'rocket' | string
  /** 是否显示百分比文字 */
  showPercentage?: boolean
  /** 动画持续时间（毫秒） */
  scrollDuration?: number
  /** 按钮位置 */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** 距离边缘的偏移 */
  offset?: { x?: number; y?: number }
  /** 自定义颜色 */
  customColors?: {
    background?: string
    border?: string
    icon?: string
    progress?: string
    progressBg?: string
  }
  /** 禁用状态 */
  disabled?: boolean
  /** 无障碍标签 */
  ariaLabel?: string
  /** Z-index层级 */
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 300,
  variant: 'default',
  size: 'md',
  icon: 'arrow-up',
  showPercentage: false,
  scrollDuration: 800,
  position: 'bottom-right',
  offset: () => ({ x: 24, y: 24 }),
  disabled: false,
  ariaLabel: '回到页面顶部',
  zIndex: 1000
})

// 响应式状态
const scrollY = ref(0)
const windowHeight = ref(0)
const documentHeight = ref(0)

// 计算属性
const showButton = computed(() => scrollY.value > props.threshold && !props.disabled)

const scrollProgress = computed(() => {
  if (documentHeight.value <= windowHeight.value) return 0
  const scrollableHeight = documentHeight.value - windowHeight.value
  return Math.min(scrollY.value / scrollableHeight, 1)
})

// 进度环相关计算
const sizeConfig = {
  sm: { ring: 40, stroke: 3, icon: 16 },
  md: { ring: 56, stroke: 4, icon: 20 },
  lg: { ring: 64, stroke: 5, icon: 24 },
  xl: { ring: 72, stroke: 6, icon: 28 }
}

const currentSize = computed(() => sizeConfig[props.size])
const ringSize = computed(() => currentSize.value.ring)
const strokeWidth = computed(() => currentSize.value.stroke)
const ringRadius = computed(() => (100 - strokeWidth.value * 2) / 2)
const circumference = computed(() => 2 * Math.PI * ringRadius.value)
const dashOffset = computed(() => circumference.value * (1 - scrollProgress.value))

// 按钮样式
const buttonStyles = computed(() => {
  const styles: Record<string, string> = {
    '--ring-size': `${ringSize.value}px`,
    '--icon-size': `${currentSize.value.icon}px`,
    '--z-index': props.zIndex.toString()
  }

  // 位置样式
  const [vertical, horizontal] = props.position.split('-') as [string, string]
  styles[vertical] = `${props.offset.y}px`
  styles[horizontal] = `${props.offset.x}px`

  // 自定义颜色
  if (props.customColors) {
    const colors = props.customColors
    if (colors.background) styles['--btn-bg'] = colors.background
    if (colors.border) styles['--btn-border'] = colors.border
    if (colors.icon) styles['--btn-icon'] = colors.icon
    if (colors.progress) styles['--progress-color'] = colors.progress
    if (colors.progressBg) styles['--progress-bg'] = colors.progressBg
  }

  return styles
})

// 滚动到顶部方法
const scrollToTop = () => {
  if (props.disabled) return

  const startY = scrollY.value
  const startTime = performance.now()

  const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.scrollDuration, 1)
    const easedProgress = easeOutQuart(progress)
    
    const currentY = startY * (1 - easedProgress)
    window.scrollTo(0, currentY)

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  requestAnimationFrame(animateScroll)
}

// 更新滚动和窗口信息
const updateScrollInfo = () => {
  scrollY.value = window.scrollY
  windowHeight.value = window.innerHeight
  documentHeight.value = document.documentElement.scrollHeight
}

// 节流函数
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

const throttledUpdateScrollInfo = throttle(updateScrollInfo, 16) // ~60fps

// 生命周期
onMounted(() => {
  updateScrollInfo()
  window.addEventListener('scroll', throttledUpdateScrollInfo)
  window.addEventListener('resize', updateScrollInfo)
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledUpdateScrollInfo)
  window.removeEventListener('resize', updateScrollInfo)
})
</script>

<style scoped>
.floating-button {
  /* 基础样式 */
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ring-size);
  height: var(--ring-size);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: var(--z-index);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 默认颜色变量 */
  --btn-bg: rgba(255, 255, 255, 0.1);
  --btn-border: rgba(255, 255, 255, 0.2);
  --btn-icon: #ffffff;
  --progress-color: #60a5fa;
  --progress-bg: rgba(255, 255, 255, 0.1);
  
  /* 阴影效果 */
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* 毛玻璃效果 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* 变体样式 */
.floating-button--default {
  background: var(--btn-bg);
  border: 1px solid var(--btn-border);
}

.floating-button--glass {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
}

.floating-button--gradient {
  background: linear-gradient(135deg, 
    rgba(96, 165, 250, 0.3) 0%, 
    rgba(147, 51, 234, 0.3) 100%);
  border: 1px solid rgba(96, 165, 250, 0.4);
}

.floating-button--minimal {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.floating-button--solid {
  background: #374151;
  border: 1px solid #4b5563;
}

/* 悬停效果 */
.floating-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.floating-button:active {
  transform: translateY(0) scale(0.98);
  transition-duration: 0.1s;
}

/* 禁用状态 */
.floating-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* 进度环样式 */
.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.progress-ring__background {
  stroke: var(--progress-bg);
  opacity: 0.3;
}

.progress-ring__progress {
  stroke: var(--progress-color);
  transition: stroke-dashoffset 0.1s ease-out;
  filter: drop-shadow(0 0 4px rgba(96, 165, 250, 0.3));
}

/* 按钮图标 */
.button-icon {
  position: relative;
  z-index: 1;
  width: var(--icon-size);
  height: var(--icon-size);
  color: var(--btn-icon);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.floating-button:hover .button-icon {
  transform: translateY(-1px);
}

.button-icon svg {
  width: 100%;
  height: 100%;
  stroke-width: 2.5;
}

.custom-icon {
  font-size: var(--icon-size);
  line-height: 1;
}

/* 进度百分比文字 */
.progress-text {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  color: var(--btn-icon);
  opacity: 0.8;
  white-space: nowrap;
  pointer-events: none;
}

/* 动画效果 */
.floating-button-enter-active,
.floating-button-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-button-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.floating-button-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-button {
    --ring-size: 48px;
    --icon-size: 18px;
  }
  
  .floating-button--sm {
    --ring-size: 36px;
    --icon-size: 14px;
  }
  
  .floating-button--lg {
    --ring-size: 56px;
    --icon-size: 22px;
  }
  
  .floating-button--xl {
    --ring-size: 64px;
    --icon-size: 26px;
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  .floating-button,
  .progress-ring__progress,
  .button-icon {
    transition: none;
  }
  
  .floating-button-enter-active,
  .floating-button-leave-active {
    transition: opacity 0.2s ease;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .floating-button {
    border-width: 2px;
  }
  
  .progress-ring__progress {
    filter: none;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: light) {
  .floating-button--default {
    --btn-bg: rgba(0, 0, 0, 0.1);
    --btn-border: rgba(0, 0, 0, 0.2);
    --btn-icon: #374151;
    --progress-bg: rgba(0, 0, 0, 0.1);
  }
  
  .floating-button--minimal {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);
    --btn-icon: #374151;
  }
}
</style>