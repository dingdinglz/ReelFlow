<script setup lang="ts">
useHead({
  title: "睿播 Reelflow"
})
const {data: page} = await useAsyncData('index', () => queryCollection('index').first())
</script>

<template>
  <div v-if="page">
    <UPageHero
        :title="page.title"
        :description="page.description"
        :links="page.hero.links"
    >
      <template #top>
        <IndexHeroBackground/>
      </template>

      <template #title>
        <MDC
            :value="page.title"
            unwrap="p"
        />
      </template>
    </UPageHero>

    <UPageSection
        v-for="(section, index) in page.sections"
        :key="index"
        :title="section.title"
        :description="section.description"
        :orientation="section.orientation"
        :reverse="section.reverse"
        :features="section.features"
    >
      <ImagePlaceholder/>
    </UPageSection>

    <UPageSection
        :title="page.features.title"
        :description="page.features.description"
    >
      <UPageGrid>
        <UPageCard
            v-for="(item, index) in page.features.items"
            :key="index"
            v-bind="item"
            spotlight
        />
      </UPageGrid>
    </UPageSection>

    <USeparator/>

    <UPageCTA
        v-bind="page.cta"
        variant="naked"
        class="overflow-hidden"
    >
      <LazyStarsBg/>
    </UPageCTA>
  </div>
</template>
