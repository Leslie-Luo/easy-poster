<script setup lang="ts">
import PosterForm from '@/components/PosterForm.vue'
import TemplateOne from '@/components/Template-One.vue'
import type { FormProps } from 'tdesign-vue-next'
import { reactive, ref } from 'vue'

const visible = ref(true)
const displayInfo = ref({})

const posterData: FormProps['data'] = reactive({
  title: '电影',
  subTitle: 'Movie',
  posterList: [
    'https://media.themoviedb.org/t/p/original/imKSymKBK7o73sajciEmndJoVkR.jpg',
    'https://media.themoviedb.org/t/p/original/d8Ryb8AunYAuycVKDp5HpdWPKgC.jpg',
    'https://media.themoviedb.org/t/p/original/m0SbwFNCa9epW1X60deLqTHiP7x.jpg',
    'https://media.themoviedb.org/t/p/original/9knPvD6GLtl1w4pamRomyQKHXyj.jpg',
    'https://media.themoviedb.org/t/p/original/1y3TG8N8zwwMxqh0qzdyDs3IyCq.jpg',
    'https://media.themoviedb.org/t/p/original/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    'https://media.themoviedb.org/t/p/original/pnXLFioDeftqjlCVlRmXvIdMsdP.jpg',
    'https://media.themoviedb.org/t/p/original/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg',
    'https://media.themoviedb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  ],
})

const formUpdate = (data: object) => {
  console.log(data)
  // posterData.value = data
}
</script>

<template>
  <PosterForm v-model:visible="visible" :posterData="posterData" @update="formUpdate" />
  <TemplateOne :displayInfo="posterData" />
</template>
