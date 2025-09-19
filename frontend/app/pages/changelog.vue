<script setup lang="ts">
useHead({
  title: "更新日志 - ReelFlow"
})

const { data: changelog } = await useAsyncData('changelog', () => queryCollection('changelog').first())

// 判断是否为最新版本（第一个条目）
const isLatestVersion = (index: number) => {
  return index === 0
}
</script>

<template>
  <div v-if="changelog" class="pb-10">
    <UPageHero
      :title="changelog.title"
      :description="changelog.description"
    />

    <UPage>
      <UPageBody>
        <div v-if="changelog.items && changelog.items.length > 0">
          <div class="max-w-4xl mx-auto">
            <UTimeline :default-value="0" :items="changelog.items.map((item, index) => ({
              date: item.date,
              title: item.version,
              icon: isLatestVersion(index) ? 'i-lucide-rocket' : 'i-lucide-package',
              avatar: item.badge ? {
                src: '',
                alt: item.badge.label,
                color: item.badge.color || 'primary'
              } : undefined,
            }))">
              <template #description="{ item }">
                <div class="mb-4">
                  <template 
                    v-for="(changelogItem, index) in changelog.items" 
                    :key="index"
                  >
                    <UBadge 
                      v-if="changelogItem.version === item.title && changelogItem.badge" 
                      :color="changelogItem.badge?.color || 'primary'"
                      variant="soft"
                      class="mb-2"
                    >
                      {{ changelogItem.badge?.label }}
                    </UBadge>
                    
                    <div 
                      v-if="changelogItem.version === item.title"
                      class="prose prose-primary dark:prose-invert max-w-none" 
                      v-html="changelogItem.content"
                    ></div>
                  </template>
                </div>
              </template>
            </UTimeline>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>暂无更新日志</p>
        </div>
      </UPageBody>
    </UPage>
  </div>
</template>