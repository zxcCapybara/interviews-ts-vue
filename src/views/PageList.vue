<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import AppLoader from '@/components/AppLoader.vue'
import type { IInterview } from '@/interfaces'
import { useUserStore } from '@/stores/user'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { onMounted, ref, onUnmounted } from 'vue'

const userStore = useUserStore()
const db = getFirestore()
const isModalOpen = ref<boolean>(false)
const interviewId = ref<string>('')
const isLoading = ref<boolean>(true)
const interviews = ref<IInterview[]>([])
const selectedFilterResult = ref<string>('')
const isMobile = ref<boolean>(window.innerWidth < 768)

// Обновление isMobile при изменении размера экрана
const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', updateScreenSize)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})

const getAllInterviews = async <T extends IInterview>(isFilter?: boolean): Promise<T[]> => {
  let getData
  if (isFilter && selectedFilterResult.value) {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value),
    )
  } else {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
    )
  }
  const listDocs = await getDocs(getData)
  return listDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T))
}

const fetchAndSetInterviews = async (isFilter: boolean = false): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<IInterview> = await getAllInterviews(isFilter)
  interviews.value = listInterviews
  isLoading.value = false
}

const modalOpen = (id: string) => {
  isModalOpen.value = true
  interviewId.value = id
}

const modalClose = () => {
  isModalOpen.value = false
}

const deleteInterview = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
  interviews.value = interviews.value.filter((interview) => interview.id !== id)
  modalClose()
}

const submitFilter = async (): Promise<void> => {
  if (selectedFilterResult.value) {
    await fetchAndSetInterviews(true)
  }
}

const clearFilter = async (): Promise<void> => {
  selectedFilterResult.value = ''
  await fetchAndSetInterviews()
}

onMounted(async () => {
  await fetchAndSetInterviews()
})
</script>

