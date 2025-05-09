<script setup lang="ts">
import AuthLoader from '@/components/AuthLoader.vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

import { computed, ref } from 'vue'
import AppNotificationError from '@/components/AppNotificationError.vue'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')

const isLogin = ref<boolean>(true)
const isLoading = ref<boolean>(false)

const { isNotificationOpen, errorMessage, openNotification } = useNotification()

const subtitleText = computed<string>(() => {
  return isLogin.value ? 'Аккаунта еще нет?' : 'Уже есть аккаунт?'
})

const linkAccountText = computed<string>(() => {
  return isLogin.value ? 'Создайте сейчас' : 'Войдите в него'
})

const submitButtonText = computed<string>(() => {
  return isLogin.value ? 'Вход' : 'Регистрация'
})

const toggleAuth = () => (isLogin.value = !isLogin.value)

const validateForm = (): boolean => {
  if (!email.value || !password.value) {
    openNotification('Пожалуйста, заполните все поля.')
    return false
  }
  return true
}

const submitForm = async (): Promise<void> => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const auth = getAuth()
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value)
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value)
    }
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      openNotification(error.message)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <transition>
    <AppNotificationError
      v-if="isNotificationOpen"
      :msg="errorMessage"
      class="absolute bottom-60 sm:bottom-10 sm:right-10 w-[90%] sm:w-fit"
    />
  </transition>
  <main class="mt-20">
    <div
      class="flex flex-col  mx-auto items-center border-1 border-gray-100 rounded-xl sm:w-[30rem] shadow-lg"
    >
      <div class="flex flex-col items-center pb-6">
        <p class="my-5 text-xl font-bold">Приветствую!</p>
        <div>
          <span class="mr-2 text-gray-500">{{ subtitleText }}</span>
          <span class="text-blue-400 cursor-pointer" @click="toggleAuth">{{
            linkAccountText
          }}</span>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="flex flex-col w-full px-10">
        <label for="email1">Email</label>
        <input
          v-model="email"
          type="text"
          id="email1"
          class="border-1 border-gray-300 p-2 outline-none rounded-md mb-5"
        />

        <label for="password1">Пароль</label>
        <input
          v-model="password"
          type="password"
          id="password1"
          class="border-1 border-gray-300 p-2 outline-none rounded-md mb-5"
        />

        <div
          class="flex items-center justify-between bg-blue-500 text-white py-1 px-3 rounded-md mb-5 cursor-pointer hover:bg-blue-600"
        >
          <span class="pi pi-user"></span>
          <div v-if="isLoading">
            <AuthLoader />
          </div>
          <button v-else type="submit">{{ submitButtonText }}</button>
          <span></span>
        </div>
      </form>
    </div>
  </main>
</template>

<style></style>
