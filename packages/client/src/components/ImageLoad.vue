<template>
  <div class="image-load">
    <img class="poster-img" :src="`https://images.weserv.nl/?url=${src}`" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const { src } = defineProps(['src'])

const base64 = ref('')

defineOptions({
  name: 'ImageLoad',
})
</script>

<style lang="less" scoped>
.image-load {
  box-sizing: border-box;
}
</style>
