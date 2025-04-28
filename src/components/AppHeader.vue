<script setup lang="ts">
import { ref, computed, type ComputedRef } from 'vue'
import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
const router = useRouter()

const userStore = useUserStore()

const signOutMethod = async(): Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}

interface IMenuItem {
  label: string
  icon: string
  path: string
  show: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed((): boolean => !userStore.userId),
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
    show: computed((): boolean => !!userStore.userId),
  },
])
</script>

<template>
  <header class="flex justify-between bg-gray-100 rounded-xl mb-5 shadow-sm">
    <ul class="flex">
      <li v-for="(item, i) in items" :key="i">
        <div v-if="item.show">
          <router-link
            :to="item.path"
            class="flex items-center py-7 px-5 hover:bg-gray-200 hover:rounded-xl"
          >
            <span class="mr-2" :class="item.icon"></span>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </li>
    </ul>

    <span
      @click="signOutMethod"
      v-if="userStore.userId"
      class="flex items-center cursor-pointer px-5 hover:bg-gray-200 hover:rounded-xl"
    >
      <span class="pi pi-sign-out"></span>
      <span class="ml-2">Выход</span>
    </span>
  </header>
</template>
