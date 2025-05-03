<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/stores/user'
import AppLoader from './components/AppLoader.vue'

const userStore = useUserStore()

const isLoading = ref<boolean>(true)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
    isLoading.value = false
  })
})

</script>

<template>
  <AppLoader v-if="isLoading" />
  <main v-else class="w-[90%] mx-auto mt-5">
    <AppHeader />
    <RouterView />
  </main>
</template>

