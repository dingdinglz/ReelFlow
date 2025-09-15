<script setup lang="ts">
import type {NuxtError} from '#app'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})
</script>

<template>
  <div>
    <IndexHeader/>
    <UMain>
      <UContainer>
        <UPage>
          <UError :error="error" :clear="{
      size: 'xl',
      icon: 'i-lucide-arrow-left',
      class: 'rounded-full',
      label: '回到首页'
    }"/>
        </UPage>
      </UContainer>
    </UMain>
    <IndexFooter/>
    <UToaster/>
  </div>
</template>
