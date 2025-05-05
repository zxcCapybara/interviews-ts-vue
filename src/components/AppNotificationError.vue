<script setup lang="ts">
interface Props {
  msg: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="box bg-[#ff798d] text-red-900 w-[15rem] sm:w-[24rem] min-h-[6rem] sm:min-h-[8rem] rounded-xl flex flex-col justify-center p-2 border-l-5 border-red-800 text-xl"
  >
    <span class="font-bold text-md sm:text-xl">Error</span>
    <span>{{ msg }}</span>
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
