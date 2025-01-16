<template>
  <t-dialog
    v-model:visible="visible"
    header="对话框仅展示在挂载元素区域"
    destroy-on-close
    :show-in-attached-element="true"
    placement="center"
    :on-confirm="handleConfirm"
  >
    <template v-slot:body>
      <div>
        <t-select
          v-model="tmdbSearchValue"
          filterable
          placeholder="请输入搜索"
          :loading="loading2"
          reserve-keyword
          style="width: 400px; display: inline-block"
          @search="remoteMethod"
          :popup-props="{ overlayClassName: 'tdesign-demo-select__overlay-option' }"
        >
          <t-option v-for="item in options2" :key="item.id" :value="item.value" :label="item.label">
            <t-space>
              <t-image :src="item.value" :style="{ width: '50px', aspectRatio: 2 / 3 }" />
              <div class="tdesign-demo__user-option-info">
                <div>{{ item.label }}</div>
                <!-- <div class="tdesign-demo__user-option-desc">{{ item.description }}</div> -->
              </div>
            </t-space>
          </t-option>
        </t-select>
      </div>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type SelectProps } from 'tdesign-vue-next'
import { tmdbSearch } from '@/api/tmdb'

const visible = defineModel('visible')

const emit = defineEmits<{
  update: [poster: string]
}>()

const handleConfirm = () => {
  visible.value = false
  emit('update', tmdbSearchValue.value)
}

const tmdbSearchValue = ref('')
const options2 = ref<SelectProps['options']>([])
const loading2 = ref(false)

const remoteMethod: SelectProps['onSearch'] = (search) => {
  console.log('[ search ]-221-「components/PosterForm.vue」', search)
  tmdbSearch({
    keyword: search,
  }).then((res) => {
    console.log('[ res ]-224-「components/PosterForm.vue」', res)
    options2.value = res.results.map((item: object) => ({
      label: item.title,
      value: item.image,
    }))
  })
}

defineOptions({
  name: 'PosterSearch',
})
</script>

<style>
.tdesign-demo-select__overlay-option .t-select-option {
  height: 100%;
  padding: 8px;
}
</style>

<style lang="less" scoped>
.poster-form {
  box-sizing: border-box;
}
:global(.tdesign-demo-select__overlay-option) {
  .t-select-option {
    height: 100%;
    padding: 8px;
  }
}

:slotted(.t-select-option) {
  height: 100%;
  padding: 8px;
}
:slotted(.tdesign-demo__user-option) {
  display: flex;
  .img {
    max-width: 40px;
    max-height: 40px;
  }

  .tdesign-demo__user-option-desc {
    font-size: 14px;
    color: var(--td-text-color-secondary);
  }

  .tdesign-demo__user-option-info {
    margin-left: 16px;
  }

  .t-select-option {
    height: 100%;
    padding: 8px;
  }
}
</style>
