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
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const db = getFirestore()
const isModalOpen = ref<boolean>(false)
const interviewId = ref<string>('')
const isLoading = ref<boolean>(true)

const interviews = ref<IInterview[]>([])
const selectedFilterResult = ref<string>('')

const getAllinterviews = async <T extends IInterview>(isFilter?: boolean): Promise<T[]> => {
  let getData

  if (isFilter) {
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

  return listDocs.docs.map((doc) => doc.data() as T)
}

const fetchAndSetInterviews = async (isFilter: boolean = false): Promise<void> => {
  isLoading.value = true

  const listInterviews: Array<IInterview> = await getAllinterviews(isFilter)
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
  fetchAndSetInterviews(true)
}

const clearFilter = async (): Promise<void> => {
  fetchAndSetInterviews()

  selectedFilterResult.value = ''
}

onMounted(async () => {
  fetchAndSetInterviews()
})
</script>

<template>
  <AppLoader v-if="isLoading" />
  <AppModal v-if="isModalOpen" @close="modalClose" @delete="deleteInterview(interviewId)" />
  <div v-if="!interviews.length && !isLoading" class="flex flex-col">
    <h1 class="text-center">Cписок пуст</h1>
    <img
      src="https://giffiles.alphacoders.com/188/188576.gif"
      alt="1000-7"
      class="h-[calc(100vh-10rem)]"
    />
  </div>
  <main v-else>
    <h1 class="font-bold text-3xl mb-3 mt-10">Список собеседований</h1>
    <div class="my-6">
      <div class="flex gap-5">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            id="radio1"
            type="radio"
            name="status"
            value="Отказ"
            class="checked:border-red-600 checked:bg-red-600 radio"
            v-model="selectedFilterResult"
          />
          <span class="text-gray-600 group-hover:text-red-600 transition-colors">Отказ</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            id="radio2"
            type="radio"
            name="status"
            value="Оффер"
            class="checked:border-green-600 checked:bg-green-600 radio"
            v-model="selectedFilterResult"
          />
          <span class="text-gray-600 group-hover:text-green-600 transition-colors">Оффер</span>
        </label>
        <button
          class="bg-[#00aa36] text-white rounded-xl p-2"
          @click="submitFilter"
          :disabled="!selectedFilterResult"
          :class="{ 'opacity-50 cursor': !selectedFilterResult }"
        >
          Сохранить
        </button>
        <button
          class="bg-[#c4072d] text-white rounded-xl p-2"
          :disabled="!selectedFilterResult"
          :class="{ 'opacity-50 cursor': !selectedFilterResult }"
          @click="clearFilter"
        >
          Сбросить
        </button>
      </div>
    </div>
    <table class="shadow-md w-full">
      <thead class="bg-gray-100">
        <tr class="text-left">
          <th>Компания</th>
          <th>Имя HR</th>
          <th>Вакансия</th>
          <th>Контакты</th>
          <th>Пройденные этапы</th>
          <th>Зарплатная вилка</th>
          <th>Результат</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in interviews" :key="item.id">
          <td>{{ item.company }}</td>
          <td>{{ item.hrName }}</td>
          <td>
            <a class="text-[#9c69c8]" :href="item.vacancyLink" target="_blank">
              Ссылка на вакансию
            </a>
          </td>
          <td v-if="item.contactPhone || item.contactTelegram || item.contactWhatsApp" class="flex gap-6 contacts">
            <a
              v-if="item.contactTelegram"
              :href="`https://t.me/${item.contactTelegram}`"
              target="_blank"
              class="pi pi-telegram text-[#0088cc] scale-145"
            >
              <span class="mini-modal">{{ item.contactTelegram }}</span>
            </a>
            <a
              v-if="item.contactWhatsApp"
              :href="`https://wa.me/${item.contactWhatsApp}`"
              target="_blank"
              class="pi pi-whatsapp text-[#25d366] scale-135"
              ><span class="mini-modal">{{ item.contactWhatsApp }}</span></a
            >
            <a
              v-if="item.contactPhone"
              :href="`tel:${item.contactPhone}`"
              target="_blank"
              class="pi pi-phone text-[#371777] scale-135"
              ><span class="mini-modal">{{ item.contactPhone }}</span></a
            >
          </td>
          <td v-else>Не заполнено</td>
          <td v-if="item.stages?.length">
            <div class="flex gap-1">
              <div v-for="(stage, i) in item.stages" :key="i" class="relative">
                <div
                  class="bg-blue-400 text-white w-7 h-7 flex items-center justify-center rounded-full stage"
                >
                  {{ i + 1 }}
                </div>
                <!-- Modal -->
                <div class="mini-modal">
                  {{ stage.name }}
                </div>
              </div>
            </div>
          </td>
          <td v-else>Не заполнено</td>
          <td v-if="item.salaryFrom">{{ item.salaryFrom }} - {{ item.salaryTo }}</td>
          <td v-else>Не заполнено</td>
          <td v-if="item.result">
            <div
              :class="{
                'bg-red-600 offer': item.result === 'Отказ',
                'bg-green-600 offer': item.result === 'Оффер',
              }"
            >
              {{ item.result }}
            </div>
          </td>
          <td v-else>Не заполнено</td>

          <td class="text-center">
            <router-link :to="`/interview/${item.id}`">
              <button class="pi pi-pencil bg-blue-500 text-white p-3 rounded-md"></button>
            </router-link>
            <button
              class="pi pi-trash bg-red-600 text-white p-3 rounded-md ml-2"
              @click="modalOpen(item.id)"
            ></button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
td,
th {
  padding: 1rem;
}

td {
  border-top: 1px solid #e6e6e6;
}

.p-tooltip-top {
  box-flex-group: black;
}

.stage:hover + .mini-modal {
  display: block;
  bottom: 35px;
}

.contacts > a:hover > span {
  display: block;
}

.cursor {
  cursor: not-allowed;
}
</style>
