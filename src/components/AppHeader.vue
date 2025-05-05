<script setup lang="ts">
import { ref, computed, type ComputedRef } from 'vue'
import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isMenuOpen = ref<boolean>(false)

const menuToggle = () => {
  isMenuOpen.value = !isMenuOpen.value
  console.log('Menu toggled, isMenuOpen:', isMenuOpen.value)
}

const signOutMethod = async (): Promise<void> => {
  try {
    await signOut(getAuth())
    router.push('/auth')
    isMenuOpen.value = false
  } catch (error) {
    console.error('Sign-out error:', error)
  }
}

interface IMenuItem {
  label: string
  icon: string
  path: string
  show: ComputedRef<boolean>
  action?: () => Promise<void>
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
  {
    label: 'Выйти',
    icon: 'pi pi-sign-out',
    path: '',
    show: computed((): boolean => !!userStore.userId),
    action: signOutMethod,
  },
])
</script>

<template>
  <header class="relative">
    <!-- Mobile toggle button -->
    <div
      v-if="route.path !== '/auth'"
      class="md:hidden fixed top-4 right-4 z-50"
    >
      <button
        class="p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
        @click="menuToggle"
      >
        <i
          :class="isMenuOpen ? 'pi pi-times' : 'pi pi-bars'"
          class="text-2xl text-gray-800"
        ></i>
      </button>
    </div>

    <!-- Navbar -->
    <nav
      :class="[
        'fixed inset-0 z-40 bg-gray-100 md:bg-transparent md:static md:flex md:items-center md:justify-center transition-all duration-300 ease-in-out',
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full md:opacity-100 md:translate-y-0 pointer-events-none md:pointer-events-auto',
      ]"
    >
      <div
        class="flex flex-col items-center justify-center h-full md:h-auto md:max-w-3xl md:w-full md:flex-row md:gap-4 md:bg-gray-100 md:rounded-xl md:p-4"
      >
        <ul
          class="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-2 w-full max-w-md md:max-w-none"
        >
          <li
            v-for="(item, i) in items"
            :key="i"
            class="w-full md:w-auto"
          >
            <div v-if="item.show" @click="isMenuOpen = false">
              <router-link
                v-if="item.path"
                :to="item.path"
                class="flex items-center justify-center md:justify-start py-3 px-6 text-gray-800 hover:bg-gray-200 hover:rounded-xl transition-colors w-full text-lg md:text-base"
              >
                <i :class="item.icon" class="mr-3 text-xl md:text-lg"></i>
                <span>{{ item.label }}</span>
              </router-link>
              <button
                v-else
                @click="item.action?.()"
                class="flex items-center justify-center md:justify-start py-3 px-6 text-gray-800 hover:bg-gray-200 hover:rounded-xl transition-colors w-full text-lg md:text-base "
              >
                <i :class="item.icon" class="mr-3 text-xl md:text-lg"></i>
                <span>{{ item.label }}</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>