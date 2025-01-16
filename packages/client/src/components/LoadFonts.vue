<template>
  <div>
    <h3>选择字体：</h3>
    <ul>
      <li
        v-for="font in fonts"
        :key="font.name"
        @click="loadFont(font)"
        :style="{ fontFamily: font.name }"
        class="font-item"
      >
        {{ font.name }}
      </li>
    </ul>
    <p v-if="loading">加载中: {{ progress }}%</p>
    <p v-else-if="currentFont">当前字体: {{ currentFont }}</p>
  </div>
</template>

<script setup lang="ts">
import applyFont from '@/utils/loadFont'
import { ref } from 'vue'

// 定义字体类型
interface Font {
  name: string
  url: string
}

// 字体列表
const fonts: Font[] = [
  { name: 'Roboto', url: 'https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxP.ttf' },
  { name: 'OpenSans', url: 'https://fonts.gstatic.com/s/opensans/v28/mem8YaGs126MiZpBA-U1Ug.ttf' },
  { name: 'Lobster', url: 'https://fonts.gstatic.com/s/lobster/v23/neILzCirqoswsqX9zoKmNg.ttf' },
  {
    name: 'Pacifico',
    url: 'https://fonts.gstatic.com/s/pacifico/v23/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.ttf',
  },
  {
    name: 'Ma Shan Zheng',
    url: 'https://fonts.gstatic.com/s/mashanzheng/v13/NaPecZTRCLxvwo41b4gvzkXaRMHsCoRTJKKTqxFXqIji1hn3wSpSEA3eSpJy0awdsFt2Zfc6SSE.5.woff2',
  },
]

// 加载状态和当前字体
const loading = ref(false)
const progress = ref(0)
const currentFont = ref('')

// 加载字体方法
const loadFont = async (font: Font) => {
  // 检查缓存
  const cachedFont = localStorage.getItem(font.name)
  if (cachedFont) {
    applyFont(font.name, cachedFont)
    return
  }

  loading.value = true
  progress.value = 0

  try {
    const fontBlob = await fetchFontWithProgress(font.url)
    const fontUrl = URL.createObjectURL(fontBlob)

    // 缓存字体到 localStorage
    localStorage.setItem(font.name, fontUrl)

    applyFont(font.name, fontUrl)
  } catch (error) {
    console.error('字体加载失败:', error)
  } finally {
    loading.value = false
  }
}

// 使用 fetch 获取字体文件并实时更新进度
const fetchFontWithProgress = async (url: string): Promise<Blob> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch font: ${response.statusText}`)

  const contentLength = response.headers.get('content-length')
  if (!contentLength) throw new Error('Content-Length header is missing')

  const total = parseInt(contentLength, 10)
  let loaded = 0

  const reader = response.body?.getReader()
  if (!reader) throw new Error('Failed to get reader from response body')

  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    if (value) {
      chunks.push(value)
      loaded += value.length
      progress.value = Math.floor((loaded / total) * 100)
    }
  }

  return new Blob(chunks)
}

// // 应用字体
// const applyFont = (fontName: string, fontUrl: string) => {
//   const fontFace = new FontFace(fontName, `url(${fontUrl})`)
//   fontFace
//     .load()
//     .then((loadedFont) => {
//       document.fonts.add(loadedFont)
//       currentFont.value = fontName
//       console.log('[ fontName ]-113-「components/LoadFonts.vue」', fontName)
//       // document.body.style.fontFamily = fontName // 设置全局字体
//     })
//     .catch((error) => {
//       console.error('应用字体失败:', error)
//     })
// }
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
.font-item {
  cursor: pointer;
  margin: 5px 0;
}
.font-item:hover {
  text-decoration: underline;
}
</style>
