<script setup lang="ts">
useHead({
  title: "睿播 Reelflow"
})
const {data: page} = await useAsyncData('index', () => queryCollection('index').first())
</script>

<template>
  <div v-if="page">
    <!-- 浮动英雄区域 -->
    <div class="hero-section-wrapper">
      <IndexHeroBackground/>
      <LazyStarsBg/>
      <HeroFloatingSection
        :title="page.title"
        :description="page.description"
        :links="page.hero.links"
      />
    </div>

    <FloatingSection
        v-for="(section, index) in page.sections"
        :key="index"
        :title="section.title"
        :description="section.description"
        :orientation="section.orientation"
        :reverse="section.reverse"
        :features="section.features"
        :delay="index * 0.5"
    >
      <ImagePlaceholder/>
    </FloatingSection>

    <FloatingSection
        :title="page.features.title"
        :description="page.features.description"
        :delay="2"
    >
      <FloatingCardGrid :items="page.features.items" />
    </FloatingSection>
    
    <USeparator/>

    <FloatingCTA
        v-bind="page.cta"
        variant="naked"
    >
      <LazyStarsBg/>
    </FloatingCTA>
    
    <!-- 浮动回到顶部按钮 -->
    <FloatingButton icon="rocket" />
  </div>
</template>

<style scoped>
.hero-section-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-section-wrapper :deep(.index-hero-background) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-section-wrapper :deep(.hero-floating-section) {
  position: relative;
  z-index: 2;
}
</style>