<template>
  <AppLoader v-if="isLoading" />
  <AppModal v-if="isModalOpen" @close="modalClose" @delete="deleteInterview(interviewId)" />
  <div
    v-if="!interviews.length && !isLoading"
    class="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]"
  >
    <h1 class="text-center text-xl font-semibold mb-4">Список пуст</h1>
    <img
      src="https://giffiles.alphacoders.com/188/188576.gif"
      alt="1000-7"
      class="w-4xl"
      loading="lazy"
    />
  </div>
  <main v-else class="p-4">
    <h1 class="font-bold text-2xl mb-4">Список собеседований</h1>

    <!-- Фильтры -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
      <select
        v-model="selectedFilterResult"
        class="border border-gray-300 rounded-md p-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Выберите фильтр</option>
        <option value="Отказ">Отказ</option>
        <option value="Оффер">Оффер</option>
      </select>
      <div class="flex gap-2">
        <button
          class="bg-green-600 text-white rounded-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="submitFilter"
          :disabled="!selectedFilterResult"
        >
          Фильтровать
        </button>
        <button
          class="bg-red-600 text-white rounded-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="clearFilter"
          :disabled="!selectedFilterResult"
        >
          Сбросить
        </button>
      </div>
    </div>

    <!-- Мобильная версия -->
    <div v-if="isMobile" class="space-y-6">
      <div
        v-for="item in interviews"
        :key="item.id"
        class="bg-white shadow-md rounded-lg p-4 border border-gray-200"
      >
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-lg font-semibold">{{ item.company }}</h2>
            <p class="text-gray-600 my-2">{{ item.hrName || 'Не указано' }}</p>
            <a
              :href="item.vacancyLink"
              target="_blank"
              class="text-purple-600 hover:underline"
            >
              Вакансия
            </a>
          </div>
          <div class="flex gap-2">
            <router-link :to="`/interview/${item.id}`">
              <button class="pi pi-pencil bg-blue-500 text-white p-3 rounded-md text-xl"></button>
            </router-link>
            <button
              class="pi pi-trash bg-red-600 text-white p-3 rounded-md text-xl"
              @click="modalOpen(item.id)"
            ></button>
          </div>
        </div>
        <div class="mt-4 space-y-3">
          <p class="text-sm">
            <span class="font-medium">Контакты: </span>
            <span
              v-if="item.contactPhone || item.contactTelegram || item.contactWhatsApp"
              class="flex gap-4 mt-1 items-center"
            >
              <a
                v-if="item.contactTelegram"
                :href="`https://t.me/${item.contactTelegram}`"
                target="_blank"
                class="flex items-center gap-2 text-blue-500"
              >
                <i class="pi pi-telegram text-xl"></i>
                <span class="text-sm">{{ item.contactTelegram }}</span>
              </a>
              <a
                v-if="item.contactWhatsApp"
                :href="`https://wa.me/${item.contactWhatsApp}`"
                target="_blank"
                class="flex items-center gap-2 text-green-500"
              >
                <i class="pi pi-whatsapp text-xl"></i>
                <span class="text-sm">{{ item.contactWhatsApp }}</span>
              </a>
              <a
                v-if="item.contactPhone"
                :href="`tel:${item.contactPhone}`"
                target="_blank"
                class="flex items-center gap-2 text-purple-700"
              >
                <i class="pi pi-phone text-xl"></i>
                <span class="text-sm">{{ item.contactPhone }}</span>
              </a>
            </span>
            <span v-else>Не заполнено</span>
          </p>
          <p class="text-sm">
            <span class="font-medium">Этапы: </span>
            <span v-if="item.stages?.length" class="flex gap-2 mt-1 flex-wrap">
              <span
                v-for="(stage, i) in item.stages"
                :key="i"
                class="bg-blue-400 text-white px-2 py-1 rounded-md text-xs"
              >
                {{ i + 1 }}: {{ stage.name }}
              </span>
            </span>
            <span v-else>Не заполнено</span>
          </p>
          <p class="text-sm">
            <span class="font-medium">Зарплата: </span>
            <span v-if="item.salaryFrom">{{ item.salaryFrom }} - {{ item.salaryTo }}</span>
            <span v-else>Не заполнено</span>
          </p>
          <p class="text-sm">
            <span class="font-medium">Результат: </span>
            <span
              v-if="item.result"
              :class="{
                'bg-red-600 text-white px-2 py-1 rounded': item.result === 'Отказ',
                'bg-green-600 text-white px-2 py-1 rounded': item.result === 'Оффер',
              }"
            >
              {{ item.result }}
            </span>
            <span v-else>Не заполнено</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Десктопная версия -->
    <table v-else class="w-full shadow-md rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr class="text-left">
          <th class="p-4">Компания</th>
          <th class="p-4">Имя HR</th>
          <th class="p-4">Вакансия</th>
          <th class="p-4">Контакты</th>
          <th class="p-4">Пройденные этапы</th>
          <th class="p-4">Зарплатная вилка</th>
          <th class="p-4">Результат</th>
          <th class="p-4"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in interviews" :key="item.id" class="border-t border-gray-200">
          <td class="p-4">{{ item.company }}</td>
          <td class="p-4">{{ item.hrName || 'Не указано' }}</td>
          <td class="p-4">
            <a
              :href="item.vacancyLink"
              target="_blank"
              class="text-purple-600 hover:underline"
            >
              Ссылка на вакансию
            </a>
          </td>
          <td class="p-4">
            <div
              v-if="item.contactPhone || item.contactTelegram || item.contactWhatsApp"
              class="flex gap-4 items-center contacts relative"
            >
              <a
                v-if="item.contactTelegram"
                :href="`https://t.me/${item.contactTelegram}`"
                target="_blank"
                class="flex items-center gap-2 text-blue-500 hover:text-blue-700 "
              >
                <i class="pi pi-telegram sm:scale-140"></i>
                <span class="mini-modal">{{ item.contactTelegram }}</span>
              </a>
              <a
                v-if="item.contactWhatsApp"
                :href="`https://wa.me/${item.contactWhatsApp}`"
                target="_blank"
                class="flex items-center gap-2 text-green-500 hover:text-green-700 "
              >
                <i class="pi pi-whatsapp sm:scale-140"></i>
                <span class="mini-modal">{{ item.contactWhatsApp }}</span>
              </a>
              <a
                v-if="item.contactPhone"
                :href="`tel:${item.contactPhone}`"
                target="_blank"
                class="flex items-center gap-2 text-purple-700 hover:text-purple-900 "
              >
                <i class="pi pi-phone sm:scale-140"></i>
                <span class="mini-modal">{{ item.contactPhone }}</span>
              </a>
            </div>
            <span v-else>Не заполнено</span>
          </td>
          <td class="p-4">
            <div v-if="item.stages?.length" class="flex gap-2 flex-wrap">
              <div v-for="(stage, i) in item.stages" :key="i" class="relative">
                <div
                  class="bg-blue-400 text-white w-7 h-7 flex items-center justify-center rounded-full stage"
                >
                  {{ i + 1 }}
                </div>
                <div class="mini-modal">{{ stage.name }}</div>
              </div>
            </div>
            <span v-else>Не заполнено</span>
          </td>
          <td class="p-4">
            <span v-if="item.salaryFrom">{{ item.salaryFrom }} - {{ item.salaryTo }}</span>
            <span v-else>Не заполнено</span>
          </td>
          <td class="p-4">
            <span
              v-if="item.result"
              :class="{
                'bg-red-600 text-white px-2 py-1 rounded': item.result === 'Отказ',
                'bg-green-600 text-white px-2 py-1 rounded': item.result === 'Оффер',
              }"
            >
              {{ item.result }}
            </span>
            <span v-else>Не заполнено</span>
          </td>
          <td class="p-4 text-center">
            <router-link :to="`/interview/${item.id}`">
              <button class="pi pi-pencil bg-blue-500 text-white p-3 rounded-md text-xl"></button>
            </router-link>
            <button
              class="pi pi-trash bg-red-600 text-white p-3 rounded-md ml-2 text-xl"
              @click="modalOpen(item.id)"
            ></button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>

</style>