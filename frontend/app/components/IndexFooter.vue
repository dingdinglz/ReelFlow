<template>
  <USeparator
      class="h-px"
  />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #left>
      <p class="text-muted text-sm">
        Copyright &copy; ReelFlow {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
          to="https://github.com/dingdinglz/ReelFlow"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="ReelFlow on GitHub"
          color="neutral"
          variant="ghost"
      />
    </template>
  </UFooter>
</template>
