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
} from 'firebase/firestore'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const db = getFirestore()
const isModalOpen = ref<boolean>(false)
const interviewId = ref<string>('')
const isLoading = ref<boolean>(true)

const interviews = ref<IInterview[]>([])

const getAllinterviews = async <T extends IInterview>(): Promise<T[]> => {
  const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc'),
  )

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
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

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllinterviews()
  interviews.value = [...listInterviews]
  isLoading.value = false
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
    <table class="shadow-md w-full">
      <thead class="bg-gray-100">
        <tr class="text-left">
          <th class="w-2/12">Компания</th>
          <th class="w-2/12">Имя HR</th>
          <th class="w-5/12">Вакансия</th>
          <th class="w-1/12">Контакты</th>
          <th class="w-2/12"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in interviews" :key="item.id">
          <td>{{ item.company }}</td>
          <td>{{ item.hrName }}</td>
          <td>
            <a class="text-[#9c69c8]" :href="item.vacancyLink" target="_blank">{{
              item.vacancyLink
            }}</a>
          </td>
          <td class="flex gap-6">
            <a
              v-if="item.contactTelegram"
              :href="`https://t.me/${item.contactTelegram}`"
              target="_blank"
              class="pi pi-telegram text-[#0088cc] scale-145"
            ></a>
            <a
              v-if="item.contactWhatsApp"
              :href="`https://wa.me/${item.contactWhatsApp}`"
              target="_blank"
              class="pi pi-whatsapp text-[#25d366] scale-135"
            ></a>
            <a
              v-if="item.contactPhone"
              :href="`tel:${item.contactPhone}`"
              target="_blank"
              class="pi pi-phone text-[#371777] scale-135"
            ></a>
          </td>
          <td class="text-center">
            <router-link :to="`/interview/${item.id}`">
              <button class="pi pi-pencil bg-blue-500 text-white p-2 rounded-md"></button>
            </router-link>
            <button
              class="pi pi-trash bg-red-600 text-white p-2 rounded-md ml-5"
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
</style>
