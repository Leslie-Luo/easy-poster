<script setup lang="ts">
import LoadFonts from './LoadFonts.vue'
import ImageLoad from './ImageLoad.vue'
import { reactive, ref, watchEffect } from 'vue'
import html2canvas from 'html2canvas'

const { displayInfo } = defineProps(['displayInfo'])

const poster = ref([])

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  return array.reduce<T[][]>((result, item, index) => {
    const chunkIndex = Math.floor(index / size)
    if (!result[chunkIndex]) {
      result[chunkIndex] = [] // 创建新的子数组
    }
    result[chunkIndex].push(item)
    return result
  }, [])
}

watchEffect(async () => {
  poster.value = chunkArray(displayInfo.posterList, 3)
})

const exportToPng = async () => {
  const canvas = await html2canvas(document.querySelector('.display') as HTMLElement, {
    useCORS: true,
    scale: 4, // 增加清晰度
  })
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = 'poster.png'
  a.click()
}
</script>

<template>
  <div ref="captureArea" class="display">
    <div class="display-info">
      <div class="title">{{ displayInfo.title }}</div>
      <div class="sub-title">{{ displayInfo.subTitle }}</div>
    </div>
    <div class="display-poster">
      <div class="poster-list" v-for="(item, index) in 3" :key="index">
        <div class="poster" v-for="(items, indexs) in poster[index]" :key="indexs">
          <ImageLoad :src="poster[index][indexs]" />
        </div>
      </div>
    </div>
  </div>
  <t-button theme="primary" @click="exportToPng"> 导出 </t-button>

  <LoadFonts />
</template>

<style lang="less">
.display {
  width: 960px;
  height: 540px;
  display: flex;
  overflow: hidden;
  background-color: #61649f;
  position: relative;
  align-items: center;

  .display-info {
    flex: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    padding-left: 30px;

    .title {
      font-family: 'Ma Shan Zheng', serif;
      font-size: 30px;
      color: #fff;
    }
    .sub-title {
      font-family: Lobster;
      color: #fff;
    }
  }

  .display-poster {
    display: flex;
    column-gap: 18px;
    margin-right: -45px;
  }

  .poster-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    transform: rotate(16deg);
    transform-origin: left center;

    .poster {
      flex-shrink: 0;
      width: 180px;
      aspect-ratio: 2 / 3;
      border-radius: 12px;
      overflow: hidden;

      .poster-img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
