<template>
  <h1>Статистика</h1>
  <div class="card flex justify-center">
    <app-chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      class="w-full md:w-[30rem]"
    />
  </div>
</template>

<script setup lang="ts">
import type { IInterview } from '@/interfaces'
import { useUserStore } from '@/stores/user'
import type { ChartOptions } from 'chart.js'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { ref, onMounted } from 'vue'

const userStore = useUserStore()
const db = getFirestore()
const interviews = ref<IInterview[]>([])

const chartData = ref()
const chartOptions = ref<ChartOptions>({ plugins: { legend: { labels: {} } } })

onMounted(async () => {
  interviews.value = await getAllinterviews()
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const getAllinterviews = async <T extends IInterview>(): Promise<T[]> => {
  let getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc'),
  )

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

const setChartData = () => {
  const data: number[] = [0, 0, 0]
  interviews.value.forEach((interview: IInterview) => {
    if (interview.result === 'Оффер') {
      data[0]++
    } else if (interview.result === 'Отказ') {
      data[1]++
    } else {
      data[2]++
    }
  })
  return {
    labels: ['Оффер', 'Отказ', 'В процессе'],
    datasets: [
      {
        data,
        backgroundColor: ['#06B6D4', '#F97316', '#6B7280'],
        hoverBackgroundColor: ['#0891B2', '#EA580C', '#4B5563'],
      },
    ],
  }
}

const setChartOptions = () => {
  return {
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: '#374151',
        },
      },
    },
  }
}
</script>
