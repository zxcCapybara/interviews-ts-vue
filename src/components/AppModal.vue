<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <main class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="emit('close')">
    <div class="bg-white rounded-xl w-[25rem] h-[15rem] p-8 relative" @click.stop>
      <span @click="emit('close')" class="pi pi-times absolute right-4 top-6 cursor-pointer"></span>
      <h1>Удаление собеседования</h1>
      <div class="flex gap-6 items-center h-[7rem]">
        <span class="pi pi-info-circle scale-200"></span>
        <p>Вы хотите удалить собеседование?</p>
      </div>
      <div class="flex gap-5 justify-end">
        <button
          @click="emit('close')"
          class="border-gray-300 border-1 p-2 text-gray-500 rounded-md hover:bg-gray-100"
        >
          Отмена
        </button>
        <button @click="emit('delete')" class="p-2 bg-red-600 text-white rounded-md hover:bg-red-700">Удалить</button>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
