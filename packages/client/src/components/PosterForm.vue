<template>
  <t-drawer
    v-model:visible="visible"
    header="内容编辑"
    :close-btn="true"
    size="55%"
    :on-confirm="handleConfirm"
    @close="handleClose"
  >
    <div class="poster-form">
      <t-form
        ref="form"
        :rules="FORM_RULES"
        :data="displayFormData"
        :colon="true"
        @reset="onReset"
        @submit="onSubmit"
      >
        <t-form-item label="标题" name="title">
          <t-input
            v-model="displayFormData.title"
            placeholder="请输入内容"
            @enter="onEnter"
          ></t-input>
        </t-form-item>

        <t-form-item label="子标题" name="subTitle">
          <t-input
            v-model="displayFormData.subTitle"
            placeholder="请输入内容"
            @enter="onEnter"
          ></t-input>
        </t-form-item>

        <t-form-item label="海报" name="title">
          <t-row :gutter="16">
            <template v-for="(item, index) in displayFormData.posterList" :key="index">
              <t-col :span="4">
                <div style="display: flex; flex-direction: column; align-items: center">
                  <t-image
                    :src="displayFormData.posterList[index]"
                    :style="{ width: '100px', aspectRatio: 2 / 3 }"
                  />
                  <t-input v-model="displayFormData.posterList[index]" placeholder="请输入海报地址">
                    <template #suffixIcon>
                      <t-button size="small" @click.stop="handleSearch(index)">
                        <template #icon><SearchIcon /></template>TMDB
                      </t-button>
                    </template>
                  </t-input>
                </div>
              </t-col>
            </template>
          </t-row>
        </t-form-item>
      </t-form>
    </div>
    <PosterSearch v-model:visible="visibleShowInAttachedElement" @update="updatePoster" />
    <!-- <t-dialog
      v-model:visible="visibleShowInAttachedElement"
      header="对话框仅展示在挂载元素区域"
      destroy-on-close
      :show-in-attached-element="true"
      placement="center"
      :on-confirm="() => (visibleShowInAttachedElement = false)"
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
            <t-option v-for="item in options2" :key="item.id" :value="item.value">
              <t-space>
                <t-image :src="item.value" :style="{ width: '50px', aspectRatio: 2 / 3 }" />
                <div class="tdesign-demo__user-option-info">
                  <div>{{ item.label }}</div>
                </div>
              </t-space>
            </t-option>
          </t-select>
        </div>
      </template>
    </t-dialog> -->
  </t-drawer>
</template>
<script setup lang="ts">
import { ref, reactive, watch, watchEffect, toValue } from 'vue'
import {
  MessagePlugin,
  type FormProps,
  type FormInstanceFunctions,
  type InputProps,
  type DrawerProps,
} from 'tdesign-vue-next'
import { SearchIcon } from 'tdesign-icons-vue-next'
import PosterSearch from '@/components/PosterSearch.vue'

const visible = defineModel('visible')

const { posterData } = defineProps(['posterData'])

const emit = defineEmits<{
  change: [id: number]
  update: [formData: object]
}>()

const visibleShowInAttachedElement = ref(false)

const FORM_RULES: FormProps['rules'] = {
  title: [
    {
      required: true,
      message: '姓名必填',
    },
  ],
}

const displayFormData: FormProps['data'] = ref({})
watch(
  () => posterData,
  (newValue) => {
    displayFormData.value = newValue
  },
  { immediate: true },
)

const form = ref<FormInstanceFunctions>(null)
const onReset: FormProps['onReset'] = () => {
  MessagePlugin.success('重置成功')
}
const onSubmit: FormProps['onSubmit'] = ({ validateResult, firstError }) => {
  if (validateResult === true) {
    MessagePlugin.success('提交成功')
  } else {
    console.log('Validate Errors: ', firstError, validateResult)
  }
}

const submitForm = async () => {
  form.value.submit()
  form.value.submit({
    showErrorMessage: false,
  })

  // 校验数据，代码有效，勿删
  // form.value.validate();

  // 校验数据：只提交和校验，不在表单中显示错误文本信息。下方代码有效，勿删
  // form.value.validate({ showErrorMessage: false }).then((validateResult) => {
  //   if (validateResult && Object.keys(validateResult).length) {
  //     const firstError = Object.values(validateResult)[0]?.[0]?.message;
  //     MessagePlugin.warning(firstError);
  //   }
  // });
}

const resetForm = () => {
  form.value.reset()
  // 下方为示例代码，有效，勿删
  // form.value.reset({ type: 'initial' });
  // form.value.reset({ type: 'empty' });
  // form.value.reset({ type: 'initial', fields: ['name'] });
  // form.value.reset({ type: 'empty', fields: ['name'] });
}

const validateOnly = async () => {
  const result = await form.value.validateOnly()
  MessagePlugin.success('打开控制台查看校验结果')
  console.log('validateOnly', result)
}

// 禁用 Input 组件，按下 Enter 键时，触发 submit 事件
const onEnter: InputProps['onEnter'] = (_, { e }) => {
  e.preventDefault()
}

const updatePosterIndex = ref(0)

const handleSearch = (index: number) => {
  updatePosterIndex.value = index
  visibleShowInAttachedElement.value = true
}

const updatePoster = (poster: string) => {
  console.log('[ value ]-256-「components/PosterForm.vue」', poster)
  displayFormData.value.posterList[updatePosterIndex.value] = poster
}

const handleConfirm: DrawerProps['onConfirm'] = () => {
  visible.value = false
  emit('update', displayFormData.value)
}

const handleClose: DrawerProps['onClose'] = () => {
  visible.value = false
}
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
