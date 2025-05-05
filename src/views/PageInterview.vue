<script setup lang="ts">
import AppLoader from '@/components/AppLoader.vue'
import type { IInterview } from '@/interfaces'
import { useUserStore } from '@/stores/user'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const db = getFirestore()
const route = useRoute()
const isLoading = ref<boolean>(true)


const interview = ref<IInterview>()

const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true

  const docSnap = await getDoc(docref)

  interview.value = docSnap.data() as IInterview
  isLoading.value = false
}


const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true

  await updateDoc(docref, { ...interview.value })
  await getData()
}

onMounted(async () => await getData())
</script>

<template>
  <AppLoader v-if="isLoading" />

  <main v-else-if="interview?.id && !isLoading" class="shadow-md p-5 sm:w-[50rem] my-20 sm:py-10 mx-auto">
    
    <h1 class="mb-5">Собеседование в компанию {{ interview.company }}</h1>

    <label for="company1">Компания</label>
    <input id="company1" type="text" class="inputInterview mb-5" v-model="interview.company" />

    <label for="link1">Описание вакансии (ссылка)</label>
    <input id="link1" type="text" class="inputInterview mb-5" v-model="interview.vacancyLink" />

    <label for="contact1">Контакт (имя)</label>
    <input id="contact1" type="text" class="inputInterview mb-5" v-model="interview.hrName" />

    <label for="tg1">Telegram username HR</label>
    <input id="tg1" type="text" class="inputInterview mb-5" v-model="interview.contactTelegram" />

    <label for="whatsapp1">WhatsApp HR</label>
    <input
      id="whatsapp1"
      type="text"
      class="inputInterview mb-5"
      v-model="interview.contactWhatsApp"
    />
    

    <label for="phone1">Телефон HR</label>
    <input id="phone1" type="text" class="inputInterview mb-5" v-model="interview.contactPhone" />

    <div class="flex gap-5">
      <div class="w-full">
        <label for="zp">Зп вилка от</label>
        <app-input
          id="zp"
          inputId="integeronly"
          fluid
          class="inputInterview"
          v-model="interview.salaryFrom"
        />
      </div>
      <div class="w-full">
        <label for="zp2">Зп вилка до</label>
        <app-input
          id="z2"
          inputId="integeronly"
          fluid
          class="inputInterview"
          v-model="interview.salaryTo"
        />
      </div>
    </div>

    <button class="bg-blue-500 hover:bg-blue-600 btn" @click="addStage">
      <span class="pi pi-plus"></span>
      <p>Добавить этап</p>
    </button>
    <template v-if="interview.stages">
      <div
        v-for="(stage, index) in interview.stages"
        :key="index"
        class="border-1 border-gray-100 p-5 rounded-xl mt-5"
      >
        <label :for="`stage-name-${index}`">Название этапа</label>
        <input
          type="text"
          :id="`stage-name-${index}`"
          class="inputInterview mb-5"
          v-model="stage.name"
        />

        <label :for="`stage-date-${index}`">Дата прохождение этапа</label>
        <input
          type="date"
          :id="`stage-date-${index}`"
          dateFormat="dd.mm.yy"
          class="inputInterview mb-5"
          v-model="stage.date"
        />

        <label :for="`stage-description-${index}`">Комментарий</label>
        <textarea
          :id="`stage-description-${index}`"
          class="inputInterview h-[7rem]"
          v-model="stage.description"
        ></textarea>

        <button class="bg-red-600 btn hover:bg-red-700" @click="removeStage(index)">
          Удалить этап
        </button>
      </div>
    </template>

    <div class="mt-6">
      <div class="flex gap-6">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            id="radio1"
            type="radio"
            name="status"
            value="Отказ"
            class="checked:border-red-600 checked:bg-red-600 radio"
            v-model="interview.result"
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
            v-model="interview.result"
          />
          <span class="text-gray-600 group-hover:text-green-600 transition-colors">Оффер</span>
        </label>
      </div>
    </div>

    <button class="bg-[#e40f79] hover:bg-[#c31c6f] btn" @click="saveInterview">
      <span class="pi pi-save"></span>
      <p>Сохранить</p>
    </button>
  </main>
</template>
