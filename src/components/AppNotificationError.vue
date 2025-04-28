<script setup lang="ts">
interface Props {
  msg: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="box bg-[#ff798d] text-red-900 max-w-[17rem] min-h-[5rem] rounded-xl flex flex-col p-2 border-l-5 border-red-800"
  >
    <span class="font-bold">Error</span>
    <span>{{ msg }}</span>
  </div>
</template>
