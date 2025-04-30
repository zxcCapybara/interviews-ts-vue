<script setup lang="ts">
import { ref } from 'vue'
import type { IInterview } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { getAuth } from 'firebase/auth'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import AppLoader from '@/components/AppLoader.vue'
import { useNotification } from '@/composables/useNotification'
import AppNotificationError from '@/components/AppNotificationError.vue'
import { usePhoneInput } from '@/composables/usePhoneInput'

const { errorMessage, isNotificationOpen, openNotification } = useNotification()
const { phone, formatPhone } = usePhoneInput()

const router = useRouter()
const db = getFirestore()
const company = ref<string>('')
const vacancyLink = ref<string>('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const contactWhatsApp = ref<string>('')
const contactPhone = phone
const loading = ref<boolean>(false)

const addNewInterview = async (): Promise<void> => {
  if (!(company.value && vacancyLink.value && hrName.value)) {
    openNotification('Пожалуйста, введите обязательные поля.')
    return
  }

  loading.value = true
  const payload: IInterview = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactWhatsApp: contactWhatsApp.value,
    contactPhone: contactPhone.value,
    createdAt: new Date(),
  }
  try {
    const userId = getAuth().currentUser?.uid
    if (userId) {
      await setDoc(doc(db, `users/${userId}/interviews`, payload.id), payload).then(() => {
        router.push('/list')
      })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <transition>
    <AppNotificationError
      v-if="isNotificationOpen"
      :msg="errorMessage"
      class="absolute bottom-10 right-10"
    />
  </transition>
  <AppLoader v-if="loading" />
  <main v-else class="mt-20">
    <div class="flex flex-col gap-5 shadow-xl rounded-xl w-[50rem] mx-auto py-5 px-2">
      <h1 class="text-center text-xl font-bold">Новое собеседование</h1>

      <div class="relative">
        <input v-model="company" class="inputInterview" type="text" placeholder="Компания" />
        <span class="absolute right-3 top-1 text-red-500 text-3xl">*</span>
      </div>
      <div class="relative">
        <input
          v-model="vacancyLink"
          class="inputInterview"
          type="text"
          placeholder="Описание вакансии (ссылка)"
        />
        <span class="absolute right-3 top-1 text-red-500 text-3xl">*</span>
      </div>
      <div class="relative">
        <input v-model="hrName" class="inputInterview" type="text" placeholder="Контакт (имя)" />
        <span class="absolute right-3 top-1 text-red-500 text-3xl">*</span>
      </div>
      <input
        v-model="contactTelegram"
        class="inputInterview"
        type="text"
        placeholder="Telegram username HR"
      />
      <input
        v-model="contactWhatsApp"
        class="inputInterview"
        type="text"
        placeholder="WhatsApp телефон HR"
      />

      <input
        @input="formatPhone"
        v-model="contactPhone"
        class="inputInterview"
        type="text"
        placeholder="Телефон HR"
      />

      <button
        @click="addNewInterview"
        :loading="loading"
        class="bg-blue-400 p-4 rounded-xl text-white hover:bg-blue-500"
      >
        <span>Создать собеседование</span>
      </button>
    </div>
  </main>
</template>
